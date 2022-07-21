import yfinance as yf
import pandas as pd

average_list = ['Constant','Linear','Quadratic','Exponential']
sample_list = ['Close','Open','High','Low']



#gets the entire stock's price history
def get_history(sym):
    stock = yf.Ticker(sym)
    return(stock.history(period = 'max'))

print(get_history('voo'))

def get_open(sym):
    return get_history(sym).Open

def get_high(sym):
    return get_history(sym).High

def get_low(sym):
    return get_history(sym).Low

def get_close(sym):
    return get_history(sym).Close

def get_volume(sym):
    return get_history(sym).Volume

#calculates trailing average for a specific number of days
def trailing_avg(sym, days, avg_type, sample_type):
    if (sample_type == 'close'):
        stock = get_close(sym)
    elif (sample_type == 'open'):
        stock = get_open(sym)
    elif (sample_type == 'high'):
        stock = get_high(sym)
    elif (sample_type == 'low'):
        stock = get_low(sym)
    else:
        stock = get_close(sym)
        print("sample type was: ",sample_type)
    #eventually should be done with a dataframe
    #like all this should be vectorizable, or whatever the fuck that is
    #if it's just like a .apply() or something, I feel like I can do that super easily
    avg_list = []
    days_list = []
    min_price = stock.iloc[days]
    max_price = 0
    start_date = stock.index[days]
    end_date = stock.index[(stock.size - 1)]
    for day in range(days,stock.size): #has to start far enough along to calc a trailing average
        day_avg = computeAvg(stock,day,days,avg_type)
        avg_list.append(day_avg) #add average to list
        days_list.append(stock.index[day]) #add coresponding day to list
        if (day_avg < min_price):
            min_price = day_avg
        if (day_avg > max_price):
            max_price = day_avg

    stock_data = pd.DataFrame(avg_list, index=days_list, columns =['Price']) #create dataframe
    return {
        "stock_data":stock_data,
        "min_price":min_price,
        "max_price":max_price,
        "start_date":start_date,
        "end_date":end_date
    }

def computeAvg(stock,this_day,trail_days,type):
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
        #print(type)

    for s,c in zip(stock.iloc[this_day-trail_days:this_day],coef_list):
        weighted_sum += s*c
    
    return weighted_sum/sum(coef_list)

def findLocalMins(sym):
    stock = get_low(sym)