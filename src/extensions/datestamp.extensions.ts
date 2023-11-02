class Datestamp {
  private readonly ['@instanceof'] = Symbol.for(Datestamp.name);
  private readonly year: number;
  private readonly month: number;
  private readonly day: number;
  private readonly timestamp: number;
  private get datestamp() {
    return Datestamp.convertYMDToISOString(this.year, this.month, this.day);
  }

  private static convertYMDToISOString(
    year: number,
    month: number,
    day: number,
  ) {
    return [
      year.toString().padStart(4, '0'),
      month.toString().padStart(2, '0'),
      day.toString().padStart(2, '0'),
    ].join('-');
  }

  private constructor(year: number, month: number, day: number) {
    if (!arguments.length) {
      return;
    }

    this.year = year;
    this.month = month;
    this.day = day;
    this.timestamp = new Date(this.datestamp).getTime();
  }

  static fromYMD(year: number, month: number, day: number): Datestamp {
    return Datestamp.fromISO(Datestamp.convertYMDToISOString(year, month, day));
  }

  static fromISO(isoDate: string): Datestamp {
    const dateSections = isoDate.split('-');
    const date = new Date(isoDate);
    const isoUtcDateString = date.toISOString().split('T')[0];

    if (isNaN(date.getTime()) || isoUtcDateString !== dateSections.join('-')) {
      throw new Error('Invalid input');
    }

    const [year, month, day] = dateSections.map(Number);

    return new Datestamp(year, month, day);
  }

  /**
   * Правила преобразования класса в примитивы
   */
  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
    switch (hint) {
      case 'string':
        return this.datestamp;
      case 'number':
        return this.timestamp;
      case 'default':
        return this.datestamp;
    }
  }

  /**
   * Настроенный вывод объекта в виде цветной строки, а не объекта (наподобие console.log(new Date()))
   */
  [Symbol.for('nodejs.util.inspect.custom')](
    _depth: unknown,
    options: {
      stylize: (s: string, s2: string) => string;
    },
    inspect: {
      styles: Record<string, string>;
    },
  ) {
    inspect.styles.datestamp = 'cyanBright';

    return options.stylize(this.datestamp, 'datestamp');
  }

  toString() {
    return this.datestamp;
  }

  toJSON() {
    return this.datestamp;
  }

  getDay() {
    return this.day;
  }

  getMonth() {
    return this.month;
  }

  getYear() {
    return this.year;
  }

  static isDatestamp(value: unknown): value is Datestamp {
    return (
      typeof value === 'object' &&
      value !== null &&
      '@instanceof' in value &&
      // type-coverage:ignore-next-line
      (value as { '@instanceof': symbol })['@instanceof'] ===
        Symbol.for(Datestamp.name)
    );
  }
}

type DatestampType = typeof Datestamp;

declare global {
  interface Datestamp {
    getDay(): number;
    getMonth(): number;
    getYear(): number;
    toString(): string;
    toJSON(): string;
  }

  // eslint-disable-next-line no-var
  var Datestamp: DatestampType;
}

global.Datestamp = Datestamp;

export {};
