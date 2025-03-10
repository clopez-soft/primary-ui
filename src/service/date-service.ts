import {
  formatDistance,
  formatDistanceToNow,
  isValid,
  format,
  isToday,
  isYesterday,
  isSameWeek,
  isSameYear,
  formatDuration,
  intervalToDuration,
  addHours,
  addDays,
  addMonths,
} from "date-fns";

import { es, enUS } from "date-fns/locale";
import { GetLangInUse } from "src/utils/helper";

export const DateDistance = (date: Date) => {
  if (!isValid(date)) return "";

  const lang = GetLangInUse();

  const result = formatDistance(date, new Date(), {
    addSuffix: true,
    locale: lang === "es" ? es : enUS,
  });

  return result;
};

export const StandarDateFormat = (date: Date) => {
  if (!isValid(date)) return "";

  const lang = GetLangInUse();
  const fmt = lang === "es" ? "dd/MM/yyyy" : "MM/dd/yyyy";

  return DateFormat(date, fmt);
};

export const DateFormat = (date: Date, fmt = "dd/MM/yyyy") => {
  if (!isValid(date)) return "";

  const lang = GetLangInUse();

  const result = format(date, fmt, {
    weekStartsOn: 1,
    locale: lang === "es" ? es : enUS,
  });

  return result;
};

export const NamedDateFormat = (date: Date) => {
  return DateFormat(date, "EEEE MMMM yyyy");
};

export const DayName = (date: Date) => {
  return DateFormat(date, "EEEE");
};

export const MonthName = (date: Date) => {
  return DateFormat(date, "MMMM");
};

export const DateTimeFormat = (date: Date, format = "dd MMMM yyyy  H:m:s") => {
  return DateFormat(date, format);
};

export function GetFriendlyDateTime(d: Date, exact: boolean) {
  if (!d) return "Unknown";

  const created_at = new Date(d);
  if (!isValid(created_at)) return "Unknown";

  const lang = GetLangInUse();
  const fmt = lang === "es" ? "dd MMMM yyyy  H:m:s" : "MMMM dd, yyyy  H:m:s";

  if (exact) return format(new Date(created_at), fmt);
  else {
    const options = {
      includeSeconds: true,
      addSuffix: true,
      locale: lang === "es" ? es : enUS,
    };
    const result = formatDistanceToNow(created_at, options);
    return result;
  }
}

export function ShortDateDividerHelper(d: Date, includeHourAfterToday = false) {
  try {
    if (!d) return "invalid";

    const date = new Date(d);
    if (!isValid(date)) return "";

    const current = new Date();

    const hourFormat = "hh:mm aaaa";
    const addFormat = includeHourAfterToday ? ` ${hourFormat}` : "";
    const lbYesterday = GetLangInUse() === "es" ? "Ayer " : "Yesterday ";

    if (isToday(date)) return DateFormat(date, hourFormat); //1:51 PM

    if (isYesterday(date))
      return (
        lbYesterday +
        (includeHourAfterToday ? DateFormat(date, hourFormat) : "")
      );

    if (isSameWeek(date, current)) return DateFormat(date, "EEEE" + addFormat); //Monday, Tuesday, ..., Sunday

    if (isSameYear(date, current))
      return DateFormat(date, "MMM dd" + addFormat); //Jun 18

    return DateFormat(date, "MM/dd/yyyy" + addFormat); // month/day/year
  } catch {
    return "error";
  }
}

export const Duration = (date: Date) => {
  const internal = intervalToDuration({
    start: new Date(date),
    end: new Date(),
  });

  const lang = GetLangInUse();

  const res = formatDuration(
    {
      years: internal.years,
      months: internal.months,
      weeks: internal.weeks,
      days: internal.days,
      hours: internal.hours,
      minutes: 0,
      seconds: 0,
    },
    { delimiter: ", ", locale: lang === "es" ? es : enUS }
  );

  return res;
};

export const AddHoursToDate = (date: Date, amount: number = 0) => {
  const result = addHours(new Date(date), amount);
  return result;
};

export const AddDaysToDate = (date: Date, amount: number = 0) => {
  const result = addDays(new Date(date), amount);
  return result;
};
export const AddMonthsToDate = (date: Date, amount: number = 1) => {
  const result = addMonths(new Date(date), amount);
  return result;
};
