const MONTH_TABLE: Record<number, string> = {
  1: 'jan',
  2: 'feb',
  3: 'mar',
  4: 'apr',
  5: 'may',
  6: 'jun',
  7: 'july',
  8: 'aug',
  9: 'sep',
  10: 'oct',
  11: 'nov',
  12: 'dec',
}

/**
 * 解析日期
 * @param timestamp 时间戳(单位s)
 */
export default function(timestamp: number) {
  let date = new Date(timestamp * 1000)
  let [year,  month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]

  return `${ MONTH_TABLE[month] } ${ day }, ${ year }`
}
