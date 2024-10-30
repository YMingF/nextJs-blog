import { expressApi } from "@/utils/api";
import { Empty } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserProfile from "./userProfile";

interface Props {
  // Define your props here
}

const SearchUsers: NextPage<Props> = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [prevQuery, setPrevQuery] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      if (router.query?.q !== prevQuery) {
        const encodedQuery = decodeURIComponent(router.query.q as string);
        const res = await expressApi.post(`/filterUser`, {
          username: encodedQuery,
        });
        setUsers(res?.data || []);
        setPrevQuery(router.query.q as string);
      }
    };
    fetchUsers();
  }, [router.query.q, router.query.type, prevQuery]);

  return (
    <>
      {users?.length > 0 ? (
        <div>
          {users.map((item) => (
            <UserProfile key={item.uuid} userData={item} />
          ))}
        </div>
      ) : (
        <Empty description="暂无数据" />
      )}
    </>
  );
};

export default SearchUsers;
