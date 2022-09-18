from flask import Flask, request

import learning_manager as lm
import api_helper as apihelp

app = Flask(__name__)

print("hi")

@app.route('/api/setPlot',methods=['GET','POST'])
def set_plot():
    data = request.get_json(force=True)
    #plotData = apihelp.get_plot_data(data)
    plotData = apihelp.plot_rubric(data)

    #return ({**plotData})
    return plotData

@app.route('/api/setModel',methods=['GET','POST'])
def set_model():
    data = request.get_json(force=True)
    #plotData = apihelp.get_plot_data(data,1)
    #modelAnalysis = list(lm.tryModel(data).to_dict('index').items())
    plotDataDict = apihelp.model_rubric(data)
    print('Almost home!!!!!!! ',plotDataDict.keys())

    #return ({**plotData,'modelAnalysis':modelAnalysis})
    return plotDataDict


@app.route('/api/setTrainTest',methods=['GET','POST'])
def set_train_test():
    data = request.get_json(force=True)
    print('data: ',data)
    plotDataDict = apihelp.train_test_rubric(data)
    print('Almost home!!!!!!! ',plotDataDict.keys())

    return plotDataDict