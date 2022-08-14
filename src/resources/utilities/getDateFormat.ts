import * as dateFormat from 'date-format';

export const getFormatDate = (
  date: Date = new Date(),
  format = 'yyyy-MM-dd hh:mm:ss',
): string => {
  return dateFormat.asString(format, date);
};
