import { KeyValMap } from "@/constants/common-type";
import { useGlobalState } from "@/context/globalStateContext";
import { navigateToUser } from "@/pages/avatar/avatar";
import { userService } from "@/services/userService";
import { expressApi } from "@/utils/api";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
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
  const { user } = useGlobalState();
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

  const renderPopoverContent = (followee: KeyValMap) => (
    <div className="tw-flex tw-gap-8">
      <Button
        type="text"
        onClick={() => userService.follow(user?.id, followee.id)}
      >
        关注
      </Button>
    </div>
  );
  return (
    <div className={`${styles.followeeListBox} tw-flex tw-flex-col tw-gap-2`}>
      {followees.map((followee: KeyValMap) => (
        <div
          key={followee.id}
          className={`${styles.followeeItem} tw-flex tw-items-center tw-justify-between tw-gap-2 tw-cursor-pointer`}
        >
          <div
            className="tw-flex tw-items-center tw-gap-2"
            onClick={() => handleFolloweeClick(followee.uuid)}
          >
            <BoringAvatars size={20} name={followee.id.toString()} />
            <div className={styles.followeeName}>{followee.username}</div>
          </div>
          <div className="action">
            <Popover
              content={() => renderPopoverContent(followee)}
              trigger="click"
            >
              <MoreOutlined className="tw-rotate-90" />
            </Popover>
          </div>
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
