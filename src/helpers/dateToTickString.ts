type DisplayType = "year" | "month" | "day"

const dateToTickString = (str:Date,displayType:DisplayType) => {
    if (str) { 
        console.log('tick is: ',[str,typeof(str)])
        const date = str.toDateString().split(" ");

        if (displayType === "year"){
          return date[3]
        } else if (displayType === "month") {
          return [date[1], date[3]].join("-");
        } else if (displayType === "day") {
          return [date[1], date[2]].join("-");
        } else {  
          return [date[1], date[2], date[3]].join("-");
        }
    }
    else {
      return ""
    }
    }
  
  export default dateToTickString