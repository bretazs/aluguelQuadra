import React, { useState,useEffect } from "react";
import Logo from "../../assets/logo.png";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Text, View, Image, Alert, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Keyboard } from "react-native";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { supabase } from "../../libs/supabase";
import * as SecureStore from 'expo-secure-store';
import { themas } from "../../global/themes";
import { Dimensions } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



export default function Login() {
  
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState("pgbretas@gmail.com");
  const [password, setPassword] = useState("Pedroca12@");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSingIn() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }
    console.log("Usuário logado:", data.user); 
  
    setLoading(false);
  
    navigation.reset({
      index: 0,
      routes: [{ name: "BottomRoutes" }],
    });
  }
  const checkToken = async () => {
    const token = await SecureStore.getItemAsync('supabase.auth.token');
    console.log('Token armazenado:', token); // Verifique se o token está armazenado corretamente
  };
  
  useEffect(() => {
    checkToken();
  }, []);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#000028' }}
      contentContainerStyle={style.container}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
    >
      <View style={style.boxTop}>
        <Image source={Logo} style={style.logo} resizeMode="contain" />
        <Text style={style.text}>Bem-vindo de volta!</Text>
      </View>
  
      <View style={style.boxMid}>
        <Input
          style={style.txtEmail}
          title="ENDEREÇO E-MAIL"
          value={email}
          onChangeText={setEmail}
          IconRigth={MaterialIcons}
          iconRightName="email"
          multiline={false}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
  
        <Input
          style={style.txtSenha}
          title="SENHA"
          value={password}
          onChangeText={setPassword}
          IconRigth={Octicons}
          iconRightName={showPassword ? "eye" : "eye-closed"}
          onIconRigthPress={() => setShowPassword(!showPassword)}
          secureTextEntry={!showPassword}
          multiline={false}
        />
  
        <Text
          style={style.forgotPasswordText}
          onPress={() =>
            navigation.reset({ routes: [{ name: "resetPassword" }] })
          }
        >
          Esqueceu a senha?
        </Text>
      </View>
  
      <View style={style.boxBottom}>
        <Button text="ENTRAR" loading={loading} onPress={handleSingIn} />
      </View>
  
      <Text style={style.textBottom}>
        Não tem conta?{" "}
        <Text
          style={style.textBottomCreate}
          onPress={() => navigation.reset({ routes: [{ name: "Cadastro" }] })}
        >
          Crie agora
        </Text>
      </Text>
    </KeyboardAwareScrollView>
  );
  
}
export const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#000028'
    },
    txtEmail:{
        flex: 1,
        height: "100%",
        width: "100%",
        borderRadius: 40,
        paddingVertical: 0,
        textAlignVertical: "center", 
        textAlign: 'left', 
        color: "#757575",
        fontSize: 18,
        marginTop: -2,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 0, 
        paddingTop: 0,
    },

    txtSenha:{
        flex: 1,
        height: "100%",
        width: "100%",
        borderRadius: 40,
        paddingVertical: 0,
        textAlignVertical: "center", 
        textAlign: 'left', 
        color: "#757575",
        fontSize: 18,
        marginTop: 2,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 0, 
        paddingTop: 0, 
    },
    boxTop:{
        height:Dimensions.get('window').height/3,
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    boxMid:{
        height:Dimensions.get('window').height/4,
        width:'100%',
        paddingHorizontal:37,
        gap:5,   
    },
    boxBottom:{
        height:Dimensions.get('window').height/3,
        width:'100%',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingTop:40,
        
        
        
    },
    boxInput:{
        width:'100%',
        height:40,
        borderWidth:1,
        borderRadius:40,
        borderColor:themas.Colors.lightGray,
        backgroundColor:themas.Colors.bgScreen,
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:30,
        justifyContent:'center'
    },
    logo:{
        width:80,
        height:80,
        marginTop:40
    },
    text:{
        marginTop:35,
        fontSize:18,
        fontWeight:'bold',
        color: '#fff',
    },
    input:{

        height:'100%',
        width:'100%',
        borderRadius:40,
        

    },
    boxIcon:{
        width:50,
        height:50,
        backgroundColor:'red',
        alignItems:'center',
        justifyContent:'center'
    },
    titleInput:{
        marginLeft:5,
        color:themas.Colors.gray,
        marginTop:20,
        alignItems:'center',
        justifyContent:'center'
    },
    textBottom:{
        fontSize: 18,
        color: themas.Colors.gray,
        marginTop: -20,
        textAlign: 'center',
    },
    textBottomCreate:{
        fontSize:16,
        color: '#007bff',
        fontWeight: 'bold',
    },
    forgotPasswordText: {
        color: '#ccc',
        textAlign: 'right',
        width: '100%',
        marginTop: 5,
        marginBottom: 16,
        textDecorationLine: 'underline',
        fontSize: 14,
      },
      
})
