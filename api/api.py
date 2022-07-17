from crypt import methods
import time
from flask import Flask, request

app = Flask(__name__)

dummyArray = [[0,0],[1,1],[2,4],[3,9]]
dummyArrayA = [{"xValue":0,"yValue":0},
                {"xValue":1,"yValue":1},
                {"xValue":2,"yValue":4},
                {"xValue":3,"yValue":9}]
dummyArrayB = [{"xValue":0,"yValue":1},
                {"xValue":1,"yValue":2},
                {"xValue":2,"yValue":4},
                {"xValue":3,"yValue":8}]

global dummyReturn


mutableVariable = 0
def setMutableVariable(input):
    mutableVariable = input
    if (input == "super"):
        dummyReturn = dummyArrayB
    elif (input == "crazy"):
        dummyReturn = dummyArrayA
    print(input)
    print(mutableVariable)

print("hi")

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/dummyresponse')
def get_dummy_response():
    return {'dummy': "Hey, I'm a dummy!"}

@app.route('/api/dummyarray')
def get_dummy_array():
    return {'dummy': dummyArrayA}

@app.route('/api/dummypost',methods=['POST'])
def set_dummy_post_value():
    data = request.get_json(force=True)
    setMutableVariable(data)
    #setMutableVariable(request.json)
    return {'message':data}