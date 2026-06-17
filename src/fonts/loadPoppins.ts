import { continueRender, delayRender, staticFile } from 'remotion';

const FAMILY = 'Poppins';
let registered = false;

export const loadFont = (): string => {
  if (!registered && typeof document !== 'undefined') {
    registered = true;
    const handle = delayRender('Loading Poppins font');

    const weights: [string, number][] = [
      ['Poppins-300.ttf', 300],
      ['Poppins-500.ttf', 500],
      ['Poppins-700.ttf', 700],
    ];

    Promise.all(
      weights.map(([file, weight]) => {
        const font = new FontFace(FAMILY, `url(${staticFile(`fonts/${file}`)})`, { weight: String(weight) });
        document.fonts.add(font);
        return font.load();
      })
    )
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }
  return FAMILY;
};
