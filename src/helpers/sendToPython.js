

async function sendToPython(data){
    //let asyncData
    console.log("in sendToPython, data is: ",data)
    const dummyData = JSON.stringify("crazy")
    const dataPackage = JSON.stringify(data)
    const rawResponse = await fetch('/api/dummypost',{
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: dataPackage})
    console.log('rawResponse is: ',rawResponse)
    const jsonResponse = await rawResponse.json()
    /*then(returnedData => {
            asyncData = returnedData
            console.log('response is: ',returnedData);
        })*/
        console.log('jsonResponse is: ',jsonResponse)
    
    return jsonResponse.message
}

export default sendToPython

