import stock_data as sd

def get_average_data(data,trailing_days=None):
    days = trailing_days or int(data['trailingDays'])
    if (data['sampleType'] == "Open/Close"):
        stockData = sd.trailing_avg_double(
            data['stockSymbol'],
            days,
            data['avgType'],
            data['sampleType']
        )
    else:
        stockData = sd.trailing_avg(
            data['stockSymbol'],
            days,
            data['avgType'],
            data['sampleType']
        )

    return stockData

def get_plot_data(data,trailing_days=None):
    stockData = get_average_data(data,trailing_days)
    stockArray = stockData["stock_data"]

    localMinsandMaxs = sd.findLocalMinsandMaxs(data['stockSymbol'])

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
    plotData = make_dict(names,locals())

    return ({**plotData})



def make_dict(names,local_dict):
    acc = {}
    for name in names:
        acc[name] = local_dict[name]

    return acc
