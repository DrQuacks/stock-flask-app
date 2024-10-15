"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function sendToPython(data, route) {
    console.log("in sendToPython, data is: ", data);
    const dataPackage = JSON.stringify(data);
    const rawResponse = await fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: dataPackage
    });
    console.log('rawResponse is: ', rawResponse);
    const jsonResponse = await rawResponse.json();
    console.log('jsonResponse is: ', jsonResponse);
    return jsonResponse;
}
exports.default = sendToPython;
