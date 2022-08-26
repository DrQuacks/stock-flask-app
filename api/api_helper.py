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
    localMinsandMaxs = sd.findLocalMinsandMaxs(data['stockSymbol'])

    stockFeatures = {
        "min_price":stockData["min_price"],
        "max_price":stockData["max_price"],
        "start_date":stockData["start_date"],
        "end_date":stockData["end_date"],
        "min_deriv":stockData["min_deriv"],
        "max_deriv":stockData["max_deriv"],
        "min_deriv2":stockData["min_deriv2"],
        "max_deriv2":stockData["max_deriv2"],
        "days_list":stockData["days_list"]
    }

    stockArray = stockData["stock_data"]

    return ({'stockArray':stockArray,'stockFeatures':stockFeatures,'localMinsandMaxs':localMinsandMaxs})

