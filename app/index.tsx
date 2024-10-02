import React from "react";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "@styles/Default";
import SCREENS from "@routes/Routes";
import ButtonPrimary from "@components/ButtonPrimary";

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
      <ButtonPrimary title="Login" onPress={() => goToLogin()} />
      <ButtonPrimary title="Lista" onPress={() => goToList()} />
    </View>
  );
}
