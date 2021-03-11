export class MarkovChain {
  protected static readonly SCALE_WEIGHT = 1.3;

  private readonly chars: Record<string, Record<string, number>> = {};
  private readonly parts: Record<number, number> = {};
  private readonly lengths: Record<number, number> = {};
  private readonly initials: Record<string, number> = {};

  private readonly scaledChars: Record<string, number> = {};
  private scaledParts: number = 0;
  private scaledLengths: number = 0;
  private scaledInitials: number = 0;

  constructor(list: string[]) {
    this.constructChain(list);
    this.scaleChain();
  }

  private static add(target: Record<number, number>, token: number): void;

  private static add(target: Record<string, number>, token: string): void;

  private static add(
    target: Record<string | number, number>,
    token: string | number
  ): void {
    target[token] = (target[token] || 0) + 1;
  }

  private static addChar(
    map: Record<string, Record<string, number>>,
    char: string,
    token: string
  ): void {
    let links = map[char];
    if (!links) {
      links = {};
      map[char] = links;
    }
    links[token] = (links[token] || 0) + 1;
  }

  private static scaleMap(map: Record<number | string, number>): number {
    return Object.entries(map).reduce((acc, [key, count]) => {
      const w = Math.floor(Math.pow(count, MarkovChain.SCALE_WEIGHT));
      map[key] = w;
      return acc + w;
    }, 0);
  }

  public generate(): string {
    const n = this.select(this.scaledParts, this.parts)!;
    const parts: string[] = [];

    for (let i = 0; i < n; i++) {
      const partLength = this.select(this.scaledLengths, this.lengths);
      let char = this.select(this.scaledInitials, this.initials);
      let part = char;

      let lastChar = char;
      while (part.length < partLength) {
        const map = this.chars[lastChar!] as Record<string, number> | undefined;
        if (!map) break;

        char = this.select(this.scaledChars[lastChar!], map);
        part += char;
        lastChar = char;
      }

      parts.push(part);
    }

    return parts.join(' ');
  }

  private select<T extends string | number>(
    n: number,
    map: Record<T, number>
  ): T {
    const idx = Math.floor(Math.random() * n);
    const tokens = Object.keys(map);
    let acc = 0;
    let token: string;

    for (token of tokens) {
      acc += (map as Record<string, number>)[token];
      if (acc > idx) return token as T;
    }

    return token! as T;
  }

  private constructChain(list: string[]): void {
    for (const item of list) {
      const names = item.split(/\s+/);
      MarkovChain.add(this.parts, names.length);

      for (const name of names) {
        MarkovChain.add(this.lengths, name.length);

        let lastChar = name[0];
        MarkovChain.add(this.initials, lastChar);

        for (let i = 1; i < name.length; i++) {
          const char = name[i];
          MarkovChain.addChar(this.chars, lastChar, char);
          lastChar = char;
        }
      }
    }
  }

  private scaleChain(): void {
    this.scaledLengths = MarkovChain.scaleMap(this.lengths);
    this.scaledParts = MarkovChain.scaleMap(this.parts);
    this.scaledInitials = MarkovChain.scaleMap(this.initials);
    Object.entries(this.chars).forEach(([char, weights]) => {
      this.scaledChars[char] = MarkovChain.scaleMap(weights);
    });
  }
}
