import { BulletPipe } from './bullet.pipe';

describe('BulletPipe', () => {
  it('create an instance', () => {
    const pipe = new BulletPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return an array with the indexes of the elements', () => {
    const pipe = new BulletPipe();

    const result = pipe.transform([{}, {}, {}]);

    result.forEach((elem, i) => {
      expect(elem).toEqual(i);
    });
  });
});
