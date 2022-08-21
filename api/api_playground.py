import stock_learning as sl

result = sl.setup_data('voo')
model = sl.first_model(result['data'],result['features'])
predictions = sl.make_predictions(model,result['data'],result['features'])

print('Start of playground printing')
print(result['data'].iloc[100:110])
print(result['data'].iloc[200])
print(result['data'].shape)

sl.analyze_predictions(predictions,result['data'])