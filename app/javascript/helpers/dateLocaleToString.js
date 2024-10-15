"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateLocaleToString = (str) => {
    if (str) {
        //console.log("In dateToStr, str is: ",[str]) 
        //console.log("In dateToStr, mappedX is: ",[str]) 
        const dateStr = str.split(",");
        return dateStr[0];
    }
    else {
        return "";
    }
};
exports.default = dateLocaleToString;
