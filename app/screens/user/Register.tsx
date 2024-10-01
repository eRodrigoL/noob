import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "@styles/Default";
import { router } from "expo-router";

const Register: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Botão Retornar */}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>↩</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Crie sua conta:</Text>

      {/* Campo para Nome */}
      <TextInput style={styles.input} placeholder="Nome" />

      {/* Campo para Apelido */}
      <TextInput style={styles.input} placeholder="Apelido" />

      {/* Campo para Data de Nascimento */}
      <TextInput style={styles.input} placeholder="Data nascimento" />

      {/* Campo para Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />

      {/* Campo para Senha */}
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />

      {/* Campo para Confirmar Senha */}
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
      />

      {/* Botão para Cadastrar */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>CADASTRAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
