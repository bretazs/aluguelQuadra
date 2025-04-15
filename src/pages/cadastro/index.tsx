import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import Logo from '../../assets/logo.png';
import { styles } from "./styles";
import { auth } from '../../services/fiireBaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';


export default function Cadastro() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  async function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      return Alert.alert('Atenção', 'Preencha todos os campos!');
    }

    if (!isValidEmail(email)) {
      return Alert.alert('Erro', 'Digite um e-mail válido.');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Atenção', 'As senhas não coincidem.');
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    
      console.log('Usuário cadastrado:', user.email); 
    
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'BottomRoutes' }]
        })
      );
    } catch (error: any) {
      console.log('Erro ao cadastrar:', error);
      Alert.alert('Erro', error.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.text}>Crie sua conta</Text>
      </View>

      <View style={styles.boxMid}>
        <Input
          title="NOME DE USUÁRIO"
          value={name}
          onChangeText={setName}
          IconRigth={MaterialIcons}
          iconRightName="person"
        />
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
        <Input
          title="CONFIRME SUA SENHA"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          IconRigth={Octicons}
          iconRightName={showConfirmPassword ? "eye-closed" : "eye"}
          onIconRigthPress={() => setShowConfirmPassword(!showConfirmPassword)}
          secureTextEntry={!showConfirmPassword}
          multiline={false}
        />
      </View>

      <View style={styles.boxBottom}>
        <Button text="CADASTRAR" loading={loading} onPress={handleRegister} />
      </View>

      <Text style={styles.textBottom}>
        Já tem conta?{' '}
        <Text
          style={styles.textBottomCreate}
          onPress={() => navigation.navigate('Login')}
        >
          Entrar
        </Text>
      </Text>
    </View>
  );
}
