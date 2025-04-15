import React, { useState } from "react";
import { style } from "./styles";
import Logo from '../../assets/logo.png';
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Text, View, Image, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail,  } from "firebase/auth";
import { auth } from "../../services/fiireBaseConfig"; 


export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('pgbretas@gmail.com');
  const [password, setPassword] = useState('Bretas13');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getLogin() {
    if (!email || !password) {
      return Alert.alert('Atenção', 'Informe os campos obrigatórios!');
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Usuário logado:', user.email);

      navigation.reset({ routes: [{ name: 'BottomRoutes' }] });
    } catch (error: any) {
      console.log(error);
      let errorMsg = 'E-mail ou senha inválidos.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMsg = 'E-mail ou senha inválidos.';
      }
      Alert.alert('Erro', errorMsg);
    } finally {
      setLoading(false);
    }
  } 
  
  
  return (
    <View style={style.container}>
      <View style={style.boxTop}>
        <Image
          source={Logo}
          style={style.logo}
          resizeMode="contain"
        />
        <Text style={style.text}>Bem-vindo de volta!</Text>
      </View>

      <View style={style.boxMid}>
        <Input
          title="ENDEREÇO E-MAIL"
          value={email}
          onChangeText={setEmail}
          IconRigth={MaterialIcons}
          iconRightName="email"
        />
        <Input
          title="SENHA"
          value={password}
          onChangeText={setPassword}
          IconRigth={Octicons}
          iconRightName={showPassword ? "eye-closed" : "eye"}
          onIconRigthPress={() => setShowPassword(!showPassword)}
          secureTextEntry={!showPassword}
          multiline={false}
        />

         <Text
          style={style.forgotPasswordText}
          onPress={()=>navigation.reset({ routes:[{name: 'resetPassword'}]})}
        >
          Esqueceu a senha?
        </Text>  
      </View>

      <View style={style.boxBottom}>
        <Button text="ENTRAR" loading={loading} onPress={getLogin} />
      </View>

      <Text style={style.textBottom}>
        Não tem conta?{" "}
        <Text
          style={style.textBottomCreate}
          onPress={() => navigation.reset({ routes: [{ name: 'Cadastro' }] })}
        >
          Crie agora
        </Text>
      </Text>
    </View>
  );
}
