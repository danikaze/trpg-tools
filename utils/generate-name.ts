import { namesByRace } from '@utils/constants/names';
import { Rng } from '@utils/rng';

export type Race = keyof N;
export type NameType<R extends Race> = keyof N[R]['types'];
type N = typeof namesByRace;
type TypesOf<R extends Race> = N[R]['types'];

export function generateName<R extends Race>(
  race: R,
  type: NameType<R>,
  n: number = 1
): string {
  const rng = new Rng();
  let name = '';
  const def = namesByRace[race];
  const defType = ((def.types as TypesOf<R>)[type] as unknown) as {
    parts: string[];
  };
  const defParts = def.parts as { [part: string]: string[] };

  defType.parts?.forEach((part: string) => {
    const str = rng.pick(defParts[part]);
    name = `${name} ${str}`;
  });

  return name;
}
