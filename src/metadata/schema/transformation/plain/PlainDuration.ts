import { PlainInteger } from './PlainInteger';

export type PlainDuration = {
  months: PlainInteger | number;
  days: PlainInteger | number;
  seconds: PlainInteger;
  nanoseconds: PlainInteger;
};
