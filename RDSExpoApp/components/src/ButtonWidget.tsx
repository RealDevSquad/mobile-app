import React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

interface IButtonWidget {
  icon?: ImageSourcePropType;
  title: string;
  textColor?: string;
  bgColor?: string;
  fontSize?: number;
  onPress: (event: GestureResponderEvent) => void;
}

const ButtonWidget = ({
  title,
  icon,
  onPress,
  textColor,
  bgColor,
  fontSize,
  style,
}: IButtonWidget) => {
  const btnStyle = [
    styles.button,
    {
      backgroundColor: bgColor ? bgColor : 'white',
      ...style,
    },
  ];

  return (
    <Pressable style={icon ? styles.iconStyle : btnStyle} onPress={onPress}>
      {icon ? (
        <Image style={{ height: 50, width: 50 }} source={icon} />
      ) : (
        <Text
          style={{
            color: textColor ? textColor : 'black',
            textAlign: 'center',
            fontSize: fontSize ? fontSize : 14,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginVertical: 4,
    borderColor: '#16A334',
    borderWidth: 1,
    padding: 10,
    elevation: 2,
    color: 'white',
    minWidth: '35%',
    maxWidth: '100%',
  },
  iconStyle: {
    borderRadius: 15,
  },
});

export default ButtonWidget;
