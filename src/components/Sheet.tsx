import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from "react-native";
import styles from "./Sheet.styles";

const getButtonTextStyle = (variant?: string) => {
  switch (variant) {
    case "primary":
      return styles.primaryButtonText;
    case "danger":
      return styles.dangerButtonText;
    case "secondary":
    default:
      return styles.secondaryButtonText;
  }
};
const getButtonStyle = (variant?: string) => {
  switch (variant) {
    case "primary":
      return styles.primaryButton;
    case "danger":
      return styles.dangerButton;
    case "secondary":
    default:
      return styles.secondaryButton;
  }
};
export type ActionButton = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
};

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  heading: string;
  children: React.ReactNode;
  actionButtons: ActionButton[];
  height?: number;
  icon?: React.ReactNode;
};

export function Sheet({
  visible,
  onClose,
  heading,
  children,
  actionButtons,
  height = 80,
  icon,
}: SheetProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.container, { height: `${height}%` }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {icon && <View>{icon}</View>}
              <Text style={styles.headerTitle}>{heading}</Text>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
              >
                <FontAwesome5 name="times" size={18} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {children}
          </ScrollView>

          <View style={styles.footer}>
            {actionButtons.map((button, index) => (
              <Pressable
                key={`${button.label}-${index}`}
                style={[
                  styles.button,
                  getButtonStyle(button.variant),
                  (button.disabled || button.loading) && styles.buttonDisabled,
                ]}
                onPress={button.onPress}
                disabled={button.disabled || button.loading}
              >
                {button.loading ? (
                  <ActivityIndicator
                    size="small"
                    color={button.variant === "secondary" ? "#374151" : "#FFFFFF"}
                  />
                ) : (
                  <Text style={getButtonTextStyle(button.variant)}>{button.label}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
