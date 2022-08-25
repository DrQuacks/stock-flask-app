import yfinance as yf
import pandas as pd

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
def trailing_avg(sym, days, avg_type, sample_type):

    #eventually should be done with a dataframe
    #like all this should be vectorizable, or whatever the fuck that is
    #if it's just like a .apply() or something, I feel like I can do that super easily

    if (sample_type == "Open/Close"):
        stock = get_columns(sym,["Open","Close"])
        stock = stock.stack()
        print("Stacked:")
        print(stock)
    else:
        stock = get_column(sym,sample_type)
    avg_list = []
    days_list = []
    stock_list = []
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

    w = 0.01

    print("stock index is ",stock.index)
    start_date = stock.index[days]
    print("start is ",start_date)
    end_date = stock.index[(stock.size - 1)]
    print("end is ",end_date)

    #stock['avg'] = 0
    #stock['keep'] = False

    #print("stock is: ",stock)
    print("stock type is: ",type(stock))

    stock['derivative'] = stock[sample_type].pct_change()
    
    #feels a bit hacky
    stock['derivative'].iloc[0] = 0
    print('derivative is: ',stock['derivative'])
    print('stock shape[0] is: ',stock.shape[0])
    #print("stock is: ",stock)
    
    for day in range(days,stock.shape[0] - 1): #has to start far enough along to calc a trailing average
        day_avg = computeAvg(stock[sample_type],day,days,avg_type)
        deriv_avg = computeAvg(stock['derivative'],day,days,avg_type)    
        
        avg_list.append(day_avg) #add average to list
        days_list.append(stock.index[day]) #add coresponding day to list
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

        stock_list.append({
            "numIndex": fakeIndex,
            "price": day_avg,
            "rawPrice":stock[sample_type].iloc[day],
            "date":stock.index[day],
            #"derivFirst":deriv_list[fakeIndex],
            "derivFirst":deriv_avg,
            "derivSecond":deriv2_list[fakeIndex]
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

    #print('Before masking, stock data is: ',stock)
    #stock_masked = stock[stock['keep']]
    #print('Masked Stock Data is: ',stock_masked)
    
    #I still might want this dataframe for backend calcs...
    #stock_data = pd.DataFrame(avg_list, index=days_list, columns =['Price']) #create dataframe
    
    #print(stock_list[0:5])
    return {
        "stock_data":stock_list,
        "days_list":days_list,
        "min_price":min_price,
        "max_price":max_price,
        "start_date":start_date,
        "end_date":end_date,
        "min_deriv":min_deriv,
        "max_deriv":max_deriv,
        "min_deriv2":min_deriv2,
        "max_deriv2":max_deriv2
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

    #if(this_day == 100):
        #print('coef list and type is: ',[coef_list,type])
    for s,c in zip(stock.iloc[this_day-trail_days+1:this_day+1],coef_list):
        weighted_sum += s*c
        #if(this_day == 100):
            #print("On day 100, weighted_sum is: ",weighted_sum)
            #print("On day 100, s is: ",s)
            #print("On day 100, c is: ",c)

    
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

def trailing_avg_double(sym, days, avg_type, sample_type):

    #eventually should be done with a dataframe
    #like all this should be vectorizable, or whatever the fuck that is
    #if it's just like a .apply() or something, I feel like I can do that super easily

    days = days*2 #accounts for 2 rows with same date
    stock = get_columns(sym,["Open","Close"])
    stock = stock.stack()
    print("Stacked:")
    print(stock)
    stock = stock.to_frame()
    stock = stock.rename(columns= {0: 'price'})
    print("DF-d: ")
    print(stock)

    avg_list = []
    days_list = []
    stock_list = []
    deriv_list = []
    raw_deriv_list = []
    deriv2_list = []
    fakeIndex = 0
    min_price = stock['price'].iloc[days]
    max_price = 0
    min_deriv = 0
    max_deriv = 0
    min_deriv2 = 0
    max_deriv2 = 0

    w = 0.01

    print("stock index is ",stock.index)
    start_date = stock.index[days][0]
    print("start is ",start_date)
    end_date = stock.index[(stock.size - 1)][0]
    print("end is ",end_date)

    #stock['avg'] = 0
    #stock['keep'] = False

    #print("stock is: ",stock)
    print("stock type is: ",type(stock))

    stock['derivative'] = stock.pct_change()
    
    #feels a bit hacky
    stock['derivative'].iloc[0] = 0
    print('derivative is: ',stock['derivative'])
    print('stock shape[0] is: ',stock.shape[0])
    #print("stock is: ",stock)
    
    for day in range(days,stock.shape[0] - 1): #has to start far enough along to calc a trailing average
        day_avg = computeAvg(stock['price'],day,days,avg_type)
        deriv_avg = computeAvg(stock['derivative'],day,days,avg_type)    
        
        avg_list.append(day_avg) #add average to list
        days_list.append(stock.index[day][0]) #add coresponding day to list
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

        stock_list.append({
            "numIndex": fakeIndex,
            "price": day_avg,
            "rawPrice":stock["price"].iloc[day],
            "date":stock.index[day][0],
            #"derivFirst":deriv_list[fakeIndex],
            "derivFirst":deriv_avg,
            "derivSecond":deriv2_list[fakeIndex],
            "type":stock.index[day][1]
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

    #print('Before masking, stock data is: ',stock)
    #stock_masked = stock[stock['keep']]
    #print('Masked Stock Data is: ',stock_masked)
    
    #I still might want this dataframe for backend calcs...
    #stock_data = pd.DataFrame(avg_list, index=days_list, columns =['Price']) #create dataframe
    
    #print(stock_list[0:5])
    return {
        "stock_data":stock_list,
        "days_list":days_list,
        "min_price":min_price,
        "max_price":max_price,
        "start_date":start_date,
        "end_date":end_date,
        "min_deriv":min_deriv,
        "max_deriv":max_deriv,
        "min_deriv2":min_deriv2,
        "max_deriv2":max_deriv2
    }
