const dateToDate = (str) => {
    const d = new Date();
    if (str) {  
      /*const mnths = {
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
          },*/
          const mnths = {
            Jan: "00",
            Feb: "01",
            Mar: "02",
            Apr: "03",
            May: "04",
            Jun: "05",
            Jul: "06",
            Aug: "07",
            Sep: "08",
            Oct: "09",
            Nov: "10",
            Dec: "11"
          },
        date = str.split(" ");
        //console.log("date[2] is: ",date[2])
        //console.log("mnths[date[2]] is: ",mnths[date[2]])

        d.setFullYear(date[3], mnths[date[2]], date[1]);
    }
    //console.log('date is: ',d)
    return d
}
  
export default dateToDate