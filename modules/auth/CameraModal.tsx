import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CameraView } from 'expo-camera';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CameraModalProps = {
  onBarcodeScanned: (data: string) => void;
  onClose: () => void;
  showModal: boolean;
  qrCodeLogin: () => void;
};

const CameraModal: React.FC<CameraModalProps> = ({
  onBarcodeScanned,
  onClose,
  showModal,
  qrCodeLogin,
}) => {
  return (
    <CameraView
      style={styles.camera}
      facing="back"
      onBarcodeScanned={(data) => data?.data && onBarcodeScanned(data.data)}
      testID="camera-view"
    >
      <View style={styles.overlay}>
        <View>
          <Text style={styles.instruction}>
            Please navigate to{' '}
            <Text style={styles.link}>https://my.realdevsquad.com/mobile</Text>{' '}
            and scan the QR code to log in.
          </Text>
        </View>
        <View style={styles.scannerFrame}>
          <View style={styles.scannerBorder} />
        </View>

        <TouchableOpacity
          style={[styles.closeButton, { top: 80, right: 20 }]}
          onPress={onClose}
          accessibilityRole="button"
          testID="close-button"
        >
          <FontAwesome
            name="times"
            size={24}
            color={theme.colors.text.inverted}
          />
        </TouchableOpacity>

        {showModal && (
          <View style={styles.modalContainer} testID="modal-container">
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Your QR code has been scanned successfully. Please visit the
                website to verify your status before proceeding.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={qrCodeLogin}
                accessibilityRole="button"
                testID="login-button"
              >
                <Text style={styles.modalButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </CameraView>
  );
};

export default CameraModal;

const styles = StyleSheet.create({
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  instruction: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  link: {
    color: theme.colors.success[500],
    fontFamily: theme.typography.fontFamily.bold,
    textDecorationLine: 'underline',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scannerBorder: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: theme.colors.primary[500],
    borderRadius: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: theme.colors.primary[500],
    borderRadius: 50,
    padding: theme.spacing.sm,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  modalText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
  },
  modalButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
