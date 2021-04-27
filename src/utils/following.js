import { checkFollowing } from '../services/userService';

export async function getFollowings(objs) {
  const following = {};
  for (const obj of objs) {
    const userId = obj.user._id;
    if (!(userId in following)) {
      const { data: followingUser } = await checkFollowing(userId);
      following[userId] = followingUser;
    }
  }
  return following;
}
