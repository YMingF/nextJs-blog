import { KeyValMap } from "@/constants/common-type";
import { navigateToUser } from "@/pages/avatar/avatar";
import { expressApi } from "@/utils/api";
import BoringAvatars from "boring-avatars";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./styles/followee.module.scss";

interface Props {
  followerId: number;
}

const FolloweeList: NextPage<Props> = (props) => {
  const { followerId } = props;
  const [followees, setFollowees] = useState([]);
  const router = useRouter();
  useEffect(() => {
    async function fetchFollowees() {
      const followees = await getFollowedUsers(followerId);
      setFollowees(followees);
    }
    fetchFollowees();
  }, [props.followerId]);

  function handleFolloweeClick(uuid: string) {
    navigateToUser({ uuid }, router);
  }
  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      {followees.map((followee: KeyValMap) => (
        <div
          key={followee.id}
          className="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer"
          onClick={() => handleFolloweeClick(followee.uuid)}
        >
          <BoringAvatars size={20} name={followee.id.toString()} />
          <div className={styles.followeeName}>{followee.username}</div>
        </div>
      ))}
    </div>
  );
};

export default FolloweeList;
async function getFollowedUsers(userId: number) {
  const res = await expressApi.post("/user/getFollowedUsers", {
    followerId: userId,
  });
  return res.data;
}
