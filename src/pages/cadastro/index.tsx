import React, { useState, useCallback } from 'react';
import { View, Text, Alert, Image, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import Logo from '../../assets/logo.png';
import { styles } from "./styles";
import { supabase } from "../../libs/supabase";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Cadastro() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      Keyboard.dismiss();
    }, [])
  );
  function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  async function handleSignUp() {
    if (!isValidEmail(email)) {
      Alert.alert('E-mail inválido', 'Por favor, insira um e-mail válido.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) {
      Alert.alert('Erro ao criar conta', error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigation.navigate('BottomRoutes');
  }

  return (
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: '#000028', }}
        contentContainerStyle={styles.container}
        enableOnAndroid
        extraScrollHeight={50}
        keyboardShouldPersistTaps="handled"
      >
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
            iconRightName={showPassword ? "eye" : "eye-closed"}
            onIconRigthPress={() => setShowPassword(!showPassword)}
            secureTextEntry={!showPassword}
          />
          <Input
            title="CONFIRME SUA SENHA"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            IconRigth={Octicons}
            iconRightName={showConfirmPassword ? "eye-closed" : "eye"}
            onIconRigthPress={() => setShowConfirmPassword(!showConfirmPassword)}
            secureTextEntry={!showConfirmPassword}
          />
        </View>

        <View style={styles.boxBottom}>
          <Button text="CADASTRAR" loading={loading} onPress={handleSignUp} />
        </View>

        <Text style={styles.textBottom}>
          Já tem conta?{' '}
          <Text
            style={styles.textBottomCreate}
            onPress={() => navigation.navigate('signin')}
          >
            Entrar
          </Text>
        </Text>
      </KeyboardAwareScrollView>

  );
}
