import stock_learning as sl
import pickle


def create_data(history,step,max):
    created_result = sl.setup_model_data(history,step,max)

    with open('file.pk1','wb') as file:
        pickle.dump(created_result,file)

def access_data():
    with open('file.pk1','rb') as file:
        loaded_result = pickle.load(file)

        print(loaded_result['data'].iloc[100:110])
        return(loaded_result)


def setModelData(history,data):
    step = int(data['stepSize'])
    max = int(data['max'])

    create_data(history,step,max)
    result = access_data()
    return result

def tryModel(result,train_start=100,train_end=-300,test_end=-100):
    model = sl.first_model(result['data'],result['features'],train_start,train_end)
    predictions = sl.make_predictions(model,result['data'],result['features'],train_end,test_end)

    comparison_chart = sl.analyze_predictions(predictions,result['data'],train_end,test_end)
    return comparison_chart

def getModelData():
    result = access_data()
    return result