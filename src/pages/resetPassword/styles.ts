import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";

export const styles = StyleSheet.create({
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
    boxTop:{
        height:Dimensions.get('window').height/3,
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    logo:{
        width:100,
        height:100,
        marginTop:-120
    },
    boxMid:{
        height:Dimensions.get('window').height/4,
        width:'100%',
        paddingHorizontal:37,
        gap:5
    },
        txtPassword:{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#fff',
            marginTop: 16,
            paddingTop:10
        },
        txtDesc:{
            color:'#fff',
            textAlign:'center',
            fontSize:15,
            padding:10
        },
        txtBottom:{
            color: '#ccc',
            textAlign: 'right',
            width: '100%',
            marginTop: 15,
            marginBottom: 16,
            textDecorationLine: 'underline',
            fontSize: 14,
    },
    boxBottom:{
        height:Dimensions.get('window').height/3,
        width:'100%',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingTop:-30,
        marginBottom: 20,
    }

})