import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";


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