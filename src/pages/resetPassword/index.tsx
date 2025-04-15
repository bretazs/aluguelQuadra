import React, { useState } from "react";
import { styles } from "./styles";
import redefinirsenha from "../../assets/redefinirsenha.png";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Text, View, Image, Alert } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail, getAuth } from "firebase/auth";

export default function ResetPassword() {
    const navigation = useNavigation<NavigationProp<any>>();
    const [email, setEmail] = useState("pgbretas@gmail.com");
    const [loading, setLoading] = useState(false);
    const [showRecoverPasswordMessage, setShowRecoverPasswordMessage] = useState(false);
    const [error, setError] = useState(null);
  
    async function getResetPassword() {
      if (!email) {
        return Alert.alert("Atenção", "Informe os campos obrigatórios!");
      }
      setLoading(true); 
      setError(null); 
  
      try {
        const auth = getAuth();
  
       
        await sendPasswordResetEmail(auth, email);
        Alert.alert("Email de redefinição enviado para:", email);
  
       
        setShowRecoverPasswordMessage(true);
        navigation.reset({ routes: [{ name: "Login" }] });
  
      } catch (error: any) {
        console.log("Erro ao tentar enviar o email de redefinição:", error);
  
        setError(error);
  
        let errorMsg = "Erro ao tentar enviar o email de redefinição.";
        if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
          errorMsg = "Insira um e-mail válido";
        }
  
        Alert.alert("Atenção", errorMsg);
      } finally {
        setLoading(false); 
      }
    }

  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image
          source={redefinirsenha}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.txtPassword}>Redefina sua senha</Text>
        <Text style={styles.txtDesc}>
          Informe o seu email de cadastro para que possamos enviar o link de
          redefinição de senha.
        </Text>

        <View style={styles.boxMid}>
        <Input
  title="ENDEREÇO E-MAIL"
  value={email}
  onChangeText={setEmail}
  IconRigth={MaterialIcons}
  iconRightName="email"
  multiline={false}
  returnKeyType="done"
  onSubmitEditing={Keyboard.dismiss}
/>

          <Text
            style={styles.txtBottom}
            onPress={() => navigation.navigate("Login")}
          >
            Voltar ao login
          </Text>
          <View style={styles.boxBottom}>
            <Button
              text="Enviar link de recuperação"
              loading={loading}
              onPress={getResetPassword}
            />
          </View>
        </View>
      </View>

      {showRecoverPasswordMessage && (
        <Text>
          Verifique seu e-mail para redefinir a senha.
        </Text>
      )}
    </View>
  );
}
