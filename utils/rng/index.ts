import {
  MersenneTwister19937,
  shuffle,
  integer,
  Distribution,
  pick,
} from 'random-js';

export interface RngOptions {
  /** Initial seed of the RNG */
  seed?: number;
  /** Initial state of the RNG */
  discard?: number;
}

export interface RngStatus {
  seed: number;
  usedCount: number;
}

export class Rng {
  /**
   * If true, integer distributions will be cached. Usefull to speed-up a bit
   * when picking random numbers with an unknown range, but in a repeated way
   */
  public static cacheDistributions: boolean = true;
  private static cachedDistributions: {
    [key: string]: Distribution<number>;
  } = {};

  protected readonly engine: MersenneTwister19937;
  protected readonly i100: Distribution<number>;
  private readonly seed: number;

  constructor(options?: RngOptions) {
    // tslint:disable: no-magic-numbers

    // engine initialization
    this.seed =
      (options && options.seed) ||
      Date.now() + Number(String(Math.random()).substring(2));
    this.engine = MersenneTwister19937.seed(this.seed);
    if (options && options.discard) {
      this.engine.discard(options.discard);
    }

    // used distributions
    this.i100 = integer(0, 99);
  }

  public static clearCachedDistributions(): void {
    Rng.cachedDistributions = {};
  }

  /**
   * Returns the seed and the number of times that the Engine has been used
   */
  public getStatus(): RngStatus {
    return {
      seed: this.seed,
      usedCount: this.engine.getUseCount(),
    };
  }

  /**
   * Gets a boolean based on the given chance
   *
   * The chance is expressed as a percentage or the number of winning
   * possibilities out of a total, being 50 out of 100 by default (50%)
   */
  public bool(chances: number = 50, total: number = 100): boolean {
    // tslint:disable: no-magic-numbers
    const probability = chances / total;

    return this.i100(this.engine) < probability * 100;
  }

  /**
   * Returns an integer between `Number.MIN_SAFE_INTEGER` and
   * `Number.MAX_SAFE_INTEGER`
   */
  public integer(): number;

  /**
   * Returns an integer between [0, max]
   */
  public integer(max: number): number;

  /**
   * Returns an integer number between [min, max]
   */
  public integer(min: number, max: number): number;

  public integer(a?: number, b?: number): number {
    if (typeof a === 'undefined') {
      return this.engine.next();
    }

    let distribution: Distribution<number>;
    let key: string;

    if (Rng.cacheDistributions) {
      key = `${a},${b}`;
      distribution = Rng.cachedDistributions[key];
      if (distribution) return distribution(this.engine);
    }

    distribution =
      typeof b === 'undefined' ? integer(0, a) : integer(a, b as number);

    if (Rng.cacheDistributions) {
      Rng.cachedDistributions[key!] = distribution;
    }

    return distribution(this.engine);
  }

  /**
   * Returns a random value within the provided ones
   */
  public pick<T>(values: readonly T[]): T | undefined {
    if (values.length === 0) return;
    return pick(this.engine, values);
  }

  /**
   * Shuffles an array modifying it
   */
  public shuffle<T>(data: T[]): T[] {
    return shuffle(this.engine, data);
  }

  /**
   * Generates a random string of the specified size from the given characters
   */
  public randomString(charset: string, size: number): string {
    let str = '';

    for (let i = 0; i < size; i++) {
      str += this.pick((charset as unknown) as string[]);
    }

    return str;
  }
}
