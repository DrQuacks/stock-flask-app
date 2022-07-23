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

#calculates trailing average for a specific number of days
def trailing_avg(sym, days, avg_type, sample_type):

    #eventually should be done with a dataframe
    #like all this should be vectorizable, or whatever the fuck that is
    #if it's just like a .apply() or something, I feel like I can do that super easily

    stock = get_column(sym,sample_type)
    avg_list = []
    days_list = []
    stock_list = []
    deriv_list = []
    deriv2_list = []
    fakeIndex = 0
    min_price = stock[sample_type].iloc[days]
    max_price = 0
    min_deriv = 0
    max_deriv = 0
    min_deriv2 = 0
    max_deriv2 = 0
    print("stock index is ",stock.index)
    start_date = stock.index[days]
    print("start is ",start_date)
    end_date = stock.index[(stock.size - 1)]
    print("end is ",end_date)

    #stock['avg'] = 0
    #stock['keep'] = False

    print("stock is: ",stock)
    print("stock type is: ",type(stock))

    for day in range(days,stock.size - 1): #has to start far enough along to calc a trailing average
        day_avg = computeAvg(stock[sample_type],day,days,avg_type)        
        
        avg_list.append(day_avg) #add average to list
        days_list.append(stock.index[day]) #add coresponding day to list
        
        #makes it a percentage instead of absolute derivative
        #might wanna do both though?
        if (fakeIndex >= 1):
            deriv_list.append(((avg_list[fakeIndex] - avg_list[fakeIndex - 1])/avg_list[fakeIndex]))
        else:
            deriv_list.append(0)
        
        if (fakeIndex >= 1):
            deriv2_list.append(deriv_list[fakeIndex] - deriv_list[fakeIndex - 1])
        else:
            deriv2_list.append(0)

        stock_list.append({
            "numIndex": fakeIndex,
            "price": day_avg,
            "date":stock.index[day],
            "derivFirst":deriv_list[fakeIndex],
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
    
    return {
        "stock_data":stock_list,
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

    for s,c in zip(stock.iloc[this_day-trail_days+1:this_day+1],coef_list):
        weighted_sum += s*c
        if(this_day == 5):
            print("On day 100, weighted_sum is: ",weighted_sum)
            print("On day 100, s is: ",s)
            print("On day 100, c is: ",c)

    
    return weighted_sum/sum(coef_list)

def findLocalMins(sym):
    stock = get_low(sym)