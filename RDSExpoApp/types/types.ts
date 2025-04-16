export type QRCodeScannedData = {
    type: string;
    data: string;
  };
  
  export type ModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
  };