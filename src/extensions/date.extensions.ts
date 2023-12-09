declare global {
  interface Date {
    /**
     * @returns Datestamp в текущем часовом поясе
     * @example При TZ="Europe/Moscow" выводит Datestamp("2023-01-01") для "2022-12-31T23:00:00.000Z"
     */
    toDatestamp(this: Date): Datestamp;
    /**
     * @returns Datestamp в UTC
     * @example При TZ="Europe/Moscow" выводит Datestamp("2022-12-31") для "2022-12-31T23:00:00.000Z"
     */
    toUtcDatestamp(this: Date): Datestamp;
    /**
     * @returns string
     * @example При TZ="Europe/Moscow" выводит "2023-01-01T02:00:00.000+03:00" для "2022-12-31T23:00:00.000Z"
     */
    toLocalString(this: Date): string;
  }
}

Object.defineProperty(Date.prototype, 'toDatestamp', {
  value: function (this: Date) {
    const diff = this.getTimezoneOffset() * 1000 * 60;
    const isoDateString = new Date(+this - diff).toISOString().split('T')[0];

    return Datestamp.fromISO(isoDateString);
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

Object.defineProperty(Date.prototype, 'toUtcDatestamp', {
  value: function (this: Date) {
    const isoUtcDateString = this.toISOString().split('T')[0];

    return Datestamp.fromISO(isoUtcDateString);
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

Object.defineProperty(Date.prototype, 'toLocalString', {
  value: function (this: Date) {
    const year = this.getFullYear();
    const month = this.getMonth() + 1;
    const day = this.getDate();
    const hour = this.getHours();
    const minute = this.getMinutes();
    const second = this.getSeconds();
    const millisecond = this.getMilliseconds();
    const timezoneOffset = this.getTimezoneOffset();
    const timezoneSign = timezoneOffset > 0 ? '-' : '+';
    const timezoneHour = Math.floor(Math.abs(timezoneOffset) / 60);
    const timezoneMinute = Math.abs(timezoneOffset) - timezoneHour * 60;

    return `${year.toString().padStart(4, '0')}-${month
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour
      .toString()
      .padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
      .toString()
      .padStart(2, '0')}.${millisecond
      .toString()
      .padStart(3, '0')}${timezoneSign}${timezoneHour
      .toString()
      .padStart(2, '0')}:${timezoneMinute.toString().padStart(2, '0')}`;
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

export {};
