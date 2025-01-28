import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const scale = (uiElementPx: number): number => {
  const deviceWidthDp = width > height ? height : width;
  const uiWidthPx = 375;
  const rate = 1;
  return ((uiElementPx * deviceWidthDp) / uiWidthPx) * rate;
};

export const formatStatusText = (status: string) => {
  const words = status.split('_');
  const formattedText = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
  return formattedText.join(' ');
};
