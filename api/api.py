import time
from flask import Flask

app = Flask(__name__)

dummyArray = [[0,0],[1,1],[2,4],[3,9]]
dummyArray2 = [{"xValue":0,"yValue":0},
                {"xValue":1,"yValue":1},
                {"xValue":2,"yValue":4},
                {"xValue":3,"yValue":9}]

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/dummyresponse')
def get_dummy_response():
    return {'dummy': "Hey, I'm a dummy!"}

@app.route('/api/dummyarray')
def get_dummy_array():
    return {'dummy': dummyArray2}