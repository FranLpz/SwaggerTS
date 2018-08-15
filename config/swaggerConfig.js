import { Auth } from '../api/helpers/Auth';
import { Audit } from '../api/helpers/Audit';
import {intersection} from 'lodash';
import { getRepository } from 'typeorm';
import { users } from '../api/entity/users';


export const swaggerConfig = {
  appRoot: `${__dirname}/..`,
  swaggerSecurityHandlers: {
    JWTValidation: async function(req, authOrSecDef, scopesOrApiKey, callback) {
      const currentScopes = req.swagger.operation['x-security-scopes'];
      if (!!scopesOrApiKey && scopesOrApiKey.indexOf('Bearer ') === 0) {
        const userRepository = getRepository(users);
        const JWTToken = scopesOrApiKey.split('Bearer ')[1];
        const validation = Auth.verify(JWTToken);
        if (!!validation.error) {
          const err = new Error('Invalid token');
          err['statusCode'] = 400;
          callback(err);
        } else {
          const user = await userRepository.findOne({
            where: {
              id: validation.decoded.id,
              email: validation.decoded.email
            }
          });
          // tslint:disable-next-line:max-line-length
          if (currentScopes.length > 0 && intersection(validation.decoded.scopes, currentScopes).length === 0 && !user.deleted && user.active) {
            const err = new Error('Not Authorized');
            err['statusCode'] = 401;
            callback(err);
            return;
          } else {
              req.swagger.params.authPayload = validation.decoded;
              // tslint:disable-next-line:max-line-length
              if (req.swagger.operationPath[2] === 'post' || req.swagger.operationPath[2] === 'patch' || req.swagger.operationPath[2] === 'delete') {
                await Audit(req.swagger.path['x-swagger-router-controller'], req.swagger.operationPath[2], req.swagger.params.authPayload);
              }
              callback();
          }
        }
      } else {
        const err = new Error('Failed to authenticate using bearer token');
        err['statusCode'] = 403;
        callback(err);
      }
    }
  }
};