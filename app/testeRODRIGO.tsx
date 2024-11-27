import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "@styles/Default";

const UserProfileDescription: React.FC<{
  user: any;
  editedUser: any;
  isEditing: boolean;
  handleEditToggle: () => void;
  setEditedUser: React.Dispatch<React.SetStateAction<any>>;
  addOneDay: (date: string) => string;
}> = ({
  user,
  editedUser,
  isEditing,
  handleEditToggle,
  setEditedUser,
  addOneDay,
}) => {
  return (
    <View>
      {/* Apelido */}
      <Text style={styles.label}>Apelido:</Text>
      <Text style={styles.label}>{user.apelido}</Text>

      {/* Email */}
      <Text style={styles.label}>Email:</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editedUser.email}
          onChangeText={(text) =>
            setEditedUser((prevState: any) => ({
              ...prevState,
              email: text,
            }))
          }
        />
      ) : (
        <Text style={styles.label}>{user.email}</Text>
      )}

      {/* Data de Nascimento */}
      <Text style={styles.label}>Data de Nascimento:</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={addOneDay(editedUser.nascimento)}
        />
      ) : (
        <Text style={styles.label}>{addOneDay(user.nascimento)}</Text>
      )}

      {/* Botão de Editar/Salvar */}
      <TouchableOpacity style={styles.buttonPrimary} onPress={handleEditToggle}>
        <Text style={styles.buttonPrimaryText}>
          {isEditing ? "Salvar" : "Editar Perfil"}
        </Text>
      </TouchableOpacity>

      {/* Botão Cancelar visível apenas se isEditing for true */}
      {isEditing && (
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => {
            setEditedUser(user); // Reverte mudanças
          }}
        >
          <Text style={styles.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserProfileDescription;