import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { auth } from "../../services/fiireBaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { updateProfile, User } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";


const PerfilScreen = () => {

    const handleResetPassword = async () => {
        try {
          await sendPasswordResetEmail(auth, user.email!);
          Alert.alert("Email enviado", "Verifique sua caixa de entrada para redefinir sua senha.");
        } catch (error) {
          console.log("Erro ao enviar email:", error);
          Alert.alert("Erro", "Não foi possível enviar o email de redefinição.");
        }
      };
      
  const navigation = useNavigation<NavigationProp<any>>();
  const user = auth.currentUser as User;

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user.displayName || "");

  const storageKey = `@user_photo_${user.uid}`;

  useEffect(() => {
    const loadPhoto = async () => {
      const uri = await AsyncStorage.getItem(storageKey);
      if (uri) setPhotoUri(uri);
    };
    loadPhoto();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "Precisamos do acesso às fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await AsyncStorage.setItem(storageKey, uri);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  };

  const handleSaveName = async () => {
    try {
      await updateProfile(user, { displayName: newName });
      setModalVisible(false);
    } catch (error) {
      console.log("Erro ao atualizar nome:", error);
    }
  };

  const creationDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "N/A";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1f222a" }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={120} color="#ccc" />
          )}
          <Text style={styles.txtImg}>Toque para mudar a foto</Text>
        </TouchableOpacity>

        <Text style={styles.name}>{user.displayName || "Nome não definido"}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="calendar" size={20} color="#ccc" />
          <Text style={styles.infoText}>Conta criada em: {creationDate}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Feather name="edit-2" size={18} color="#fff" />
          <Text style={styles.buttonText}>Editar Nome</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
  <MaterialIcons name="lock-outline" size={20} color="#fff" />
  <Text style={styles.buttonText}>Trocar Senha</Text>
</TouchableOpacity>


        <View style={styles.section}>
          <View style={styles.configItem}>
          </View>
          <View style={styles.configItem}>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="exit-outline" color="gray" size={28} />
          <Text style={{ color: "gray", fontSize: 16 }}>Sair</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Editar Nome</Text>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Digite seu nome"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.button} onPress={handleSaveName}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: "#ccc" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default PerfilScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 15,
  },
  txtImg: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    color: "#ccc",
    fontSize: 14,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c2f36",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    gap: 8,
  },
  section: {
    width: "100%",
    marginTop: 30,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  configItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  configText: {
    color: "#ccc",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#2c2f36",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#fff",
    marginBottom: 20,
    paddingVertical: 5,
  },
});
