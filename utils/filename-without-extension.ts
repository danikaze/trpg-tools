export function filenameWithoutExtension(filename: string): string {
  const i = filename.lastIndexOf('.');
  if (i === -1) {
    return filename;
  }
  return filename.substr(0, i);
}
