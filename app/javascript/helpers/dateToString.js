"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateToString = (str) => {
    //if (str) { 
    //console.log("In dateToStr, str is: ",[str]) 
    console.log("In dateToStr, mappedX is: ", [str]);
    const mnths = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    }, date = str.split(" ");
    return [date[3], mnths[date[2]], date[1]].join("-");
    // }
    // else {
    //   return ""
    // }
};
exports.default = dateToString;
