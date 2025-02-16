from flask import Flask, request
import os
from dotenv import load_dotenv
import learning_manager as lm
import api_helper as apihelp

load_dotenv()

app = Flask(__name__)
app.config.from_prefixed_env()

print(f"Current Environment: {os.getenv('ENVIRONMENT')}")
print(f"Using Database: {app.config.get('DATABASE')}")

print("hi")

@app.route('/api/setPlot',methods=['GET','POST'])
def set_plot():
    data = request.get_json(force=True)
    plotData = apihelp.plot_rubric(data)
    return plotData

@app.route('/api/setModel',methods=['GET','POST'])
def set_model():
    data = request.get_json(force=True)
    plotDataDict = apihelp.model_rubric(data)
    print('Almost home!!!!!!! ',plotDataDict.keys())
    return plotDataDict


@app.route('/api/setTrainTest',methods=['GET','POST'])
def set_train_test():
    data = request.get_json(force=True)
    plotDataDict = apihelp.train_test_rubric(data)
    print('Almost home!!!!!!! ',plotDataDict.keys())

    return plotDataDict