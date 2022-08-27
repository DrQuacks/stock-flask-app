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
    #return({**results})
    return(results)


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


def computeAvg(stock,this_day,trail_days_list,type):
    avg_list=[]
    first_days = trail_days_list[0]
    last_days = trail_days_list[len(trail_days_list)-1]
    weighted_sum = 0
    #last_days_list = range(1,last_days+1)
    last_days_list = range(last_days,0,-1)

    if (type == 'Constant'):
        coef_list = [d**0 for d in last_days_list]
    elif (type == 'Linear'):
        coef_list = [d for d in last_days_list]
    elif (type == 'Quadratic'):
        coef_list = [d**2 for d in last_days_list]
    elif (type == 'Exponential'):
        coef_list = [2**d for d in last_days_list]
    else:
        coef_list = [d**0 for d in last_days_list]
        #print(type)

    #if(this_day == 100):
        #print('coef list and type is: ',[coef_list,type])
    #for s,c in zip(stock.iloc[this_day-last_days+1:this_day+1],coef_list):
    #for s,c in zip(stock.iloc[this_day:this_day-last_days],coef_list):
        #weighted_sum += s*c
    for day in trail_days_list:
        stock_slice = stock.iloc[this_day-day+1:this_day+1].sort_index(ascending=False)
        weighted_sum = sum(stock_slice.multiply(coef_list))
        avg = weighted_sum/sum(coef_list[:day])
        avg_list.append(avg)

    return avg_list


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

    days = [days] if isinstance(days,int) else days

    first_days = days[0]
    last_days = days[len(days)-1]
    
    w = 0.01
    avg_list = [[] for day in days]
    days_list = [[] for day in days]
    stock_data = [[] for day in days]
    deriv_list = [[] for day in days]
    raw_deriv_list = [[] for day in days]
    deriv2_list = [[] for day in days]
    fakeIndex = [0 for day in days]
    min_price = [stock[sample_type].iloc[first_days] for day in days]
    max_price = [0 for day in days]
    min_deriv = [0 for day in days]
    max_deriv = [0 for day in days]
    min_deriv2 = [0 for day in days]
    max_deriv2 = [0 for day in days]

    start_date = date_index[first_days]
    print("start is ",start_date)
    end_date = date_index[(len(date_index) - 1)]
    print("end is ",end_date)

    #for day in range(days,stock.shape[0] - 1): #has to start far enough along to calc a trailing average
    for day in range(last_days,stock.shape[0] - 1): #has to start far enough along to calc a trailing average
        day_avg = computeAvg(stock[sample_type],day,days,avg_type)
        deriv_avg = computeAvg(stock['derivative'],day,days,avg_type)    
        
        for i in range(len(days)):
            avg_list[i].append(day_avg[i]) #add average to list
            days_list[i].append(date_index[day]) #add coresponding day to list
            raw_deriv_list[i].append(deriv_avg[i])
        
            #makes it a percentage instead of absolute derivative
            #might wanna do both though?
            if (fakeIndex[i] >= 1):
                #deriv_list.append(((avg_list[fakeIndex] - avg_list[fakeIndex - 1])/avg_list[fakeIndex]))
                #new_deriv = ((avg_list[fakeIndex] - avg_list[fakeIndex - 1])/avg_list[fakeIndex])
                new_deriv = (w * raw_deriv_list[i][fakeIndex[i]]) + ((1-w) * raw_deriv_list[i][fakeIndex[i]-1])
            else:
                #deriv_list.append(0)
                new_deriv = 0

            deriv_list[i].append(new_deriv)
            
            
            if (fakeIndex[i] >= 1):
                deriv2_list[i].append(deriv_list[i][fakeIndex[i]] - deriv_list[i][fakeIndex[i] - 1])
            else:
                deriv2_list[i].append(0)

            stock_data[i].append({
                "numIndex": fakeIndex[i],
                "price": day_avg[i],
                "rawPrice":stock[sample_type].iloc[day],
                "date":date_index[day],
                #"derivFirst":deriv_list[fakeIndex],
                "derivFirst":raw_deriv_list[i][fakeIndex[i]],
                "derivSecond":deriv2_list[i][fakeIndex[i]],
                "type":type_index[day]
            })

            if (day_avg[i] < min_price[i]):
                min_price[i] = day_avg[i]
            if (day_avg[i] > max_price[i]):
                max_price[i] = day_avg[i]

            if (deriv_list[i][fakeIndex[i]] < min_deriv[i]):
                min_deriv[i] = deriv_list[i][fakeIndex[i]]
            if (deriv_list[i][fakeIndex[i]] > max_deriv[i]):
                max_deriv[i] = deriv_list[i][fakeIndex[i]]

            if (deriv2_list[i][fakeIndex[i]] < min_deriv2[i]):
                min_deriv2[i] = deriv2_list[i][fakeIndex[i]]
            if (deriv2_list[i][fakeIndex[i]] > max_deriv2[i]):
                max_deriv2[i] = deriv2_list[i][fakeIndex[i]]

            fakeIndex[i] += 1

    
    print('Stock Data at row 10 is: ',stock_data[0][10])
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
    results_list = []
    print('max_price is: ',max_price)
    for i in range(len(days)):
        results = apihelp.make_dict(names,locals(),sub_index=i)
        print('results', results.keys())
        print("results[max_price] is: ",results["max_price"])
        results_list.append(results)

    return (results_list)