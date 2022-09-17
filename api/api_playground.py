import stock_learning as sl
import pickle
import api_helper as apihelp
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt


def create_data(sym,step,max):
    stock = apihelp.get_history(sym)
    created_result = sl.setup_model_data(stock,step,max)

    with open('file.pk1','wb') as file:
        pickle.dump(created_result,file)

def access_data():
    with open('file.pk1','rb') as file:
        loaded_result = pickle.load(file)

        print(loaded_result['data'].iloc[100:110])
        return(loaded_result)


create_data('voo',5,25)
result = access_data()
model = sl.first_model(result['data'],result['features'])
predictions = sl.make_predictions(model,result['data'],result['features'])

print('Start of playground printing')
print(result['data'].iloc[100:110])
print(result['data'].iloc[200])
print(result['data'].shape)

sl.analyze_predictions(predictions,result['data'])

fig = plt.figure(figsize=(15, 10))
plot_tree(model.estimators_[0], 
        feature_names=result['features'],
        class_names=["0","1"], 
        filled=True, impurity=True, 
        rounded=True)
fig.savefig('figure_name.png')
