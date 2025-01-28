export const intialState = {
  data: {},
  loading: false,
  error: '',
};

const user = (state = intialState, action) => {
  switch (action.type) {
    case 'FETCH_USER':
      return { ...state, loading: false, data: action.user };
    case 'GET_USER':
      return { ...state, loading: true };
    case 'FETCH_USER_ERROR':
      return { ...state, loading: false, error: action.message };
    default:
      return state;
  }
};

export default user;
