import { NextRouter } from "next/router";
import { useEffect } from "react";
import eventEmitter from "../../../emitter/eventEmitter";

export const useUserChangeListener = (router: NextRouter) => {
  useEffect(() => {
    const handleUserChange = (newUser: any) => {
      if (newUser?.uuid !== router.query.uuid) {
        router.push(`/user/${newUser.uuid}`);
      }
    };

    eventEmitter.on("userChanged", handleUserChange);

    return () => {
      eventEmitter.off("userChanged", handleUserChange);
    };
  }, [router]);
};
