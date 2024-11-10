import React, { useEffect } from "react";

const ApiWakeUp = () => {
  const wakeUpApis = async () => {
    const urls = [
      "https://api-noob-react.onrender.com/api/partidas/",
      "https://api-noob-react.onrender.com/api/avaliacoes/",
      "https://api-noob-react.onrender.com/api/denuncias/",
      "https://api-noob-react.onrender.com/api/jogos/",
      "https://api-noob-react.onrender.com/api/usuarios",
    ];

    // Fazendo uma requisição GET para cada URL
    urls.forEach(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`API despertada: ${url}`);
        } else {
          console.error(
            `Erro ao despertar API: ${url} - Status: ${response.status}`
          );
        }
      } catch (error: unknown) {
        // Verifica se o erro é do tipo Error antes de acessar a mensagem
        if (error instanceof Error) {
          console.error(
            `Erro ao acessar a API: ${url} - Erro: ${error.message}`
          );
        } else {
          console.error(`Erro desconhecido ao acessar a API: ${url}`);
        }
      }
    });
  };

  useEffect(() => {
    // Desperta as APIs quando o componente é montado
    wakeUpApis();

    // Configura o intervalo de tempo em milessegundos(ms)
    const interval = setInterval(wakeUpApis, 300000); // 4 min

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default ApiWakeUp;
