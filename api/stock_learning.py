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
    print(test['target_close_binary'])
    print(preds)
    score = precision_score(test['target_close_binary'],preds)
    print("prediction score: "+str(score))
    combined = pd.concat([test['target_close_binary'],preds],axis=1)
    combined.plot()
    plt.show()


def first_model(data,features):
    train = data.iloc[100:-300]
    #test = data.iloc[-500:-200]

    model = RandomForestClassifier(n_estimators=100,min_samples_split=100,random_state=1)
    model.fit(train[features],train['target_close_binary'])
    return model

def setup_data(sym):
    step = 20
    max_days = 100

    feature_cols = ['Open','Close','High','Low','Volume']

    stock_history = sd.get_history(sym)
    stock_history['target_close_price'] = stock_history['Close'].shift(-1)
    stock_history['target_close_binary'] = (stock_history['target_close_price'] > stock_history['Close']).astype(int)
    stock_history['Close_change'] = stock_history['Close'].pct_change()
    for days_to_trail in range(step,max_days,step):
        col_name_avg = 'Avg_Close_'+str(days_to_trail)
        feature_cols.append(col_name_avg)
        stock_history[col_name_avg] = 0
        col_name_min = 'Min_'+str(days_to_trail)
        feature_cols.append(col_name_min)
        stock_history[col_name_min] = 0
        col_name_max = 'Max_'+str(days_to_trail)
        feature_cols.append(col_name_max)
        stock_history[col_name_max] = 0

        avg_list = []
        for day in range(days_to_trail,stock_history.shape[0] - 1): #has to start far enough along to calc a trailing average
            day_avg = sd.computeAvg(stock_history['Close'],day,days_to_trail,'Constant')
            avg_list.append(day_avg) #add average to list
            today_day = stock_history.index[day]
            stock_history.loc[today_day,col_name_avg] = day_avg

            [day_min,day_max] = trailingMinsAndMaxs(stock_history,day,days_to_trail)
            stock_history.loc[today_day,col_name_min] = day_min
            stock_history.loc[today_day,col_name_max] = day_max




    #regressor = DecisionTreeRegressor(random_state=0)

    return {"data":stock_history,"features":feature_cols}

def trailingMinsAndMaxs(stock_df,this_day,trail_days):
    
    short_stock_df = stock_df.iloc[this_day-trail_days+1:this_day+1]
    current_min = short_stock_df['Low'].min()
    current_max = short_stock_df['High'].max()

    return [current_min,current_max]


def computeAvgMaybe(stock,this_day,trail_days,type):
    weighted_sum = 0
    day_list = range(1,trail_days+1)


    if (type == 'Constant'):
        coef_list = [d**0 for d in day_list]
    elif (type == 'Linear'):
        coef_list = [d for d in day_list]
    elif (type == 'Quadratic'):
        coef_list = [d**2 for d in day_list]
    elif (type == 'Exponential'):
        coef_list = [2**d for d in day_list]
    else:
        coef_list = [d**0 for d in day_list]

    for s,c in zip(stock.iloc[this_day-trail_days+1:this_day+1],coef_list):
        weighted_sum += s*c
        if (s > current_max):
            current_max = s
        if (s < current_min):
            current_min = s

    
    return {'avg':weighted_sum/sum(coef_list),'high':current_max,'low':current_min}