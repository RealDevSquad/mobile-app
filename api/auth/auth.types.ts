export type TGithubLoginResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
};

export type TQRAuthResponse = {
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  message: string;
};

export type TQRAuthRequest = {
  device_info: string;
  user_id: string;
  device_id: string;
};
