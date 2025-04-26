import { StyleSheet } from "react-native";
import { themas } from "../../global/themes"; // Certifique-se de ter os temas definidos

export const style = StyleSheet.create({
  // Estilos gerais
  container: {
    flex: 1,
    backgroundColor: "#1f222a",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  boxInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },

  // Estilos da lista
  card: {
    backgroundColor: "#2b2f38",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  cardDate: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
  cardStatus: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 5,
  },

  // Estilos do formulário
  formContainer: {
    backgroundColor: "#2b2f38",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  input: {
    backgroundColor: "#333",
    color: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: themas.Colors.blueLigth,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Sucess Message
  successMessage: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#2b2f38",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: "#DDD",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#1e88e5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 15,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  // Input do filtro de pesquisa
  boxInputSearch: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputSearch: {
    flex: 1,
    backgroundColor: "#333",
    color: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    fontSize: 16,
  },
});
