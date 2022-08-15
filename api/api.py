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

    stockData = sd.trailing_avg(
        data['stockSymbol'],
        int(data['trailingDays']),
        data['avgType'],
        data['sampleType']
    )
    print('stockArray type is: ',type(stockData["stock_data"]))
    print('stockData is: ',stockData["stock_data"][0:10])

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
    #print ("stockFeatures are: ",stockFeatures)

    return {
        'stockArray':stockData["stock_data"],
        'stockFeatures':stockFeatures,
        'localMinsandMaxs':localMinsandMaxs
    }