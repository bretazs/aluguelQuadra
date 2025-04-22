import React, { useState, useContext, useRef, useEffect } from "react";
import { style } from "./styles";
import { Animated } from "react-native";
import { Ball } from "../../components/Ball";
import { Input } from "../../components/Input";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Flag } from "../../components/Flag";
import { themas } from "../../global/themes";
import { AuthContextList } from "../../context/authContext_list";
import {
  Text,
  View,
  StatusBar,
  FlatList,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { formatDateToBR } from "../../global/funtions";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { useCallback } from "react";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../context/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Home() {
  const { setAuth } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  const fetchUserAndAvatar = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session?.user) {
        setUser(null);
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);
      setNewName(currentUser.user_metadata?.name || "");

      const { data: userData, error } = await supabase
        .from("users")
        .select("avatar_url")
        .eq("id", currentUser.id)
        .single();

      if (!error && userData?.avatar_url) {
        setPhotoUri(userData.avatar_url);
      } else {
        setPhotoUri(null);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);

      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }).start();
      }, 9000);
    }
  };

  useEffect(() => {
    fetchUserAndAvatar();

    const authListener = supabase.auth.onAuthStateChange(() => {
      fetchUserAndAvatar();
    });

    return () => {
      authListener.data?.subscription?.unsubscribe();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const { taskList, handleDelete, handleEdit, filter } =
    useContext<AuthContextType>(AuthContextList);

  const swipeableRefs = useRef([]);

  const renderRightActions = () => (
    <View style={style.Button}>
      <AntDesign name="delete" size={20} color={"#FFF"} />
    </View>
  );

  const renderLeftActions = () => (
    <View style={[style.Button, { backgroundColor: themas.Colors.blueLigth }]}>
      <AntDesign name="edit" size={20} color={"#FFF"} />
    </View>
  );

  const handleSwipeOpen = (direction, item, index) => {
    if (direction === "right") {
      handleDelete(item);
      swipeableRefs.current[index]?.close();
    } else if (direction === "left") {
      handleEdit(item);
      swipeableRefs.current[index]?.close();
    }
  };

  const _renderCard = (item: PropCard, index: number) => {
    const color =
      item.flag === "Day use" ? themas.Colors.blueLigth : themas.Colors.red;
    return (
      <Swipeable
        ref={(ref) => (swipeableRefs.current[index] = ref)}
        key={item.item}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={(direction) => handleSwipeOpen(direction, item, index)}
      >
        <View style={style.card}>
          <View style={style.rowCard}>
            <View style={style.rowCardLeft}>
              <Ball color={color} />
              <View>
                <Text style={style.titleCard}>{item.title}</Text>
                <Text style={style.descriptionCard}>{item.description}</Text>
                <Text style={style.descriptionCard}>
                  até {formatDateToBR(item.timeLimit)}
                </Text>
              </View>
            </View>
            <Flag caption={item.flag} color={color} />
          </View>
        </View>
      </Swipeable>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserAndAvatar();
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={[style.container, { backgroundColor: "#1f222a" }]}>
      <StatusBar barStyle="light-content" />

      {isRefreshing && (
        <Animated.View
          style={{
            alignItems: "center",
            marginVertical: 10,
            opacity,
            paddingVertical: 10,
          }}
        >
          <ActivityIndicator size="small" color={themas.Colors.blueLigth} />
        </Animated.View>
      )}

      <FlatList
        data={taskList}
        keyExtractor={(item, index) => item.item.toString()}
        renderItem={({ item, index }) => _renderCard(item, index)}
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          paddingBottom: -2,
          backgroundColor: "#000028",
        }}
        ListHeaderComponent={() => (
          <View style={style.header}>
            <Text style={style.greeting}>
              Bom dia , <Text style={{ fontWeight: "bold" }}>{newName}</Text>
            </Text>
            <View style={style.boxInput}>
              <Input
                IconLeft={MaterialIcons}
                placeholder="Procure uma arena"
                placeholderTextColor="#757575"
                iconLeftName="search"
                onChangeText={(t) => filter(t)}
              />
              {photoUri && (
                <Image
                  source={{ uri: photoUri }}
                  style={style.profileImage}
                />
              )}
            </View>
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />
    </View>
  );
}
