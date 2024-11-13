import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { screens } from "@/app/routes/Routes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import ButtonPrimary from "./ButtonPrimary";
import { Theme } from "@styles/Theme"; // Importa o Theme com as cores

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get("window");

const SandwichMenu: React.FC<ModalProps> = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(-width)).current;
  const [hasOpenMatch, setHasOpenMatch] = useState(false);

  // Função para verificar se há partidas em aberto
  const checkOpenMatches = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (userId && token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        };

        const response = await axios.get(
          `https://api-noob-react.onrender.com/api/partidas/filtro?registrador=${userId}&fim=null`,
          config
        );
        setHasOpenMatch(response.data.length > 0);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Verifica se o erro é do tipo AxiosError
        if (error.response && error.response.status === 404) {
          
          setHasOpenMatch(false); // Nenhuma partida em aberto
        } else {
          console.error("Erro ao verificar partidas em aberto:", error);
        }
      } else {
        console.error("Erro desconhecido:", error);
      }
    }
  };
  

  // Verifica as partidas em aberto ao abrir o modal
  useEffect(() => {
    if (visible) {
      checkOpenMatches();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onClose());
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  // Função para decidir qual tela abrir ao clicar em "Jogar"
  const handlePlayPress = () => {
    if (hasOpenMatch) {
      screens.matches.finish();
    } else {
      screens.matches.play();
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalView,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <View style={styles.buttonContainer}>
                <ButtonPrimary
                  title="Login"
                  onPress={() => screens.user.login()}
                />
                <ButtonPrimary
                  title="Perfil"
                  onPress={() => screens.user.userProfile()}
                />
                <ButtonPrimary
                  title="Início"
                  onPress={() => screens.boardgame.list()}
                />
                <ButtonPrimary
                  title="Jogar"
                  onPress={handlePlayPress}
                />
                <ButtonPrimary title="Teste" onPress={() => screens.teste()} />
                <ButtonPrimary
                  title="Teste 2"
                  onPress={() => screens.teste2()}
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Mantém o fundo semitransparente
  },
  modalView: {
    width: "60%",
    height: "100%",
    backgroundColor: Theme.light.backgroundButton, // Cor de fundo do modal usando o tema
    padding: 20,
    justifyContent: "flex-start",
  },
  buttonContainer: {
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: Theme.light.backgroundButton, // Botões com cor secundária do tema
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: Theme.light.textButton, // Texto do botão conforme o tema
    fontSize: 18,
  },
});

export default SandwichMenu;

