export interface DecodedImage {
  type: string;
  ext: string;
  data: Buffer;
}

export function decodeBase64Image(str?: string): DecodedImage | void {
  const RE_TYPE_INDEX = 1;
  const RE_EXT_INDEX = 2;
  const RE_DATA_INDEX = 3;
  const match = /^data:(image\/([^;]{3,}));base64,(.+)$/.exec(str!);
  if (!match) return;

  return {
    type: match[RE_TYPE_INDEX],
    ext: match[RE_EXT_INDEX],
    data: Buffer.from(match[RE_DATA_INDEX], 'base64'),
  };
}
