export const getUser = (userId: string) => {
  return {
    type: 'GET_USER',
    payload: userId,
  };
};
