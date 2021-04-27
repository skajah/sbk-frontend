import http from './httpService';
import config from '../config';

const loadLimit = config.loadLimit;

const postApiEndpoint = config.apiUrl + '/posts';

export function getPosts({ filter, filterData, maxDate, limit = loadLimit }) {
  return http.get(
    `${postApiEndpoint}?filter=${
      filter || ''
    }&filterData=${filterData}&maxDate=${maxDate || ''}&limit=${limit}`
  );
}

export function getPost(id) {
  return http.get(`${postApiEndpoint}/${id}`);
}

export function createPost(post) {
  return http.post(postApiEndpoint, post);
}

export function deletePost(id) {
  return http.delete(`${postApiEndpoint}/${id}`);
}

export function likePost(id) {
  return http.patch(`${postApiEndpoint}/${id}`, { liked: true });
}

export function unlikePost(id) {
  return http.patch(`${postApiEndpoint}/${id}`, { liked: false });
}
