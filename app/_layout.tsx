// Importa o componente Stack do expo-router para gerenciar a navegação em pilha
import { Stack } from "expo-router";

// Componente funcional RootLayout que define a estrutura de navegação
export default function RootLayout() {
  return (
    // Envolve o conteúdo em um Stack, que organiza as telas em pilha
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Define a tela inicial da pilha com o nome "index" */}
      <Stack.Screen name="index" />
    </Stack>
  );
}
