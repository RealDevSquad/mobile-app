// TODO: by default read from env file
export const featureFlagState = {
  isProdEnvironment: true,
};

const localFeatureFlag = (state = featureFlagState, action: any) => {
  switch (action.type) {
    case 'PROD':
      return {
        ...state,
        isProdEnvironment: true,
      };
    case 'DEV':
      return {
        ...state,
        isProdEnvironment: false,
      };
    default:
      return state;
  }
};

export default localFeatureFlag;
