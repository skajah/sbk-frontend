import http from './httpService';
import config from '../config';

const loadLimit = config.loadLimit;

const commentApiEndpoint = config.apiUrl + '/comments';

export function getComments(postId, maxDate, limit = loadLimit) {
  return http.get(
    `${commentApiEndpoint}?postId=${postId}&maxDate=${
      maxDate || ''
    }&limit=${limit}`
  );
}

export function createComment(comment) {
  return http.post(commentApiEndpoint, comment);
}

export function deleteComment(id) {
  return http.delete(`${commentApiEndpoint}/${id}`);
}

export function likeComment(id) {
  return http.patch(`${commentApiEndpoint}/${id}`, { liked: true });
}

export function unlikeComment(id) {
  return http.patch(`${commentApiEndpoint}/${id}`, { liked: false });
}
