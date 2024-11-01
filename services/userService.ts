import { expressApi } from "@/utils/api";

export const userService = {
  follow: async (followerId: number, followingId: number) => {
    return await expressApi.post("/user/follow", {
      followerId,
      followingId,
    });
  },
  unfollow: async (followerId: number, followingId: number) => {
    return await expressApi.post("/user/unfollow", {
      followerId,
      followingId,
    });
  },
  getFollowees: async (followerId: number) => {
    const res = await expressApi.post("/user/getFollowees", {
      followerId,
    });
    return res.data;
  },
};
