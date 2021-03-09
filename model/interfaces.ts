export interface TimestampTable {
  createdOn: number;
  updatedOn: number;
}

export interface SqlCountResult {
  total: number;
}

export type Nullable<T extends {}> = {
  [k in keyof T]: T[k] | null;
};
