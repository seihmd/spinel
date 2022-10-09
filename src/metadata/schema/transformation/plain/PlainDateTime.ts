export type PlainDateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  nanosecond: number;
  timeZoneId: string | undefined;
  timeZoneOffsetSeconds: number | undefined;
};
