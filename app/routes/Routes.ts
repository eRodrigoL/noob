import { router, Router } from "expo-router";

const IMAGES = {
  unavailable: require("../../assets/images/Unavailable.png"),
  loading: require("../../assets/images/Loading.gif"),
  loading1: require("../../assets/images/1.gif"),
  loading2: require("../../assets/images/2.gif"),
  loading3: require("../../assets/images/3.gif"),
};

const SCREENS = {
  testeDeRota: require("../"),

  user: {
    login: (router: Router) => {
      router.push("/screens/user/Login");
    },
    register: (router: Router) => {
      router.push("/screens/user/Register");
    },
    user: (router: Router) => {
      router.push("/screens/user/UserProfile");
    },
  },

  boardgame: {
    list: (router: Router) => {
      router.push("/screens/boardgame/List");
    },
  },
};

export default { IMAGES, SCREENS };
