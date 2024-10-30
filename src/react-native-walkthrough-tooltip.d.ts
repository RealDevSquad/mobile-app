declare module 'react-native-walkthrough-tooltip' {
  import React from 'react';
  import { GestureResponderEvent, ViewStyle } from 'react-native';

  export interface TooltipProps {
    isVisible?: boolean;
    content?: React.ReactElement;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    onClose?: (event: GestureResponderEvent) => void;
    closeOnContentInteraction?: boolean;
    closeOnBackgroundInteraction?: boolean;
    backgroundStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    tooltipStyle?: ViewStyle;
    arrowStyle?: ViewStyle;
    children?: React.ReactNode;
  }

  export default function Tooltip(props: TooltipProps): JSX.Element;
}
