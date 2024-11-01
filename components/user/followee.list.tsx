import { KeyValMap } from "@/constants/common-type";
import { useGlobalState } from "@/context/globalStateContext";
import { navigateToUser } from "@/pages/avatar/avatar";
import { userService } from "@/services/userService";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import BoringAvatars from "boring-avatars";
import { get } from "lodash";
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
  const [loginedUserFollowees, setLoginedUserFollowees] = useState({});
  useEffect(() => {
    async function fetchFollowees() {
      const [followees, currentUserFollowees] = await Promise.all([
        userService.getFollowees(followerId),
        user?.id ? userService.getFollowees(user.id) : Promise.resolve([]),
      ]);
      setFollowees(followees);
      const mapping = currentUserFollowees.reduce(
        (acc: Record<number, boolean>, followee: KeyValMap) => {
          acc[followee.id] = true;
          return acc;
        },
        {}
      );
      setLoginedUserFollowees(mapping);
    }
    fetchFollowees();
  }, [props.followerId]);

  function handleFolloweeClick(uuid: string) {
    navigateToUser({ uuid }, router);
  }

  const renderPopoverContent = (followee: KeyValMap) => (
    <div className="tw-flex tw-gap-8">
      <Button
        type={get(loginedUserFollowees, followee.id) ? "text" : "primary"}
        onClick={async () => {
          if (get(loginedUserFollowees, followee.id)) {
            await userService.unfollow(user?.id, followee.id);
            setLoginedUserFollowees({
              ...loginedUserFollowees,
              [followee.id]: false,
            });
          } else {
            await userService.follow(user?.id, followee.id);
            setLoginedUserFollowees({
              ...loginedUserFollowees,
              [followee.id]: true,
            });
          }
        }}
      >
        {get(loginedUserFollowees, followee.id) ? "取消关注" : "关注"}
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
