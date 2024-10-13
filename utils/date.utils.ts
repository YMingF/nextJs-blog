import dayjs from "dayjs";

export function formatDate(
  isoDate: string | Date,
  format: string = "YYYY/MM/DD"
) {
  if (isoDate instanceof Date) {
    isoDate = isoDate.toISOString();
  }
  return dayjs(isoDate).format(format);
}
