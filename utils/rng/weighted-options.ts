import { Rng } from '.';

export interface OptionWeight<T> {
  data: T;
  weight: number;
}

export class WeightedOptions<T> {
  protected readonly values: OptionWeight<T>[] = [];
  protected readonly total: number;

  constructor(optionList: OptionWeight<T>[]) {
    this.total = optionList.reduce((total, option) => {
      const weight = total + option.weight;
      this.values.push({
        weight,
        data: option.data,
      });
      return weight;
    }, 0);
  }

  /**
   * Get one of the provided options based on their weight
   */
  public pick(rng: Rng): T | undefined {
    const value = rng.integer(1, this.total);

    for (const option of this.values) {
      if (value <= option.weight) {
        return option.data;
      }
    }
  }
}
