import React from "react";
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
import ButtonPrimary from "./ButtonPrimary";
import { Theme } from "@styles/Theme"; // Importa o Theme com as cores

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get("window");

const SandwichMenu: React.FC<ModalProps> = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (visible) {
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
  }, [visible, slideAnim]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onClose());
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
                  onPress={() => screens.matches.play()}
                />
                <ButtonPrimary title="Teste" onPress={() => screens.teste()} />
                <ButtonPrimary title="Teste" onPress={() => screens.teste2()} />
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
