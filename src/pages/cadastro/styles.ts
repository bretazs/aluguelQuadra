
import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      backgroundColor:'#181a20'
      
    },
    boxTop: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logo: {
      width: 160,
      height: 80,
    },
    text: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#fff',
      marginTop: 16,
    },
    boxMid: {
      gap: 5,
      marginBottom: 32,
    },
    boxBottom: {
      marginBottom: 16,
      width:'100%',
      alignItems:'center',
      justifyContent:'flex-start',
    },
    textBottom: {
      textAlign: 'center',
      color: '#666',
      fontSize: 18,
      marginTop: 20,
      
      
    },
    textBottomCreate: {
      color: '#007bff',
      fontWeight: 'bold',
      fontSize:16,
    },
  });