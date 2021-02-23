import { dispatcher } from '@helpers/redux';
import AxiosInstance from './AxiosInstance';
import { 
  Method, Result, ApiParams, NetworkParams 
} from './abstract';

// ApiParams Mapping to NetworkParams
export function networkParamsMap(param: ApiParams, method: Method): NetworkParams {  
  const networkObject : NetworkParams = {};  

  Object.assign(networkObject, param);
  
  networkObject.method = method;

  return networkObject;
}

export default class Network {
  static network(params: NetworkParams): Promise<Result> {
    const {
      url, method, headers, data, action 
    } = params;
    return new Promise((resolve, reject) => {
      AxiosInstance({
        url, method, headers, data 
      })
        .then((res) => {
          // Change it for yourself
          if (res.data.statusCode === 200) {
            if (action) {
              // to directly transfer data to redux
              dispatcher({ 
                type: action.type,
                payload: action?.key ? res.data.result[action.key] : res.data.result 
              });
            }             
              
            return resolve(res.data);
          }    
          return reject(res.data);
        })
        .catch((err) => reject(err));
    });
  }

  static getRequest(params: ApiParams): Promise<Result> {
    return this.network(networkParamsMap(params, 'GET'));
  }

  static deleteRequest(params: ApiParams): Promise<Result> {
    return this.network(networkParamsMap(params, 'DELETE'));
  }

  static postRequest(params: ApiParams): Promise<Result> {
    return this.network(networkParamsMap(params, 'POST'));
  }
 
  static putRequest(params: ApiParams): Promise<Result> {
    return this.network(networkParamsMap(params, 'PUT'));
  }
 
  static patchRequest(params: ApiParams): Promise<Result> {
    return this.network(networkParamsMap(params, 'PATCH'));
  }
}

// (function() {
//     String token = store.getState().session.token;
//     if (token) {
//         axios.defaults.headers.common['Authorization'] = token;
//     } else {
//         axios.defaults.headers.common['Authorization'] = null;
//         /*if setting null does not remove `Authorization` header then try     
//           delete axios.defaults.headers.common['Authorization'];
//         */
//     }
// })();
