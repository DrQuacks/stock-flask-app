from crypt import methods
import time
from flask import Flask, request

import stock_data as sd

app = Flask(__name__)

print("hi")

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/dummyresponse')
def get_dummy_response():
    return {'dummy': "Hey, I'm a dummy!"}

@app.route('/api/dummypost',methods=['GET','POST'])
def set_dummy_post_value():
    data = request.get_json(force=True)

    #rawData = sd.get_close(data['stockSymbol'])

    stockData = sd.trailing_avg(
        data['stockSymbol'],
        int(data['trailingDays']),
        data['avgType'],
        data['sampleType']
    )

    stockArray = formatStockDf(stockData)
    #print('stockArray is: ',stockArray[0:10])
    print('stockArray type is: ',type(stockArray))

    stockFeatures = {
        "min_price":stockData["min_price"],
        "max_price":stockData["max_price"],
        "start_date":stockData["start_date"],
        "end_date":stockData["end_date"]
    }
    print ("stockFeatures are: ",stockFeatures)

    return {
        'stockArray':stockArray,
        'stockFeatures':stockFeatures
    }


def formatStockDf(data):
    df = data["stock_data"]
    stockArray = []
    fakeIndex = 0
    #need to replace iterrows for performance
    for index,value in df.iterrows():
        stockArray.append({"xValue": fakeIndex,"yValue": value[0],"date":index})
        fakeIndex += 1

    return stockArray