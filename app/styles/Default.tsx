import { StyleSheet } from "react-native";
import { Theme } from "./Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.light.background,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: Theme.light.text,
    marginBottom: 40,
  },
  diceIcon: {
    fontSize: 48,
  },
  label: {
    fontSize: 18,
    color: Theme.light.text,
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 8,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: Theme.light.imput,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonPrimary: {
    width: "80%",
    height: 50,
    backgroundColor: Theme.light.backgroundButton,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonPrimaryText: {
    color: Theme.light.textButton,
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    color: Theme.light.text,
    fontSize: 16,
  },
  signupLink: {
    color: Theme.light.link,
    fontWeight: "bold",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.light.secondary.backgroundButton,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    color: "#fff",
    fontSize: 16,
  },
  searchBar: {
    height: 40,
    borderColor: Theme.light.borda,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
  },
  card: {
    width: "45%",
    backgroundColor: Theme.light.backgroundCard,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    alignItems: "center",
    shadowColor: Theme.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default styles;
