type Month = "Jan"|"Feb"|"Mar"|"Apr"|"May"|"Jun"|"Jul"|"Aug"|"Sep"|"Oct"|"Nov"|"Dec"


const dateToString = (str:string) => {
  //if (str) { 
    //console.log("In dateToStr, str is: ",[str]) 
    console.log("In dateToStr, mappedX is: ",[str]) 
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
        },
        date = str.split(" ");
    
      return [date[3], mnths[(date[2] as Month)], date[1]].join("-");
  // }
  // else {
  //   return ""
  // }
  }

export default dateToString