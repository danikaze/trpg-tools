import { namesByRace } from '@utils/constants/names';
import { Rng } from '@utils/rng';

export type Race = keyof N;
export type NameType<R extends Race> = keyof N[R]['types'];
type N = typeof namesByRace;
type TypesOf<R extends Race> = N[R]['types'];

export function generateName<R extends Race>(
  race: R,
  type: NameType<R>
): string {
  const rng = new Rng();
  const def = namesByRace[race];
  if (!def) throw new Error(`Error in the race: ${race}`);

  const defType = ((def.types as TypesOf<R>)[type] as unknown) as {
    parts: string[];
  };
  if (!defType) throw new Error(`Error in the type: ${type}`);

  const defParts = def.parts as { [part: string]: string[] };
  return defType.parts!.map((part) => rng.pick(defParts[part])).join(' ');
}
