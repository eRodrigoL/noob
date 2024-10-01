import { Router } from "expo-router";

const IMAGES = {
  loading: require("../../assets/images/Loading.gif"),
};

const SCREENS = {
  testeDeRota: require("../screens/user/Register"),

  user: {
    login: (router: Router) => {
      router.push("/screens/user/Login");
    },
    register: (router: Router) => {
      router.push("/screens/user/Register");
    },
  },

  boardgame: {
    list: (router: Router) => {
      router.push("/screens/boardgame/List");
    },
  },
};

export default { IMAGES, SCREENS };
