import 'jest';
import { filenameWithoutExtension } from '@utils/filename-without-extension';

describe('filenameWithoutExtension', () => {
  it('should return the filename without the extension', () => {
    expect(filenameWithoutExtension('image.jpeg')).toBe('image');
    expect(filenameWithoutExtension('data.json')).toBe('data');
    expect(filenameWithoutExtension('onlyDot.')).toBe('onlyDot');
  });

  it('should identify if there is more than one dot', () => {
    expect(filenameWithoutExtension('having.two.dots')).toBe('having.two');
    expect(filenameWithoutExtension('this.has.three.dots')).toBe(
      'this.has.three'
    );
  });

  it('should include the whole path if any', () => {
    expect(filenameWithoutExtension('relative/file.ext')).toBe('relative/file');
    expect(filenameWithoutExtension('/absolute/file.ext')).toBe(
      '/absolute/file'
    );
  });

  it('should return the full string if there are no dots', () => {
    expect(filenameWithoutExtension('stringWithNoDots')).toBe(
      'stringWithNoDots'
    );
    expect(filenameWithoutExtension('kebab-case')).toBe('kebab-case');
  });
});
