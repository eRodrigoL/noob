import { useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "@styles/Default";
import SCREENS from "@routes/Routes";

export default function Index() {
  const router = useRouter();

  const goToLogin = () => {
    SCREENS.SCREENS.user.login(router);
  };

  const goToList = () => {
    SCREENS.SCREENS.boardgame.list(router);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => goToLogin()} style={styles.button}>
        {/* Adiciona um texto para o botão */}
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToList()} style={styles.button}>
        {/* Adiciona um texto para o botão */}
        <Text style={styles.buttonText}>Lista</Text>
      </TouchableOpacity>
    </View>
  );
}
