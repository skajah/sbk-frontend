import { makeDate } from './makeDate';
const LZUTF8 = require('lzutf8');

export function readMedia(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
}

export function compress(data, outputEncoding = 'StorageBinaryString') {
  return new Promise((resolve, reject) => {
    LZUTF8.compressAsync(data, { outputEncoding }, (result, error) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export function decompress(data, inputEncoding = 'StorageBinaryString') {
  return new Promise((resolve, reject) => {
    LZUTF8.decompressAsync(data, { inputEncoding }, (result, error) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export async function decompressPost(post) {
  makeDate(post);
  if (post.media) post.media.data = await decompress(post.media.data);
  await decompressUser(post.user);
}

export async function decompressPosts(posts) {
  for (const post of posts) {
    await decompressPost(post);
  }
}

export async function decompressComments(comments) {
  for (const comment of comments) {
    makeDate(comment);
    await decompressUser(comment.user);
  }
}

export async function decompressUser(user) {
  if (user.profilePic) user.profilePic = await decompress(user.profilePic);
}

export async function decompressUsers(users) {
  for (const user of users) {
    await decompressUser(user);
  }
}
