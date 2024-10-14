import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Loading from "./Loading"; // Certifique-se de que o caminho esteja correto

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redireciona para a página List após um pequeno atraso
    const timer = setTimeout(() => {
      router.push("/screens/boardgame/List");
      setLoading(false); // Atualiza o estado de loading
    }, 1000); // Ajuste o tempo conforme necessário (1000ms = 1 segundo)

    // Limpeza do timer
    return () => clearTimeout(timer);
  }, [router]);

  // Exibe o componente de carregamento se loading for true
  return loading ? <Loading /> : null;
};

export default Index;
