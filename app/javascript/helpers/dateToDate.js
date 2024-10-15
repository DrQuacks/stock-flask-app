"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateToDate = (str) => {
    const mnths = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11
    };
    const date = str.split(" ");
    const d = new Date("July 21, 1983 09:00:00");
    d.setFullYear(+date[3], mnths[date[2]], +date[1]);
    return d;
};
exports.default = dateToDate;
