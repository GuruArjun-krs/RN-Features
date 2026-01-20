import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const googleClient = () => {
  GoogleSignin.configure({
    webClientId:
      '174568161980-130h0epr8m12jrss295tv4t38a0mr21k.apps.googleusercontent.com',
    offlineAccess: true,
  });
};
