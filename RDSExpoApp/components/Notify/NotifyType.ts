export type NotifyType = {
  onPress: () => void;
  title: string;
  buttonStyle: buttonStyleType;
  textStyle: textStyleType;
};
type buttonStyleType = {
  backgroundColor: string;
};
type textStyleType = { color: string };
