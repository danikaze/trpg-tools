import { Rng } from './rng';

const rng = new Rng();

export function roll(expr: string): number {
  if (/[^+\-*xd\d\s]/.test(expr)) {
    throw new Error(`Dice expression malformed: ${expr}`);
  }

  const dicedExpr = expr.replace(/(\d+)d(\d+)/g, (m, t, f) => {
    const times = Number(t);
    const faces = Number(f);
    let res = 0;

    for (let i = 0; i < times; i++) {
      res += rng.integer(1, faces);
    }
    return String(res);
  });

  // Probably is safer (and faster?) parsing the expression...
  // but this is simpler
  // TODO: Replace it with a library like math.js, expr-eval or similar?

  // tslint:disable:no-eval
  return eval(dicedExpr);
}
