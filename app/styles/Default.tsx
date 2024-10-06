import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
  },
  diceIcon: {
    fontSize: 48,
  },
  label: {
    fontSize: 18,
    color: "#000",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 8,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonPrimary: {
    width: "80%",
    height: 50,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    color: "#000",
    fontSize: 16,
  },
  signupLink: {
    color: "#FF8C00",
    fontWeight: "bold",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
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
    borderColor: "#FF8C00",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
  },
});

export default styles;
