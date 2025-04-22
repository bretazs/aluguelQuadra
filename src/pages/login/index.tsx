
import { Text, View, Image, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {} from "../../global/themes"

export default function Login() {
  
 

  return (
    <View style={style.container}>
      <ActivityIndicator size={44} color={'blue'}/>
    </View>
    
  );
}
export const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000028',
        alignItems:'center',
        justifyContent:'center',
    }
})
