import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";

const { height, width } = Dimensions.get("window");
export const style = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: "#1f222a",

    },
    header: {
      width: '100%',
      paddingTop: 60,
      height: height / 5,
      backgroundColor: '#000028',
      justifyContent: 'flex-start',
      paddingHorizontal: 20,
    },
    greeting: {
      fontSize: 20,
      color: '#FFF',
      marginTop: 10,
      paddingBottom: 9,
    },
    boxInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '80%',
      paddingHorizontal: 3,
      marginTop: 10,
    },
    boxList: {
      flex: 1,
      width: '100%',
      backgroundColor: '#1f222a',
    },
    card: {
      width: '100%',
      minHeight: 60,
      backgroundColor: '#FFF',
      marginTop: 6,
      borderRadius: 10,
      justifyContent: 'center',
      padding: 10,
      borderWidth: 1,
      borderColor: themas.Colors.lightGray,
    },
    rowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleCard: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    descriptionCard: {
      color: themas.Colors.gray,
    },
    rowCardLeft: {
      width: '70%',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
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
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 45,
        backgroundColor: "#e0e0e0",
        
    },
    // txtProximas:{
    //   color:'#fff',
    //   paddingBottom:400,
    //   alignItems:'center',
    //   fontSize:17,
    //   fontWeight: 'bold'
    // }
  });
  