const dateToTickString = (str) => {
    if (str) { 
        console.log('tick is: ',[str,typeof(str)])
        const date = str.toDateString().split(" ");
      
        return [date[1], date[2], date[3]].join("-");
    }
    else {
      return ""
    }
    }
  
  export default dateToTickString