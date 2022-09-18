import yfinance as yf
import math
import stock_data as sd
import learning_manager as lm


def get_history(sym):
    stock = yf.Ticker(sym)
    return(stock.history(period = 'max'))

print(get_history('voo'))

def get_average_data(stock_history,data,trailing_days=None):
    days = trailing_days or int(data['trailingDays'])

    stockData = sd.trailing_avg(
        stock_history,
        days,
        data['avgType'],
        data['sampleType'],
        sd.prep_data
    )

    return stockData

#def get_plot_data(stock_history,data,trailing_days=None):
def get_plot_data(stock_history,stockData):
    plotData = {}
    #stockData = get_average_data(stock_history,data,trailing_days)
    #for i in range(len(stockData)):
    
    stockArray = stockData["stock_data"]

    print ('stockArray is: ',stockArray[:10])

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
    stockData = get_average_data(stock_history,data)
    plotData = get_plot_data(stock_history,stockData)
    plotDataDict = {'0':plotData}
    return ({'plotData':plotDataDict})

def model_rubric(data):
    stock_history = get_history(data['stockSymbol'])
    modelData = lm.setModelData(stock_history,data)
    #modelAnalysis = list(lm.tryModel(stock_history,data).to_dict('index').items())
    modelAnalysis = list(lm.tryModel(modelData).to_dict('index').items())
    #print('modelAnalysis: ', modelAnalysis[:19])

    stockDataList = modelData['stockDataList']
    plotDataDict = {}
    for index,stock_data in enumerate(stockDataList):
        print("index is: ",index)
        plotData = get_plot_data(stock_history,stock_data)
        plotDataDict[str(index)]= plotData
    return ({'plotData':plotDataDict,'modelAnalysis':modelAnalysis})
    #return ({'modelAnalysis':modelAnalysis})

def train_test_rubric(data):
    stock_history = get_history(data['stockSymbol'])
    modelData = lm.getModelData()
    print('modelData type: ',type(modelData['data']))
    print('modelData: ',modelData['data'].head())
    data_length = len(modelData['data'].index)
    #train_start = int(int(data['trainStart']) * data_length/100)
    #train_end = int(int(data['trainEnd']) * data_length/100)
    #test_end = int(int(data['testEnd']) * data_length/100)
    train_start = int(int(data['trainingBounds'][0]) * data_length/100)
    train_end = int(int(data['trainingBounds'][1]) * data_length/100)
    test_end = int(int(data['trainingBounds'][2]) * data_length/100)
    print('train_start: ',train_start)
    print('train_end: ',train_end)
    if (train_start < modelData['max']):
        train_start = modelData['max']


    modelAnalysis = list(lm.tryModel(modelData,train_start,train_end,test_end).to_dict('index').items())

    stockDataList = modelData['stockDataList']
    plotDataDict = {}
    for index,stock_data in enumerate(stockDataList):
        print("index is: ",index)
        plotData = get_plot_data(stock_history,stock_data)
        plotDataDict[str(index)]= plotData
    return ({'plotData':plotDataDict,'modelAnalysis':modelAnalysis})


def nan_checker(check_list):
    for item in check_list:
        if math.isnan(item):
            print ('Found NaN in: ',check_list)