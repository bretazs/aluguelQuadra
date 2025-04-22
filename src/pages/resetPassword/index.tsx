import React, { useState, useEffect } from "react";
import { styles } from "./styles";
import redefinirsenha from "../../assets/redefinirsenha.png";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Text, View, Image, Alert, Keyboard } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../context/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Linking from 'expo-linking';

export default function ResetPassword() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("pgbretas@gmail.com");
  const [loading, setLoading] = useState(false);
  const [showRecoverPasswordMessage, setShowRecoverPasswordMessage] = useState(false);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState(""); // Para capturar a nova senha
  const [confirmPassword, setConfirmPassword] = useState(""); // Para capturar a confirmação de senha
  const [isTokenValid, setIsTokenValid] = useState(false); // Para verificar se o token é válido
  const [code, setCode] = useState(""); // Para capturar o código na URL
  
  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      let url = event.url;
  
      // Troca # por ? para poder usar URLSearchParams
      if (url.includes('#')) {
        url = url.replace('#', '?');
      }
  
      const queryParams = new URLSearchParams(url.split('?')[1]);
  
      const accessToken = queryParams.get('access_token');
      const refreshToken = queryParams.get('refresh_token');
      const type = queryParams.get('type');
  
      if (type === 'recovery' && accessToken && refreshToken) {
        // Restaura a sessão com os tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
  
        if (error) {
          console.error("Erro ao restaurar sessão:", error);
          Alert.alert("Erro", "Não foi possível validar o link de redefinição.");
        } else {
          console.log("Sessão restaurada com sucesso!");
          setIsTokenValid(true);
        }
      } else {
       console.log("Link inválido");
      }
    };
  
    const getUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log("URL inicial:", initialUrl);
        handleUrl({ url: initialUrl });
      }
    };
  
    getUrl();
  
    const subscription = Linking.addEventListener('url', handleUrl);
    return () => {
      subscription.remove();
    };
  }, []);
  

  const handleResetPassword = async () => {
    if (!isTokenValid) {
      Alert.alert("Erro", "O token de redefinição de senha é inválido.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      setLoading(false);

      if (error) {
        Alert.alert("Erro", "Erro ao redefinir senha. Tente novamente.");
      } else {
        Alert.alert("Sucesso", "Senha redefinida com sucesso!");
        setNewPassword("");
        setConfirmPassword("");
        navigation.navigate("signin");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Erro", error.message || "Erro desconhecido ao redefinir a senha.");
    }
  };

  const handleEmailResetPassword = async () => {
    setLoading(true);
    setError(null);
  
    const trimmedEmail = email.trim().toLowerCase();
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setLoading(false);
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }
  
    const { data: exists, error: existsError } = await supabase.rpc("check_user_email_exists", {
      email_input: trimmedEmail,
    });
  
    if (existsError) {
      setLoading(false);
      Alert.alert("Erro", "Erro ao verificar e-mail.");
      return;
    }
  
    if (!exists) {
      setLoading(false);
      Alert.alert("Erro", "E-mail não cadastrado.");
      return;
    }
  
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: "https://reset-password-app-quadra.netlify.app/", // 🔧 Corrigido para apontar para a tela correta de redefinição
      });
  
      if (resetError) {
        console.error("Erro ao enviar e-mail:", resetError);
        Alert.alert("Erro", resetError.message || "Erro ao enviar e-mail de redefinição.");
      } else {
        setShowRecoverPasswordMessage(true);
        Alert.alert("Sucesso", "Verifique seu e-mail para redefinir sua senha.");
        navigation.navigate("signin");
      }
    } catch (error: any) {
      console.error("Erro inesperado:", error);
      Alert.alert("Erro", error.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#000028" }}
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}
      enableOnAndroid
      enableAutomaticScroll={false}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
    >
      <View style={styles.boxTop}>
        <Image source={redefinirsenha} style={styles.logo} resizeMode="contain" />
        <Text style={styles.txtPassword}>Redefina sua senha</Text>
        <Text style={styles.txtDesc}>
          Informe o seu email de cadastro para que possamos enviar o link de redefinição de senha.
        </Text>

        <View style={styles.boxMid}>
          {isTokenValid ? (
            <>
              <Input
                style={styles.txtEmail}
                title="Nova Senha"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <Input
                style={styles.txtEmail}
                title="Confirmar Nova Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <View style={styles.boxBottom}>
                <Button
                  text="Redefinir Senha"
                  loading={loading}
                  onPress={handleResetPassword}
                />
              </View>
            </>
          ) : (
            <>
              <Input
                style={styles.txtEmail}
                title="ENDEREÇO E-MAIL"
                value={email}
                onChangeText={setEmail}
                IconRigth={MaterialIcons}
                iconRightName="email"
                multiline={false}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <Text style={styles.txtBottom} onPress={() => navigation.navigate("signin")}>
                Voltar ao login
              </Text>

              <View style={styles.boxBottom}>
                <Button
                  text="Enviar link de recuperação"
                  loading={loading}
                  onPress={handleEmailResetPassword}
                />
              </View>
            </>
          )}
        </View>

        {showRecoverPasswordMessage && (
          <Text style={{ color: "#fff", marginTop: 20 }}>
            Verifique seu e-mail para redefinir a senha.
          </Text>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
