"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calcSelectedDays = (prefsState) => {
    const { xDomain, dayValues } = prefsState;
    const xDomainTime = [xDomain[0].getTime(), xDomain[1].getTime()];
    console.log("In the start of calcSelectedDayValues, [xDomainTime,xDomain,dayValues] is: ", [xDomainTime, prefsState.xDomain, dayValues]);
    const startIndex = dayValues.findIndex(day => day.getTime() >= xDomainTime[0]);
    const endIndex = dayValues.findLastIndex(day => day.getTime() <= xDomainTime[1]);
    console.log("In calcSelectedDayValues, startIndex and endIndex are: ", [startIndex, endIndex]);
    const checkedStartIndex = startIndex === -1 ? 0 : startIndex;
    const checkedEndIndex = endIndex === -1 ? (dayValues.length - 1) : endIndex;
    console.log("In calcSelectedDayValues, checkedstartIndex and checkedendIndex are: ", [checkedStartIndex, checkedEndIndex]);
    const newSelectedDays = dayValues.slice(checkedStartIndex, checkedEndIndex + 1);
    console.log("In calcSelectedDayValues, [xDomain,dayValues,newSelectedDays] is: ", [prefsState.xDomain, dayValues, newSelectedDays]);
    return newSelectedDays;
};
exports.default = calcSelectedDays;
