import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";


export const style = StyleSheet.create({
    boxInput:{
        width: "100%",
        height: 56,
        backgroundColor: "#1f222a",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 10,
        paddingBottom:-50
    },
    input:{
        height:'100%',
        width:'100%',
        borderRadius:40,
        color:'#757575'
        
  
    },
    titleInput:{
        marginLeft:5,
        color:themas.Colors.gray,
        marginTop:20
    },
    Button:{
        width:'10%',
    },
    Icon:{
        width:'100%',
    }
    
})