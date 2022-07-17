

const sendToPython = (data) =>
{
    console.log("in sendToPython, data is: ",data)
    const dummyData = JSON.stringify("crazy")
    const dataPackage = JSON.stringify(data)
    fetch('/api/dummypost',{
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: dataPackage})
        .then(res => res.json())
        .then(returnedData => {
            console.log('response is: ',returnedData);
        })
}

export default sendToPython

