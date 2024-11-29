import { router } from "expo-router"; // Importa o Router para gerenciar as rotas do aplicativo

// Definição de constantes com imagens que serão usadas em diversas telas
const images = {
  unavailable: require("../../assets/images/Unavailable.png"),
  loading: require("../../assets/images/Loading.gif"),
  loading1: require("../../assets/images/1.gif"),
  loading2: require("../../assets/images/2.gif"),
  loading3: require("../../assets/images/3.gif"),
  fundo:
    "https://t4.ftcdn.net/jpg/02/94/52/49/360_F_294524929_lUE0O2yalxV2OlMEKQGnYFXoZZ5w9t1k.jpg",
};

// Definição de rotas do aplicativo, organizadas por seções
const screens = {
  testeDeRota: "/",

  teste: () =>
    router.push(`/screens/boardgame/(gameProfile)?id=6660e497cae9928f8184c291`),
  teste2: () => router.push("/TESTE2"),

  user: {
    // Rota para login do usuário
    login: () => router.push("/screens/user/Login"),

    // Rota para registro de um novo usuário
    register: () => router.push("/screens/user/RegisterUser"),

    // Rota para o perfil do usuário
    userProfile: () => router.push("/screens/user/(userProfile)"),

    // Rota para edição do perfil do usuário
    editProfile: () => router.push("/screens/user/EditProfile"),
  },

  boardgame: {
    // Rota para a lista de jogos de tabuleiro
    list: () => router.push("/screens/boardgame/List"),

    // Rota para o cadastro de novos jogos de tabuleiro
    register: () => router.push("/screens/boardgame/RegisterGame"),

    // Rota para o perfil dos jogos
    gameProfile: (id: string | number) =>
      router.push(`/screens/boardgame/(gameProfile)?id=${id}`),

    // Rota para o avaliação dos jogos
    rating: (id: string | number) =>
      router.push(`/screens/boardgame/GameRating?id=${id}`),

    // Rota para gráficos dos jogos
    gameDashboard: (id: string | number) =>
      router.push(`/screens/boardgame/GameDashboard?id=${id}`),

    // Rota para ranking dos jogos
    ranking: (id: string | number) =>
      router.push(`/screens/boardgame/Ranking?id=${id}`),
  },

  matches: {
    play: () => router.push("/screens/matches/MatchStart"),
    finish: () => router.push("/screens/matches/MatchFinish"),
  },
};

// Exporta as constantes IMAGES e SCREENS para serem usadas em outras partes do aplicativo
export { images, screens };
