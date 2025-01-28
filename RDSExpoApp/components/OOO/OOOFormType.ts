export type OOOFormType = {
  toDate: Date;
  fromDate: Date;
  description: string;
  setToDate: () => void;
  setFromDate: () => void;
  setDescription: () => void;
  handleFormSubmit: () => void;
  isLoading: boolean;
  setIsFormVisible: () => void;
};
