import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

/**
 * Get a hash based on a file contents.
 * It will return always the same for the same entry
 */
export function getFileHash(buffer: Buffer | string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fd =
      typeof buffer === 'string'
        ? createReadStream(buffer)
        : bufferToStream(buffer);

    const hash = createHash('sha1');
    hash.setEncoding('hex');

    fd.on('end', () => {
      hash.end();
      resolve(hash.read().toString());
    });

    fd.pipe(hash);
  });
}

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}
