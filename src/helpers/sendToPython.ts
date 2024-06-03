import { InputFormData } from "src/components/InputFormContainer"

async function sendToPython(data:InputFormData,route:string){
    console.log("in sendToPython, data is: ",data)
    const dataPackage = JSON.stringify(data)
    const rawResponse = await fetch(route,{
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: dataPackage})
    console.log('rawResponse is: ',rawResponse)
    const jsonResponse = await rawResponse.json()

    console.log('jsonResponse is: ',jsonResponse)

    return jsonResponse
}

export default sendToPython

