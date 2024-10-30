import { expressApi } from "@/utils/api";
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
        const encodedQuery = encodeURIComponent(router.query.q as string);
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
    <div>
      {users.map((item) => (
        <UserProfile key={item.uuid} userData={item} />
      ))}
    </div>
  );
};

export default SearchUsers;
