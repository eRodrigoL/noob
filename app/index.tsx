// Importa as bibliotecas React, useEffect, useState e o hook useRouter do Expo Router
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Loading from "./Loading"; // Importa o componente Loading <{ARRUMAR: caminho}>

// Componente funcional que gerencia o redirecionamento com uma tela de carregamento
const Index = () => {
  const router = useRouter(); // Usa o hook useRouter para navegar entre páginas
  const [loading, setLoading] = useState(true); // Estado que controla o carregamento, inicialmente true

  // Hook useEffect que executa um efeito colateral após o primeiro render
  useEffect(() => {
    // Define um temporizador para redirecionar após 1 segundo
    const timer = setTimeout(() => {
      router.push("/screens/boardgame/List"); // Redireciona para a página List
      setLoading(false); // Atualiza o estado de loading para false
    }, 1000); // O temporizador é definido para 1 segundo (1000ms)

    // Limpa o temporizador ao desmontar o componente para evitar vazamentos de memória
    return () => clearTimeout(timer);
  }, [router]); // O efeito depende do hook router

  // Se o estado de loading for true, exibe o componente Loading, caso contrário, não exibe nada
  return loading ? <Loading /> : null;
};

// Exporta o componente Index como padrão para ser usado em outras partes do aplicativo
export default Index;
