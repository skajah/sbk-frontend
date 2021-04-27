import http from './httpService';
import config from '../config';

const loadLimit = config.loadLimit;

const userApiEndpoint = config.apiUrl + '/users';

export function register(user) {
  return http.post(userApiEndpoint, user);
}

export async function getMe() {
  const { data: me } = await http.get(`${userApiEndpoint}/me`);
  return me;
}

export function updateMe(data) {
  return http.patch(`${userApiEndpoint}/me`, data);
}

export function getUser(id) {
  return http.get(`${userApiEndpoint}/${id}`);
}

export function getFollowing(id, maxDate, limit = loadLimit) {
  return http.get(
    `${userApiEndpoint}/${id}/following?maxDate=${maxDate || ''}&limit=${limit}`
  );
}

export function getFollowers(id, maxDate, limit = loadLimit) {
  return http.get(
    `${userApiEndpoint}/${id}/followers?maxDate=${maxDate || ''}&limit=${limit}`
  );
}

export function checkLiked(id, type) {
  return http.get(`${userApiEndpoint}/me/checkLiked/${id}?type=${type}`);
}

export function checkFollowing(id) {
  return http.get(`${userApiEndpoint}/me/checkFollowing/${id}`);
}
