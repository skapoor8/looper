import { EventContext, UserRecord, Auth } from 'gcip-cloud-functions';
import { get, request } from 'https';

const authClient = new Auth();

exports.beforeCreate = authClient
  .functions()
  .beforeCreateHandler((user: UserRecord, context: EventContext) => {
    // TODO
    console.log('user:', user, 'context', context);
    return {};
  });

exports.beforeSignIn = authClient
  .functions()
  .beforeSignInHandler(async (user, context) => {
    console.log(
      'user:',
      user,
      'context',
      context,
      'env:',
      process.env.API_ENDPOINT
    );
    // get user from api

    try {
      const json = await new Promise((resolve, reject) => {
        get(
          `${process.env.API_ENDPOINT}/users/uid/${user.uid}`,
          {
            headers: {
              // Authorization: `Bearer ${context.credential.idToken}`,
              'X-Looper-Api-Key': process.env.LOOPER_API_KEY,
            },
          },
          (res) => {
            let body = '';

            res.on('data', (chunk) => {
              body += chunk;
            });

            res.on('end', () => {
              try {
                console.log('got user from api:', body);
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
      // console.log('json:', json);
      // add custom claims - id, role
      return {
        customClaims: {
          looper_user_id: json['id'],
          looper_user_role: json['role'],
        },
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  });

// helpers -------------------------------------------------------------------
