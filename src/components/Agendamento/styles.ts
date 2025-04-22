// styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

const { height, width } = Dimensions.get("window");

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f222a", 
    alignItems: 'center',
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
    fontWeight: 'bold',
  },

  boxInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    paddingHorizontal: 3,
    marginTop: 10,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 45,
    backgroundColor: "#e0e0e0",
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  cardDate: {
    fontSize: 14,
    color: '#8eaede',
    marginBottom: 4,
  },

  cardStatus: {
    fontSize: 14,
    color: '#cccccc',
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
  addButton: {
    backgroundColor: themas.Colors.blueLigth,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#2c2f38",
    color: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    marginTop: 10,
    fontSize: 16,
  },
  dateText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#333842",
    borderRadius: 8,
    textAlign: "center",
  },
});
