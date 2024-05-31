import {SampleType} from '../components/InputFormContainer'

// const dateToDate = (str:string,sample:SampleType) => {
//   //const d = new Date("July 21, 1983 09:00:00");
//   let d:Date
//   if (sample === "Open"){
//     d = new Date("July 21, 1983 09:00:00");
//   } else {
//     d = new Date("July 21, 1983 21:00:00");
//   }
//   if (str) {  
//     // const mnths = {
//     //   Jan: "00",
//     //   Feb: "01",
//     //   Mar: "02",
//     //   Apr: "03",
//     //   May: "04",
//     //   Jun: "05",
//     //   Jul: "06",
//     //   Aug: "07",
//     //   Sep: "08",
//     //   Oct: "09",
//     //   Nov: "10",
//     //   Dec: "11"
//     // }
//     const mnths = {
//       Jan: 0,
//       Feb: 1,
//       Mar: 2,
//       Apr: 3,
//       May: 4,
//       Jun: 5,
//       Jul: 6,
//       Aug: 7,
//       Sep: 8,
//       Oct: 9,
//       Nov: 10,
//       Dec: 11
//     }
//     const date = str.split(" ");
//     //console.log("date[2] is: ",date[2])
//     //console.log("mnths[date[2]] is: ",mnths[date[2]])

//     d.setFullYear(+date[3], mnths[date[2]], +date[1]);
//   }
//   //console.log('date is: ',d)
//   return d
// }
type Month = "Jan"|"Feb"|"Mar"|"Apr"|"May"|"Jun"|"Jul"|"Aug"|"Sep"|"Oct"|"Nov"|"Dec"
const dateToDate = (str:string) => {
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
  }
  const date = str.split(" ");
  const d = new Date("July 21, 1983 09:00:00");
  d.setFullYear(+date[3], mnths[(date[2] as Month)], +date[1]);
  return d
}
  
export default dateToDate