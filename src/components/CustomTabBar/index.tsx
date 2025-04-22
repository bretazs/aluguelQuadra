import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import {
  Ionicons,
  FontAwesome,
  Entypo,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { style } from "./styles";
import { themas } from "../../global/themes";
import { AuthContextList } from "../../context/authContext_list";

export default ({ state, navigation }) => {
  const { onOpen } = useContext<any>(AuthContextList);

  const go = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={style.TabArea}>
      <TouchableOpacity style={style.TabItem} onPress={() => go("Home")}>
        <Entypo
          name="home"
          style={{
            opacity: state.index === 0 ? 1 : 0.5,
            color: "#3e838c",
            fontSize: 32,
          }}
        />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.TabItem }  onPress={() => go("Agendamento")}>
        <FontAwesome
          name="calendar"
          style={{
            opacity: state.index === 0 ? 1 : 0.5,
            color: "#3e838c",
            fontSize: 32,
            fontWeight: "black",
          }}
        />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Agenda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.TabItem} onPress={() => go("User")}>
        <FontAwesome
          name="user-circle-o"
          style={{
            opacity: state.index === 1 ? 1 : 0.9,
            color: "#3e838c",
            fontSize: 32,
          }}
        />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};
