import Axios from "axios";
import { get } from "lodash";

export const getRandomArtPic = async () => {
  const res = await Axios.get(
    `https://api.unsplash.com/photos/random?client_id=TE7mbuSvJ5Sep-vatjrrMdgXOlYIigV8J41utWIvxiU`
  );
  return get(res, "data.urls.raw", "");
};
