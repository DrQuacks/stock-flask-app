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
  const d = new Date("July 21, 1983 00:00:00");
  d.setFullYear(+date[3], mnths[(date[2] as Month)], +date[1]);
  const time = date[4].split(":")
  d.setHours(+time[0],+time[1])

  return d
}
  
export default dateToDate