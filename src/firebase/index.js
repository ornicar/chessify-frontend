import firebase from './firebase';
import 'firebase/auth';
// import 'firebase/remote-config';
// import 'firebase/analytics';

////
// AUTHENTICATION
////
export function signInAnonymously() {
  return firebase
    .auth()
    .signInAnonymously()
    .then(() => firebase.auth().currentUser.getIdToken(true))
    .then((idToken) => idToken)
    .catch((e) => console.error(e));
}

////
// REMOTE CONFIG
////
// const remoteConfig = firebase.remoteConfig();
// remoteConfig.defaultConfig = { websiteDarkMode: { _value: 0 } };
// remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

// export function getRemoteConfig() {
//   return remoteConfig.fetchAndActivate().then((activated) => {
//     // if (!activated) console.log('not activated');
//     return remoteConfig.getAll();
//   });
// }

////
// ANALYTICS
////
// const analytics = firebase.analytics();

// export function logPageView(page_title, params = {}) {
//   analytics.logEvent('page_view', { page_title, ...params });
// }

// export function logCustomEvent(event, params) {
//   analytics.logEvent(event, params);
// }
