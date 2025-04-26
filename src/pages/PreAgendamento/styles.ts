import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes"

const { height, width } = Dimensions.get("window");
export const style = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#1f222a",
    },
})