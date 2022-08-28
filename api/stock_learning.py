from random import Random
import stock_data as sd
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score
import matplotlib.pyplot as plt


def make_predictions(model,data,features):
    test = data.iloc[-300:-100]
    preds = model.predict(test[features])
    preds = pd.Series(preds,index=test.index)
    print('predictions')
    print(preds.head())
    return preds 

def analyze_predictions(preds,data):
    test = data.iloc[-300:-100]
    target = test['target_binary']
    print(target)
    print(preds)
    score = precision_score(target,preds)
    print("prediction score: "+str(score))

    combined = pd.concat([target,preds],axis=1)
    #cols = combined.columns
    #combined.rename(columns={cols[1]:"prediction_close_binary"})
    combined.columns = ['target_binary','prediction_binary']
    print(combined.head())
    print(combined.columns)
    comparison = pd.DataFrame()
    comparison['targetUp_predictionUp'] = (combined['target_close_binary'] == 1) & (combined['prediction_close_binary'] == 1)
    comparison['targetDown_predictionDown'] = (combined['target_close_binary'] == 0) & (combined['prediction_close_binary'] == 0)
    comparison['targetUp_predictionDown'] = (combined['target_close_binary'] == 1) & (combined['prediction_close_binary'] == 0)
    comparison['targetDown_predictionUp'] = (combined['target_close_binary'] == 0) & (combined['prediction_close_binary'] == 1)

    trials = len(combined.index)
    comparison['targetUp'] = (combined['target_close_binary'] == 1)
    comparison['targetDown'] = (combined['target_close_binary'] == 0)

    comparison['predictionUp'] = (combined['prediction_close_binary'] == 1)
    comparison['predictionDown'] = (combined['prediction_close_binary'] == 0)

    comparison['correct'] = combined['target_close_binary'] == combined['prediction_close_binary']
    comparison.index = combined.index
    print(comparison.head())

    splits = {
        'against targets':{'targetUp_predictionUp':(comparison['targetUp_predictionUp'].sum()/comparison['targetUp'].sum())*100,
        'targetDown_predictionDown':(comparison['targetDown_predictionDown'].sum()/comparison['targetDown'].sum())*100,
        'targetUp_predictionDown':(comparison['targetUp_predictionDown'].sum()/comparison['targetUp'].sum())*100,
        'targetDown_predictionUp':(comparison['targetDown_predictionUp'].sum()/comparison['targetDown'].sum())*100},

        'against predictions':{'targetUp_predictionUp':(comparison['targetUp_predictionUp'].sum()/comparison['predictionUp'].sum())*100,
        'targetDown_predictionDown':(comparison['targetDown_predictionDown'].sum()/comparison['predictionDown'].sum())*100,
        'targetUp_predictionDown':(comparison['targetUp_predictionDown'].sum()/comparison['predictionDown'].sum())*100,
        'targetDown_predictionUp':(comparison['targetDown_predictionUp'].sum()/comparison['predictionUp'].sum())*100},
        'correct':{comparison['correct'].sum()/trials}
    }
    print(splits)

    return comparison

    #combined.plot()
    #plt.show()


def first_model(data,features):
    train = data.iloc[100:-300]
    #test = data.iloc[-500:-200]

    model = RandomForestClassifier(n_estimators=100,min_samples_split=100,random_state=1)
    model.fit(train[features],train['target_binary'])
    return model

#def setup_data(history,step,max_days,features):
def setup_model_data(history,step,max_days):

    history_columns = history.columns
    feature_cols = ['High','Low','Volume']
    feature_cols_semi_normalized = ['High','Low','Volume']

    prepared_data = sd.prep_data(history, 1, 'Linear', 'Open/Close')
    print('prepared_data is: ',prepared_data.keys())
    stock_output = prepared_data['stock']

    stock_history = pd.merge(stock_output,history,on='Date',how='inner')
    stock_history['Type'] = prepared_data['type_index']
    stock_history['last_price'] = stock_history['price'].shift(1)
    stock_history[history_columns] = stock_history[history_columns].shift(2)
    print('stock_history is: ',stock_history.head())
    print('columns are: ',stock_history.columns)


    stock_history['target_binary'] = (stock_history['price'] > stock_history['last_price']).astype(int)
    stock_history['price_change'] = stock_history['price'].pct_change()
    feature_cols.append('price_change')
    feature_cols_semi_normalized.append('price_change')
    for days_to_trail in range(step,max_days,step):
        stockData = sd.build_stock_list(
            stock_history,
            prepared_data['date_index'],
            prepared_data['type_index'],
            #(days_to_trail * 2),
            days_to_trail,
            'price',
            prepared_data['avg_type'],
            stock_history,
            2
            )

        stock_history = pd.merge(stock_history,stockData['avg_df'],on=['Date','Type'],how='left')
        print('stock_history is: ',stock_history.head())
        print('columns are: ',stock_history.columns)
        
        if (False):
            col_name_avg = 'Avg_Close_'+str(days_to_trail)
            col_name_avg_sn = 'Avg_Close_sn_'+str(days_to_trail)
            feature_cols.append(col_name_avg)
            feature_cols_semi_normalized.append(col_name_avg_sn)
            stock_history[col_name_avg] = 0
            stock_history[col_name_avg_sn] = 0

            col_name_min = 'Min_'+str(days_to_trail)
            col_name_min_sn = 'Min_sn_'+str(days_to_trail)
            feature_cols.append(col_name_min)
            feature_cols_semi_normalized.append(col_name_min_sn)
            stock_history[col_name_min] = 0
            stock_history[col_name_min_sn] = 0

            col_name_max = 'Max_'+str(days_to_trail)
            col_name_max_sn = 'Max_'+str(days_to_trail)
            feature_cols.append(col_name_max)
            feature_cols_semi_normalized.append(col_name_max)
            stock_history[col_name_max] = 0
            stock_history[col_name_max_sn] = 0

            avg_list = []
            for day in range(days_to_trail,stock_history.shape[0] - 1): #has to start far enough along to calc a trailing average
                day_avg = sd.computeAvg(stock_history['price'],day,days_to_trail,'Constant')
                avg_list.append(day_avg) #add average to list
                today_day = stock_history.index[day]
                #stock_history.loc[today_day,col_name_avg] = day_avg

                [day_min,day_max] = trailingMinsAndMaxs(stock_history,day,days_to_trail)
                #stock_history.loc[today_day,col_name_min] = day_min
                #stock_history.loc[today_day,col_name_max] = day_max

                raw_price = stock_history.loc[today_day,"price"]

                day_avg_sn = (day_avg - raw_price)/raw_price
                day_min_sn = (raw_price - day_min)/raw_price
                day_max_sn = (day_max - raw_price)/raw_price
                #stock_history.loc[today_day,col_name_avg_sn] = day_avg_sn
                #stock_history.loc[today_day,col_name_min_sn] = day_min_sn
                #stock_history.loc[today_day,col_name_max_sn] = day_max_sn
    

    return {"data":stock_history,"features":feature_cols}

def trailingMinsAndMaxs(stock_df,this_day,trail_days):
    
    short_stock_df = stock_df.iloc[this_day-trail_days+1:this_day+1]
    current_min = short_stock_df['Low'].min()
    current_max = short_stock_df['High'].max()

    return [current_min,current_max]
