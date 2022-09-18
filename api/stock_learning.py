from random import Random
import stock_data as sd
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt


def make_predictions(model,data,features,train_end,test_end):
    test = data.iloc[train_end:test_end]
    preds = model.predict(test[features])
    preds = pd.Series(preds,index=test.index)
    print('predictions')
    print(preds.head())
    return preds 

def analyze_predictions(preds,data,train_end,test_end):
    test = data.iloc[train_end:test_end]
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
    comparison['targetUp_predictionUp'] = (combined['target_binary'] == 1) & (combined['prediction_binary'] == 1)
    comparison['targetDown_predictionDown'] = (combined['target_binary'] == 0) & (combined['prediction_binary'] == 0)
    comparison['targetUp_predictionDown'] = (combined['target_binary'] == 1) & (combined['prediction_binary'] == 0)
    comparison['targetDown_predictionUp'] = (combined['target_binary'] == 0) & (combined['prediction_binary'] == 1)

    trials = len(combined.index)
    comparison['targetUp'] = (combined['target_binary'] == 1)
    comparison['targetDown'] = (combined['target_binary'] == 0)

    comparison['predictionUp'] = (combined['prediction_binary'] == 1)
    comparison['predictionDown'] = (combined['prediction_binary'] == 0)

    comparison['correct'] = combined['target_binary'] == combined['prediction_binary']
    comparison.index = combined.index
    print('comparison: ',comparison.head())

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


def first_model(data,features,train_start,train_end):
    train = data.iloc[train_start:train_end]
    #test = data.iloc[-500:-200]
    print('train is: ',train.head())
    print('features is: ',features)

    model = RandomForestClassifier(n_estimators=100,min_samples_split=100,random_state=1)
    model.fit(train[features],train['target_binary'])
    return model

#def setup_data(history,step,max_days,features):
def setup_model_data(history,step,max_days):
    normalize = True #should be removed at some point
    stockData_list =[]
    history_columns = history.columns
    price_feature_cols = ['Open','Close','High','Low']
    additional_feature_cols = []
    feature_cols = []

    prepared_data = sd.prep_data(history, 1, 'Linear', 'Open/Close')
    print('prepared_data is: ',prepared_data.keys())
    stock_output = prepared_data['stock']

    stock_history = pd.merge(stock_output,history,on='Date',how='inner')
    stock_history['Type'] = prepared_data['type_index']
    stock_history['last_price'] = stock_history['price'].shift(1)
    stock_history[history_columns] = stock_history[history_columns].shift(2)
    stock_history['last_derivative'] = stock_history['derivative'].shift(1) #should this be shited by 2?
    additional_feature_cols.extend(['last_derivative','last_price'])
    print('stock_history is: ',stock_history.head())
    print('columns are: ',stock_history.columns)

    stock_history['target_binary'] = (stock_history['price'] > stock_history['last_price']).astype(int)
    
    
    for days_to_trail in range(step,max_days,step):
        stockData = sd.build_stock_list(
            stock_history,
            prepared_data['date_index'],
            prepared_data['type_index'],
            days_to_trail,
            'price',
            prepared_data['avg_type'],
            stock_history,
            2)

        stockData_list.append(stockData)
        stock_history = pd.merge(stock_history,stockData['avg_df'],on=['Date','Type'],how='left')
        print('stock_history is: ',stock_history.head())
        print('columns are: ',stock_history.columns)

    stock_history = stock_history.set_index([stock_history.index,stock_history['Type']])
    print('stock_history is: ',stock_history.head())
    print('columns are: ',stock_history.columns)

    if (normalize):
        normalized_cols = []
        for col in price_feature_cols:
            normalized_name = str(col + "_normalized")
            normalized_cols.append(normalized_name)
            stock_history[normalized_name] = stock_history[col] / stock_history["last_price"]
        feature_cols = normalized_cols.copy()
    else:
        feature_cols = price_feature_cols.copy()
    
    feature_cols.extend(additional_feature_cols)
    print("features are: ",feature_cols)

    return {"data":stock_history,"features":feature_cols,"stockDataList":stockData_list,"max":max_days}

