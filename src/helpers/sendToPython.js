

async function sendToPython(data){
    //let asyncData
    console.log("in sendToPython, data is: ",data)
    const dataPackage = JSON.stringify(data)
    const rawResponse = await fetch('/api/dummypost',{
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: dataPackage})
    console.log('rawResponse is: ',rawResponse)
    const jsonResponse = await rawResponse.json()

    console.log('jsonResponse is: ',jsonResponse)
    
    return {"stockArray":jsonResponse.stockArray,"stockFeatures":jsonResponse.stockFeatures}
}

export default sendToPython

