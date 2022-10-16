export function doubleDigits(number: number) {
  if (number.toString().length <= 1) return "0" + number;
  return number;
}

export function date(el?: string, separator?: string) {
  const customDate = !el || el === "now" ? new Date() : new Date(el);

  const sep = separator ? separator : "";

  const YYYY = customDate.getFullYear();
  const MM = doubleDigits(customDate.getMonth() + 1);
  const DD = doubleDigits(customDate.getDate());

  return YYYY + sep + MM + sep + DD;
}

export function time(el?: string, separator?: string) {
  const customDate = !el || el === "now" ? new Date() : new Date(el);

  const sep = separator ? ":" : "";

  const HH = doubleDigits(customDate.getHours());
  const mm = doubleDigits(customDate.getMinutes());
  const ss = doubleDigits(customDate.getSeconds());

  return HH + sep + mm + sep + ss;
}

export function dateTime(el?: string, separator?: string) {
  const sep = separator ? " " : "";
  return date(el, separator) + sep + time(el, separator);
}
