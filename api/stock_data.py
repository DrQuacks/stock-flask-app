import pandas as pd
import api_helper as apihelp

average_list = ['Constant','Linear','Quadratic','Exponential']
sample_list = ['Close','Open','High','Low']


def trailing_avg(history, days, avg_type, sample_type,data_prep_callback):
    #prepared_data = prep_data(sym, days, avg_type, sample_type)
    prepared_data = data_prep_callback(history, days, avg_type, sample_type)
    print('prepared data is: ',prepared_data.keys())    
    results = build_stock_list(**prepared_data)
    #return({**results})
    return(results)

def correctTime(dateTime,type):
    if (type == "Open"):
        return dateTime.normalize() + pd.Timedelta(hours=14,minutes=30)
    else :
        return dateTime.normalize() + pd.Timedelta(hours=21)

def prep_data(history, days, avg_type, sample_name):
    # breakpoint()
    if (sample_name == "Open/Close"):
        #days = days*2 #accounts for 2 rows with same date
        stock = history.loc[:,["Open","Close"]]
        stock = stock.stack()
        print("Stacked:")
        print(stock)
        stock = stock.to_frame()
        stock = stock.rename(columns= {0: 'price'})
        #stock = pd.melt(history,id_vars=['High','Low','Volume','Dividends','Stock Splits'],value_vars=['Open','Close'])
        print("DF-d: ")
        print(stock)

        date_index = [correctTime(item[0],item[1]) for item in stock.index]
        type_index = [item[1] for item in stock.index]
        sample_type = 'price'
        samples_per_day = 2
    else:
        stock = history.loc[:,[sample_name]]
        date_index = [correctTime(item,sample_name) for item in stock.index]
        type_index = [sample_name for item in stock.index]
        sample_type = sample_name
        samples_per_day = 1

    print("stock index is ",stock.index)
    print("stock type is: ",type(stock))

    stock['derivative'] = stock[sample_type].pct_change()
    
    #feels a bit hacky
    stock['derivative'].iloc[0] = 0
    print('derivative is: ',stock['derivative'])
    print('stock shape[0] is: ',stock.shape[0])
    #print("stock is: ",stock)
    names = ['stock','date_index','type_index','days','sample_type','avg_type','history','samples_per_day']
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
    #for s,c in zip(stock.iloc[this_day-trail_days+1:this_day+1],coef_list):
    #    weighted_sum += s*c

    #return weighted_sum/sum(coef_list)

    weighted_sum = sum(stock.iloc[this_day-trail_days+1:this_day+1].multiply(coef_list))
    avg = weighted_sum/sum(coef_list)


    return avg


def findLocalMinsandMaxs(history):
    stock = history.loc[:,['Low','High']]

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

def trailingMinsAndMaxs(history,this_day,trail_days):
    
    short_stock_df = history.iloc[this_day-trail_days+1:this_day+1]
    current_min = short_stock_df['Low'].min()
    current_max = short_stock_df['High'].max()

    return [current_min,current_max]

def checkExtremes(val,min,max):
    if (val < min):
        min = val
    if (val > max):
        max = val
    return [min,max]


def build_stock_list(stock,date_index,type_index,days,sample_type,avg_type,history,samples_per_day=1):
    
    index_days = days*samples_per_day
    print('type_index length is: ',len(type_index))
    print('date_index length is: ',len(date_index))
    w = 0.01

    avg_list = []
    days_list = []
    stock_data = []
    deriv_list = []
    raw_deriv_list = []
    deriv2_list = []
    fakeIndex = 0
    min_price = stock[sample_type].iloc[index_days]
    max_price = 0
    min_deriv = 0
    max_deriv = 0
    min_deriv2 = 0
    max_deriv2 = 0

    start_date = date_index[index_days]
    print("start is ",start_date)
    end_date = date_index[(len(date_index) - 1)]
    print("end is ",end_date)

    print('length of date_index is: ',len(date_index))
    print('length of stockDF is: ',stock.shape[0])
    print('date_index is: ',date_index[:10])
    print('stockDF is: ',stock.head(10))

    for day in range(index_days,stock.shape[0]): #has to start far enough along to calc a trailing average
        day_avg = computeAvg(stock[sample_type],day,index_days,avg_type)
        deriv_avg = computeAvg(stock['derivative'],day,index_days,avg_type)    
        
        avg_list.append(day_avg) #add average to list
        days_list.append(date_index[day]) #add coresponding day to list
        raw_deriv_list.append(deriv_avg)
        [day_min,day_max] = trailingMinsAndMaxs(history,int(day/samples_per_day),days)
    
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
            "derivFirst":raw_deriv_list[fakeIndex],
            "derivSecond":deriv2_list[fakeIndex],
            "type":type_index[day],
            "trailing_min":day_min,
            "trailing_max":day_max
        })

        [min_price,max_price] = checkExtremes(stock[sample_type].iloc[day],min_price,max_price)
        [min_deriv,max_deriv] = checkExtremes(deriv_list[fakeIndex],min_deriv,max_deriv)
        [min_deriv2,max_deriv2] = checkExtremes(deriv2_list[fakeIndex],min_deriv2,max_deriv2)

        fakeIndex += 1

    
    #I need to do this with the trailing min and max as well
    
    col_name = "Avg_"+str(days)
    print('avg_list: ',avg_list[:5])
    print(len(avg_list))
    print('type_list: ',type_index[index_days:index_days+5])
    print(len(type_index[index_days:]))
    print('days_list: ',days_list[:5])
    dict = {col_name:avg_list,'Type':type_index[index_days:]}
    avg_df = pd.DataFrame(dict,index=days_list)
    avg_df = avg_df.rename_axis("Date")
    print('NaN rows in avg_df are: ',avg_df[avg_df.isna().any(axis=1)])
    print('avg_df is: ',avg_df.head())
    print('Stock Data at row 10 is: ',stock_data[10])
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
        "max_deriv2",
        "avg_df"
        ]

    results = apihelp.make_dict(names,locals())
    return (results)