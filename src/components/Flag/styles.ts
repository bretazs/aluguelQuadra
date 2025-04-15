import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";


export const style = StyleSheet.create({
    container:{
        width:90,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:themas.Colors.red,
        borderRadius:4
    },
    caption:{
        color:'#FFF'
    }
})