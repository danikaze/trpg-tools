import { WeightedOptions } from '@utils/rng/weighted-options';
import { roll } from '@utils/dice-roller';
import { Rng } from '@utils/rng';

export interface TableRollerResult<T> {
  quantity: number;
  data: T;
}

export interface TableRollerElements<T> {
  quantity?: number | string;
  data: T;
}

export interface PickedTableRoller<T> {
  quantity?: number | string;
  pick: readonly T[];
}

export interface WeightedTableRoller<T> {
  quantity?: number | string;
  options: WeightedOptions<TableRollerDef<T>>;
}

export interface NestedTableRoller<T> {
  quantity?: number | string;
  roll: TableRoller<T>;
}

// A table definition can be...
export type TableRollerDef<T> =
  // just an element
  // (in this case it's returned when picked - good for leaf elements)
  | T
  // an array of elements (pick returns all of them with quantity 1 each)
  | TableRollerDef<T>[]
  // quantified element, return it with explicit quantity
  | TableRollerElements<TableRollerDef<T>>
  // randomly pick the given number of elements from the table
  // (can be repeated)
  | PickedTableRoller<TableRollerDef<T>>
  // randomly weight-pick the given number of elements from the table
  // (can be repeated)
  | WeightedTableRoller<TableRollerDef<T>>
  // Another nested table roller
  | NestedTableRoller<T>;

export class TableRoller<T> {
  protected static readonly rng = new Rng();
  protected readonly def: TableRollerDef<T>;

  constructor(definition: TableRollerDef<T>) {
    this.def = definition;
  }

  protected static getNumber(quantity: undefined | string | number): number {
    if (quantity === undefined) return 1;
    if (typeof quantity === 'number') return quantity;
    return roll(quantity);
  }

  protected static pickFrom<T>(
    def: TableRollerDef<T>
  ): (TableRollerDef<T> | TableRollerResult<T>)[] {
    const res: (TableRollerDef<T> | TableRollerResult<T>)[] = [];

    if (isPickedTableRoller(def)) {
      const q = TableRoller.getNumber(def.quantity);
      for (let i = 0; i < q; i++) {
        res.push(TableRoller.rng.pick<TableRollerDef<T>>(def.pick)!);
      }
      return res;
    }

    if (isWeightedTableRoller<T>(def)) {
      const q = TableRoller.getNumber(def.quantity);
      for (let i = 0; i < q; i++) {
        const r = def.options.pick(TableRoller.rng)!;
        res.push(r as TableRollerDef<T>);
      }
      return res;
    }

    if (isTableRollerElements(def)) {
      return [
        {
          quantity: TableRoller.getNumber(def.quantity),
          data: def.data,
        },
      ];
    }

    if (isNestedTableRoller(def)) {
      return def.roll.roll();
    }

    if (Array.isArray(def)) {
      return def.map(TableRoller.pickFrom);
    }

    return [
      {
        quantity: 1,
        data: def,
      },
    ];
  }

  public roll(res: TableRollerResult<T>[] = []): TableRollerResult<T>[] {
    const source = [this.def];

    while (source.length > 0) {
      const def = source.shift() as TableRollerDef<T>;
      const unchecked = TableRoller.pickFrom(def);

      for (const picked of unchecked) {
        if (isTableRollerResult(picked)) {
          res.push(picked);
        } else if (Array.isArray(picked)) {
          source.push(...picked);
        } else {
          source.push(picked);
        }
      }
    }

    return res;
  }
}

export function isTableRollerResult<T = unknown>(
  o: unknown
): o is TableRollerResult<T> {
  return (
    typeof (o as TableRollerResult<T>).quantity === 'number' &&
    (o as TableRollerResult<T>).data !== undefined
  );
}

export function isTableRollerElements<T = unknown>(
  o: unknown
): o is TableRollerElements<T> {
  return (o as TableRollerElements<T>).data !== undefined;
}

export function isPickedTableRoller<T = unknown>(
  o: unknown
): o is PickedTableRoller<T> {
  return Array.isArray((o as PickedTableRoller<T>).pick);
}

export function isWeightedTableRoller<T = unknown>(
  o: unknown
): o is WeightedTableRoller<T> {
  return (o as WeightedTableRoller<T>).options instanceof WeightedOptions;
}

export function isNestedTableRoller<T = unknown>(
  o: unknown
): o is NestedTableRoller<T> {
  return (o as NestedTableRoller<T>).roll !== undefined;
}
