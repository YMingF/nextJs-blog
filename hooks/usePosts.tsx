import { useEffect, useState } from "react";
import axios from "axios";
type Post = {
  id: string;
  content: string;
};
export default function ClientHook() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/v1/posts").then(
      (response) => {
        setPosts(response.data);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, []);
  return { posts, isLoading };
}
