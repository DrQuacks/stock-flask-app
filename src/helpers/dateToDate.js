const dateToDate = (str,sample) => {
  //const d = new Date("July 21, 1983 09:00:00");
  let d
  if (sample === "Open"){
    d = new Date("July 21, 1983 09:00:00");
  } else {
    d = new Date("July 21, 1983 21:00:00");
  }
  if (str) {  
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