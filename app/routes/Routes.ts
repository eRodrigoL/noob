import { Router } from "expo-router";

const IMAGES = {
  loading: require("../../assets/images/Loading.gif"),
  loading1: require("../../assets/images/1.gif"),
  loading2: require("../../assets/images/2.gif"),
  loading3: require("../../assets/images/3.gif"),
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
    // list: (router: Router) => {
    //   router.push("/screens/boardgame/List");
    // },
    list: (router: Router) => {
      router.push("../index");
    },
  },
};

export default { IMAGES, SCREENS };
