import AsyncStorage from '@react-native-async-storage/async-storage';

export const clientId = '23c78f66ab7964e5ef97';
export const clientSecret = '65621db87076180ab274b6dbdc1a3dd95b9dd952';
export const redirectUri = 'app://deeplink';
export const tokenUrl = 'https://github.com/login/oauth/access_token';

const githubConfig = async (authorizationCode) => {
  // Make POST request and handle response as previously explained
  console.log('response in github config', authorizationCode);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: authorizationCode,
      redirect_uri: redirectUri,
    }),
  });
  console.log('response in github config', response);

  if (response.ok) {
    console.log('response is the res ok?');

    const data = await response.json();
    const accessToken = data.access_token;

    // Call a function to securely store the access token
    storeAccessTokenSecurely(accessToken);
  } else {
    // Handle error response
    console.log('error');
    console.error(
      'Error exchanging code for access token:',
      response.status,
      response.statusText,
    );
  }
};

const storeAccessTokenSecurely = async (accessToken) => {
  console.log('access token', accessToken);
  try {
    // Store the access token in a secure storage
    await AsyncStorage.setItem('access_token', accessToken);
    console.log('Access token stored securely.');
  } catch (error) {
    console.error('Error storing access token:', error);
  }
};
export { githubConfig };
