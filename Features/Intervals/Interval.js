export class Interval {
  static getName(interval) {
    if (interval === 1) {
      return "H";
    }

    if (interval === 2) {
      return "T";
    }

    if (interval === 3) {
      return "3H";
    }

    throw new Error(`Invalid interval value '${interval}'`);
  }
}
