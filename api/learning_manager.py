import stock_learning as sl
import pickle


#def create_data(sym,step,max):
def create_data(history,step,max):
    created_result = sl.setup_model_data(history,step,max)

    with open('file.pk1','wb') as file:
        pickle.dump(created_result,file)

def access_data():
    with open('file.pk1','rb') as file:
        loaded_result = pickle.load(file)

        print(loaded_result['data'].iloc[100:110])
        return(loaded_result)


def tryModel(history,data):
    sym = data['stockSymbol']
    step = int(data['stepSize'])
    max = int(data['max'])

    #create_data(sym,step,max)
    create_data(history,step,max)
    result = access_data()
    model = sl.first_model(result['data'],result['features'])
    predictions = sl.make_predictions(model,result['data'],result['features'])

    comparison_chart = sl.analyze_predictions(predictions,result['data'])
    return comparison_chart
