import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  boxInput: {
    width: "100%",
    height: 56,
    backgroundColor: "#1f222a",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
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
    paddingBottom: 2, 
    paddingTop: 0,
  },
  
  
  titleInput: {
    marginLeft: 5,
    color: themas.Colors.gray,
    marginTop: 20,
    alignItems: "center",
  },
  Button: {
    width: "10%",
  },
  Icon: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "73%",
  },
});
