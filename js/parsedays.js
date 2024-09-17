let zeroDay = [];
let firstDay = [];
let secondDay = [];
let thirdDay = [];
let fourdDay = [];
export function parseDays(data) {
  let zeroDay = [];
  let firstDay = [];
  let secondDay = [];
  let thirdDay = [];
  let fourdDay = [];
  //1
  let dateMatchVariable = data[0].dt_txt.substring(0, 10);
  for (const e of data) {
    if (dateMatchVariable == e.dt_txt.substring(0, 10)) {
      zeroDay.push(e);
    }
  }
  //2
  let counter = zeroDay.length + 8;

  for (let i = zeroDay.length; i < counter; i++) {
    firstDay.push(data[i]);
  }
  //3
  counter = zeroDay.length + firstDay.length + 8;
  for (let i = zeroDay.length + firstDay.length; i < counter; i++) {
    secondDay.push(data[i]);
  }
  //4
  counter = zeroDay.length + firstDay.length + secondDay.length + 8;
  for (
    let i = zeroDay.length + firstDay.length + secondDay.length;
    i < counter;
    i++
  ) {
    thirdDay.push(data[i]);
  }
  //5
  counter =
    zeroDay.length + firstDay.length + secondDay.length + thirdDay.length + 8;
  for (
    let i =
      zeroDay.length + firstDay.length + secondDay.length + thirdDay.length;
    i < counter;
    i++
  ) {
    fourdDay.push(data[i]);
  }

  let resultFiveDaySorted = {
    1: zeroDay,
    2: firstDay,
    3: secondDay,
    4: thirdDay,
    5: fourdDay,
  };
  return resultFiveDaySorted;
}
