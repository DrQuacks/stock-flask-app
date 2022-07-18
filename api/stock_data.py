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
    print("get_close is returning: ",get_history(sym).Close)
    return get_history(sym).Close

def get_volume(sym):
    return get_history(sym).Volume

#calculates trailing average for a specific number of days
def trailing_avg(sym, days, avg_type, sample_type):
    if (sample_type == 'Close'):
        stock = get_close(sym)
    elif (sample_type == 'Open'):
        stock = get_open(sym)
    elif (sample_type == 'High'):
        stock = get_high(sym)
    elif (sample_type == 'Low'):
        stock = get_low(sym)
    else:
        stock = get_close(sym)
        print(sample_type)
    #eventually should be done with a dataframe
    avg_list = []
    days_list = []
    for day in range(days,stock.size): #has to start far enough along to calc a trailing average
        day_avg = computeAvg(stock,day,days,avg_type)
        avg_list.append(day_avg) #add average to list
        days_list.append(stock.index[day]) #add coresponding day to list

    stock_data = pd.DataFrame(avg_list, index=days_list, columns =['Price']) #create dataframe
    return stock_data

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
        print(type)

    for s,c in zip(stock.iloc[this_day-trail_days:this_day],coef_list):
        weighted_sum += s*c
    
    return weighted_sum/sum(coef_list)

def findLocalMins(sym):
    stock = get_low(sym)