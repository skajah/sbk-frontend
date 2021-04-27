export function makeDate(obj) {
  obj.date = new Date(obj.date);
}

export function makeDates(objs) {
  objs.forEach(makeDate);
}
