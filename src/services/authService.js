import http from './httpService';
import config from '../config';

let tokenKey = 'loginToken';
const authApiEndpoint = config.apiUrl + '/auth';

// get rid of bi-directional dependency

http.setJwt(getJwt());

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export async function login(email, password) {
  const { data: jwt } = await http.post(authApiEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
  http.setJwt(getJwt());
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
  http.setJwt(getJwt());
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function hasCurrentUser() {
  return localStorage.getItem(tokenKey) !== null;
}

const auth = {
  login,
  logout,
  hasCurrentUser,
  loginWithJwt,
  getJwt,
};

export default auth;
