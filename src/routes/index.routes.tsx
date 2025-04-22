import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login";
import Cadastro from "../pages/cadastro";
import Home from "../pages/home";
import Agendamento from "../components/Agendamento"
import BottomRoutes from "./bottom.routes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import resetPassword from "../pages/resetPassword";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { supabase } from "../libs/supabase";
import Sigin from "../pages/signin/page";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

function Routes() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { setAuth, setAvatar } = useAuth(); 

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setAuth(session.user); 
        fetchUserAvatar(session.user.id);
        navigation.reset({
          index: 0,
          routes: [{ name: "BottomRoutes" }],
        });
      } else {
        setAuth(null);
        setAvatar(null);
        navigation.reset({
          index: 0,
          routes: [{ name: "signin" }],
        });
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user);
        fetchUserAvatar(session.user.id); 
      } else {
        setAuth(null);
        setAvatar(null); 
        navigation.reset({
          index: 0,
          routes: [{ name: "signin" }],
        });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  
  const fetchUserAvatar = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Erro ao buscar avatar:", error);
    } else {
      setAvatar(data?.avatar_url || null); 
    }
  };

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "#FFF",
        },
      }}
    >
      <Stack.Screen name="signin" component={Sigin} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="resetPassword" component={resetPassword} />
      <Stack.Screen name="Agendamento" component={Agendamento} />
      <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
    </Stack.Navigator>
  );
}
