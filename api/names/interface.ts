export type NameGeneratorMode = 'markov' | 'mix' | 'original';

export type GenerateNameReturn = string[];

export interface GenerateNameQuery {
  race: string;
  type: string;
  mode: string;
}

export type GenerateNameBody = {};
