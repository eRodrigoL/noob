import { Router } from "expo-router"; // Importa o Router para gerenciar as rotas do aplicativo

// Definição de constantes com imagens que serão usadas em diversas telas
const IMAGES = {
  unavailable: require("../../assets/images/Unavailable.png"),
  loading: require("../../assets/images/Loading.gif"),
  loading1: require("../../assets/images/1.gif"),
  loading2: require("../../assets/images/2.gif"),
  loading3: require("../../assets/images/3.gif"),
  fundo: require("../../assets/images/Plano de fundo.jpg"),
};

// Definição de rotas do aplicativo, organizadas por seções
const SCREENS = {
  testeDeRota: require("../"), // Rota de teste <{só para testar caminhos}>

  teste: (router: Router) => {
    router.push("/screens/user/Teste2"); // Direciona para a tela de login
  },

  user: {
    // Rota para login do usuário
    login: (router: Router) => {
      router.push("/screens/user/Login"); // Direciona para a tela de login
    },
    // Rota para registro de um novo usuário
    register: (router: Router) => {
      router.push("/screens/user/RegisterUser"); // Direciona para a tela de registro de usuário
    },
    // Rota para o perfil do usuário
    user: (router: Router) => {
      router.push("/screens/user/UserProfile"); // Direciona para a tela de perfil do usuário
    },
  },

  boardgame: {
    // Rota para a lista de jogos de tabuleiro
    list: (router: Router) => {
      router.push("/screens/boardgame/List"); // Direciona para a tela de listagem de jogos
    },
    // Rota para o cadastro de novos jogos de tabuleiro
    register: (router: Router) => {
      router.push("/screens/boardgame/RegisterGame"); // Direciona para a tela de registro de jogos
    },
  },
};

// Exporta as constantes IMAGES e SCREENS para serem usadas em outras partes do aplicativo
export default { IMAGES, SCREENS };
