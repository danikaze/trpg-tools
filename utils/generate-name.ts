import { namesByRace } from '@utils/constants/names';
import { Rng } from '@utils/rng';
import { MarkovChain } from './markov-chain';

export type Race = keyof N;
export type NameType<R extends Race> = keyof N[R]['types'];

type N = typeof namesByRace;
type TypesOf<R extends Race> = N[R]['types'];

const cachedChains: Record<string, MarkovChain> = {};

export function generateName<R extends Race>(
  race: R,
  type: NameType<R>,
  useMarkov?: boolean
): string {
  const rng = new Rng();
  const def = namesByRace[race];
  if (!def) throw new Error(`Error in the race: ${race}`);

  const defType = ((def.types as TypesOf<R>)[type] as unknown) as {
    parts: string[];
  };
  if (!defType) throw new Error(`Error in the type: ${type}`);

  const defParts = def.parts as Record<
    string,
    { markov: boolean; list: string[] }
  >;
  return defType
    .parts!.map((part) => {
      const partDef = defParts[part];

      return partDef.markov && useMarkov
        ? getMarkovPart(`${race}-${type}-${part}`, partDef.list)
        : rng.pick(partDef.list);
    })
    .join(' ');
}

function getMarkovPart(key: string, src: string[]): string {
  let chain = cachedChains[key];

  if (!chain) {
    chain = new MarkovChain(src);
    cachedChains[key] = chain;
  }

  return chain.generate();
}
