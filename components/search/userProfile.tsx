import { KeyValMap } from "@/constants/common-type";
import { navigateToUser } from "@/pages/avatar/avatar";
import { Divider } from "antd";
import BoringAvatars from "boring-avatars";
import { NextPage } from "next";
import { useRouter } from "next/router";

interface Props {
  userData: KeyValMap;
}

const UserProfile: NextPage<Props> = ({ userData }) => {
  const router = useRouter();
  return (
    <div>
      <div
        className="tw-flex tw-items-start tw-gap-4 tw-cursor-pointer"
        onClick={() => navigateToUser(userData, router)}
      >
        <BoringAvatars
          size={40}
          name={userData?.id?.toString()}
        ></BoringAvatars>
        <div className="tw-flex tw-flex-col tw-items-start">
          <span className="tw-text-base">{userData.username}</span>
          <span className="tw-text-sm tw-text-gray-500">没留下什么东西</span>
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default UserProfile;
