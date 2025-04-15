import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";


export const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        // justifyContent:'center'
        
    },
    header:{
        width:'100%',
        paddingTop:25,
        height:Dimensions.get('window').height/6,
        backgroundColor:'#181a20',
        // alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:20,
        
        
    },
    greeting:{
        fontSize:20,
        color:'#FFF',
        marginTop:20,
        paddingBottom:9
    },
    boxInput:{
        width:'80%',
        color:'#FFF',
        
        
    },
    boxList:{
        flex:1,
        width:'100%',
        backgroundColor:'#1f222a',
        
        
    },
    
    card:{
        width:'100%',
        minHeight:60,
        backgroundColor:'#FFF',
        marginTop:6,
        borderRadius:10,
        justifyContent:'center',
        padding:10,
        borderWidth:1,
        borderColor:'themas.Colors.lightGray'
    },
    rowCard:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    titleCard:{
        fontSize:16,
        fontWeight:'bold',
        
    },
    descriptionCard:{
        color:themas.Colors.gray
    },
    rowCardLeft:{
        width:'70%',
        flexDirection:'row',
        gap:10,
        alignItems:'center'
    },
    Button: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        marginVertical: 10,
        borderRadius: 10,
    },
    ButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    
})