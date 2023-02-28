const { get, post } = require('https');
// const admin = require('firebase-admin');
const { config } = require('dotenv');
// const firebase = require('firebase');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// script ----------------------------------------------------------------------

main();

// main ------------------------------------------------------------------------

async function main() {
  try {
    console.log('__dirname:', __dirname);
    config({
      path: path.join(__dirname, 'environments', '.env'),
    });
    // const idToken = await getIdToken(
    //   't2ECDOlh82PQB7SWq8JCYygIEI13',
    //   'AIzaSyBT2glrwdnRZecAtYskU4ckxNk62tRYjAU'
    // );
    console.log('looper api key', process.env.LOOPER_API_KEY);
    const json = await new Promise((resolve, reject) => {
      get(
        {
          host: 'func-looper-xbr2k3vaja-uc.a.run.app',
          path: '/users/uid/t2ECDOlh82PQB7SWq8JCYygIEI13',
          // url: `https://func-looper-xbr2k3vaja-uc.a.run.app/users/uid/t2ECDOlh82PQB7SWq8JCYygIEI13`,
          headers: {
            // Authorization: `Bearer ${idToken}`,
            'X-Looper-Api-Key': process.env.LOOPER_API_KEY,
          },
        },
        (res) => {
          let body = '';

          res.on('data', (chunk) => {
            // console.log('chunk:', chunk);
            body += chunk;
          });

          res.on('end', () => {
            try {
              let json = JSON.parse(body);
              // do something with JSON
              resolve(json);
            } catch (error) {
              console.error(error.message);
              reject(error);
            }
          });
        }
      );
    });
    console.log('json:', json);
    // // add custom claims - id, role
    // return {
    //   customClaims: {
    //     id: json['id'],
    //     role: json['role'],
    //   },
    // };

    // await getIdTokenForServiceAccount();
  } catch (e) {
    console.error('ERROR:', e);
    return {};
  }
}

// helpers ---------------------------------------------------------------------

// async function getIdToken(uid, firebaseApiKey) {
//   const firebaseAdminApp = admin.initializeApp({
//     credential: admin.credential.cert(
//       process.env['GOOGLE_APPLICATION_CREDENTIALS']
//     ),
//   });
//   const firebaseApp = firebase.initializeApp();

//   const token = await firebaseAdminApp.auth().createCustomToken(uid);
//   const user = await firebaseApp.signInWithCustomToken(token);

//   console.log('user:', user.getIdToken());

//   // const res = await post({
//   //   url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseApiKey}`,
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //   },
//   //   body: JSON.stringify({
//   //     token,
//   //     returnSecureToken: true,
//   //   }),
//   // });
//   // console.log('res:', res);
//   // return res?.idToken;
// }

async function getIdTokenForServiceAccount() {
  console.log('__dirname', __dirname);
  config({
    path: path.join(__dirname, 'environments', '.env'),
  });
  console.log('GAC:', process.env['GOOGLE_APPLICATION_CREDENTIALS']);
  const auth = new GoogleAuth();
  const url = `http://localhost:8080/users/`;
  const targetAudience = `https://func-looper-xbr2k3vaja-uc.a.run.app`;
  console.info(`request ${url} with target audience ${targetAudience}`);
  const client = await auth.getIdTokenClient(targetAudience);
  const res = await client.request({
    url,
    method: 'GET',
  });
  console.info(res.data);
}
