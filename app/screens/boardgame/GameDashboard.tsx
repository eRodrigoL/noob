import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Svg, Circle, Line, Polygon, Text as SvgText } from "react-native-svg";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

export default function GameDashboard() {
  // Capturando o parâmetro `id` da rota
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [data, setData] = useState<number[]>([]); // Dados do gráfico
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Categorias e configurações do gráfico
  const categories = ["Beleza", "Divertimento", "Duração", "Preço", "Armazenamento"];
  const maxValue = 100; // Valor máximo para o gráfico
  const chartSize = 250; // Tamanho do gráfico (área central)
  const margin = 70; // Margem extra para os rótulos
  const svgSize = chartSize + margin * 2; // Tamanho total do SVG
  const radius = chartSize / 2; // Raio do gráfico

  // Função para calcular coordenadas de cada ponto
  const calculateCoordinates = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total; // Ângulo em radianos
    const distance = (value / maxValue) * radius; // Distância do centro
    const x = margin + radius + distance * Math.sin(angle); // Coordenada X
    const y = margin + radius - distance * Math.cos(angle); // Coordenada Y
    return { x, y };
  };

  // Gerar os pontos para o polígono principal
  const points = data
    .map((value, index) => {
      const { x, y } = calculateCoordinates(value, index, data.length);
      return `${x},${y}`;
    })
    .join(" ");

  // Função para buscar os dados da API com axios
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api-noob-react.onrender.com/api/avaliacoes/`
      );

      // Filtrar as avaliações pelo ID do jogo
      const filteredEvaluations = response.data.filter(
        (evaluation: any) => evaluation.jogo === id
      );

      if (filteredEvaluations.length === 0) {
        setError("Nenhuma avaliação encontrada para este jogo.");
        setLoading(false);
        return;
      }

      const categoryMapping: { [key: string]: string } = {
        Beleza: "beleza",
        Divertimento: "divertimento",
        Duração: "duracao",
        Preço: "preco",
        Armazenamento: "armazenamento",
      };

      // Calcular as médias das categorias
      const averages = categories.map((category) => {
        const apiField = categoryMapping[category]; // Obtemos o campo correspondente da API
        const sum = filteredEvaluations.reduce((acc: number, curr: any) => {
          const value = curr[apiField] || 0; // Usa 0 se o atributo não existir
          return acc + value;
        }, 0);
        return sum / filteredEvaluations.length;
      });

      setData(averages);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Erro ao buscar dados da API.");
      setLoading(false);
    }
  };

  // Chamada inicial
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20 }}>Conteúdo da aba Gráficos do jogo</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <Svg width={svgSize} height={svgSize}>
          {/* Linhas da grade */}
          {[1, 0.75, 0.5, 0.25].map((factor, i) => (
            <Polygon
              key={i}
              points={categories
                .map((_, index) => {
                  const { x, y } = calculateCoordinates(
                    factor * maxValue,
                    index,
                    categories.length
                  );
                  return `${x},${y}`;
                })
                .join(" ")}
              stroke="gray"
              strokeWidth="0.5"
              fill="none"
            />
          ))}

          {/* Eixos */}
          {categories.map((_, index) => {
            const { x, y } = calculateCoordinates(maxValue, index, categories.length);
            return (
              <Line
                key={index}
                x1={margin + radius}
                y1={margin + radius}
                x2={x}
                y2={y}
                stroke="gray"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Polígono dos dados */}
          <Polygon points={points} fill="rgba(26, 255, 146, 0.3)" stroke="green" />

          {/* Categorias e rótulos de valores */}
          {categories.map((category, index) => {
            // Calcular posição do rótulo da categoria
            const { x, y } = calculateCoordinates(maxValue + 20, index, categories.length);

            // Calcular posição do rótulo do valor
            const valuePoint = calculateCoordinates(data[index], index, categories.length);

            return (
              <React.Fragment key={index}>
                {/* Rótulo da categoria */}
                <SvgText
                  x={x}
                  y={y}
                  fontSize="12"
                  textAnchor="middle"
                  fill="black"
                >
                  {category}
                </SvgText>

                {/* Rótulo do valor (na frente do rótulo da categoria) */}
                <SvgText
                  x={x}
                  y={y + 14} // Posicionado abaixo do rótulo da categoria
                  fontSize="10"
                  textAnchor="middle"
                  fill="black"
                >
                  {data[index].toFixed(1)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Centro */}
          <Circle cx={margin + radius} cy={margin + radius} r="3" fill="black" />
        </Svg>
      )}
    </View>
  );
}
