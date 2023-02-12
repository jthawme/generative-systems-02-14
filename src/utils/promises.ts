export const timer = (time = 2000, error = false): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject();
      } else {
        resolve();
      }
    }, time);
  });
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = src;
  });
};
