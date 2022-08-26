from flask import Flask, request

import learning_manager as lm
import api_helper as apihelp

app = Flask(__name__)

print("hi")

@app.route('/api/setPlot',methods=['GET','POST'])
def set_plot():
    data = request.get_json(force=True)
    plotData = apihelp.get_plot_data(data)

    return ({**plotData})

@app.route('/api/setModel',methods=['GET','POST'])
def set_model():
    data = request.get_json(force=True)
    plotData = apihelp.get_plot_data(data,1)
    modelAnalysis = list(lm.tryModel(data).to_dict('index').items())

    return {**plotData,'modelAnalysis':modelAnalysis}
