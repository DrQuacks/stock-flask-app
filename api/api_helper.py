import yfinance as yf
import stock_data as sd

def get_history(sym):
    stock = yf.Ticker(sym)
    return(stock.history(period = 'max'))

print(get_history('voo'))

def get_average_data(stock_history,data,trailing_days=None):
    days = trailing_days or int(data['trailingDays'])

    stockData = sd.trailing_avg(
        #data['stockSymbol'],
        stock_history,
        days,
        data['avgType'],
        data['sampleType'],
        sd.prep_data
    )

    return stockData

def get_plot_data(stock_history,data,trailing_days=None):
    plotData = {}
    stockData = get_average_data(stock_history,data,trailing_days)
    #for i in range(len(stockData)):
    
    stockArray = stockData["stock_data"]

    localMinsandMaxs = sd.findLocalMinsandMaxs(stock_history)

    column_list = [
        "min_price",
        "max_price",
        "start_date",
        "end_date",
        "min_deriv",
        "max_deriv",
        "min_deriv2",
        "max_deriv2",
        "days_list"
        ]

    names = [
        'stockArray',
        'stockFeatures',
        'localMinsandMaxs'
        ]

    stockFeatures = make_dict(column_list,stockData)
    print('stockFeatures[max_price] is: ',stockFeatures['max_price'])    
    #plotData.append(make_dict(names,locals()))
    #plotData[i] = make_dict(names,locals())
    plotData = make_dict(names,locals())

    return ({**plotData})
    #return plotData



def make_dict(names,local_dict,sub_index=None):
    print('sub_index is: ',sub_index)
    acc = {}
    for name in names:
        print("type of name is: ",type(local_dict[name]))
        if (not isinstance(sub_index,type(None)) and (type(local_dict[name]) == type([]))):
            if (name == "max_price"):
                print('max_price in make_dict is: ',local_dict[name][sub_index])
            if (name == "start_date"):
                print('start_date in make_dict is: ',[local_dict[name]])
            print('name ',name)
            print(len(local_dict[name]))
            acc[name] = local_dict[name][sub_index]
        else:
            acc[name] = local_dict[name]

    return acc

def plot_rubric(data):
    stock_history = get_history(data['stockSymbol'])
    plotData = get_plot_data(stock_history,data)
    return ({**plotData})

def model_rubric(data):
    stock_history = get_history(data['stockSymbol'])
    plotData = get_plot_data(stock_history,data,1)
