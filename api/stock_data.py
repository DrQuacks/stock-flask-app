import yfinance as yf
import pandas as pd
import api_helper as apihelp

average_list = ['Constant','Linear','Quadratic','Exponential']
sample_list = ['Close','Open','High','Low']



#gets the entire stock's price history
def get_history(sym):
    stock = yf.Ticker(sym)
    return(stock.history(period = 'max'))

print(get_history('voo'))


def get_column(sym,sample_type):
    return get_history(sym).loc[:,[sample_type]]

def get_columns(sym,sample_types):
    return get_history(sym).loc[:,sample_types]


#calculates trailing average for a specific number of days
def trailing_avg(sym, days, avg_type, sample_type,data_prep_callback):
    #prepared_data = prep_data(sym, days, avg_type, sample_type)
    prepared_data = data_prep_callback(sym, days, avg_type, sample_type)
    print('prepared data is: ',prepared_data.keys())    
    results = build_stock_list(**prepared_data)
    return({**results})


def prep_data(sym, days, avg_type, sample_name):
    if (sample_name == "Open/Close"):
        days = days*2 #accounts for 2 rows with same date
        stock = get_columns(sym,["Open","Close"])
        stock = stock.stack()
        print("Stacked:")
        print(stock)
        stock = stock.to_frame()
        stock = stock.rename(columns= {0: 'price'})
        print("DF-d: ")
        print(stock)

        date_index = [item[0] for item in stock.index]
        type_index = [item[1] for item in stock.index]
        sample_type = 'price'
    else:
        stock = get_column(sym,sample_name)
        date_index = stock.index
        type_index = [sample_name for item in stock.index]
        sample_type = sample_name

    print("stock index is ",stock.index)
    print("stock type is: ",type(stock))

    stock['derivative'] = stock[sample_type].pct_change()
    
    #feels a bit hacky
    stock['derivative'].iloc[0] = 0
    print('derivative is: ',stock['derivative'])
    print('stock shape[0] is: ',stock.shape[0])
    #print("stock is: ",stock)
    names = ['stock','date_index','type_index','days','sample_type','avg_type']
    results = apihelp.make_dict(names,locals())
    return({**results})    


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

    #if(this_day == 100):
        #print('coef list and type is: ',[coef_list,type])
    for s,c in zip(stock.iloc[this_day-trail_days+1:this_day+1],coef_list):
        weighted_sum += s*c

    return weighted_sum/sum(coef_list)


def findLocalMinsandMaxs(sym):
    stock = get_history(sym)[['Low','High']]

    #days_list = []
    #price_list = []
    min_list = []
    max_list = []

    for day in range(1,stock.shape[0] - 2):
        today_day = stock.index[day]
        today_price_low = stock['Low'].iloc[day]
        today_price_high = stock['High'].iloc[day]
        if (today_price_low <= stock['Low'].iloc[day-1] and today_price_low <= stock['Low'].iloc[day+1]):
            #days_list.append(stock['Low'].index[day])
            #price_list.append(stock['Low'].iloc[day])
            min_list.append({"date":today_day,"price":today_price_low})
        if (today_price_high >= stock['High'].iloc[day-1] and today_price_high >= stock['High'].iloc[day+1]):
            #days_list.append(stock['Low'].index[day])
            #price_list.append(stock['Low'].iloc[day])
            max_list.append({"date":today_day,"price":today_price_high})
    return [min_list,max_list]



def build_stock_list(stock,date_index,type_index,days,sample_type,avg_type):

    w = 0.01
    avg_list = []
    days_list = []
    stock_data = []
    deriv_list = []
    raw_deriv_list = []
    deriv2_list = []
    fakeIndex = 0
    min_price = stock[sample_type].iloc[days]
    max_price = 0
    min_deriv = 0
    max_deriv = 0
    min_deriv2 = 0
    max_deriv2 = 0

    start_date = date_index[days]
    print("start is ",start_date)
    end_date = date_index[(len(date_index) - 1)]
    print("end is ",end_date)

    for day in range(days,stock.shape[0] - 1): #has to start far enough along to calc a trailing average
        day_avg = computeAvg(stock[sample_type],day,days,avg_type)
        deriv_avg = computeAvg(stock['derivative'],day,days,avg_type)    
        
        avg_list.append(day_avg) #add average to list
        days_list.append(date_index[day]) #add coresponding day to list
        raw_deriv_list.append(deriv_avg)
        
        #makes it a percentage instead of absolute derivative
        #might wanna do both though?
        if (fakeIndex >= 1):
            #deriv_list.append(((avg_list[fakeIndex] - avg_list[fakeIndex - 1])/avg_list[fakeIndex]))
            #new_deriv = ((avg_list[fakeIndex] - avg_list[fakeIndex - 1])/avg_list[fakeIndex])
            new_deriv = (w * raw_deriv_list[fakeIndex]) + ((1-w) * raw_deriv_list[fakeIndex-1])
        else:
            #deriv_list.append(0)
            new_deriv = 0

        deriv_list.append(new_deriv)
        
        
        if (fakeIndex >= 1):
            deriv2_list.append(deriv_list[fakeIndex] - deriv_list[fakeIndex - 1])
        else:
            deriv2_list.append(0)

        stock_data.append({
            "numIndex": fakeIndex,
            "price": day_avg,
            "rawPrice":stock[sample_type].iloc[day],
            "date":date_index[day],
            #"derivFirst":deriv_list[fakeIndex],
            "derivFirst":deriv_avg,
            "derivSecond":deriv2_list[fakeIndex],
            "type":type_index[day]
        })

        if (day_avg < min_price):
            min_price = day_avg
        if (day_avg > max_price):
            max_price = day_avg

        if (deriv_list[fakeIndex] < min_deriv):
            min_deriv = deriv_list[fakeIndex]
        if (deriv_list[fakeIndex] > max_deriv):
            max_deriv = deriv_list[fakeIndex]

        if (deriv2_list[fakeIndex] < min_deriv2):
            min_deriv2 = deriv2_list[fakeIndex]
        if (deriv2_list[fakeIndex] > max_deriv2):
            max_deriv2 = deriv2_list[fakeIndex]

        fakeIndex += 1

    names = [
        "stock_data",
        "days_list",
        "min_price",
        "max_price",
        "start_date",
        "end_date",
        "min_deriv",
        "max_deriv",
        "min_deriv2",
        "max_deriv2"
        ]
    
    results = apihelp.make_dict(names,locals())

    return ({**results})