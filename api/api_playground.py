import stock_learning as sl
import pickle


def create_data(sym):
    created_result = sl.setup_data(sym)

    with open('file.pk1','wb') as file:
        pickle.dump(created_result,file)

def access_data():
    with open('file.pk1','rb') as file:
        loaded_result = pickle.load(file)

        print(loaded_result['data'].iloc[100:110])
        return(loaded_result)


#create_data('voo')
result = access_data()
model = sl.first_model(result['data'],result['features'])
predictions = sl.make_predictions(model,result['data'],result['features'])

print('Start of playground printing')
print(result['data'].iloc[100:110])
print(result['data'].iloc[200])
print(result['data'].shape)

sl.analyze_predictions(predictions,result['data'])


