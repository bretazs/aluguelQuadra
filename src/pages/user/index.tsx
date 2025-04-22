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
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from 'expo-font';

import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { decode as atob } from "base-64";

export default function PerfilScreen() {
  const { setAuth } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const [user, setUser] = useState<any>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserAndAvatar = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;

        if (!session?.user) {
          setUser(null);
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);
        setNewName(currentUser.user_metadata?.name || "");

        const { data: userData, error } = await supabase
          .from("users")
          .select("avatar_url")
          .eq("id", currentUser.id)
          .single();

        if (!error && userData?.avatar_url) {
          setPhotoUri(userData.avatar_url);
        } else {
          setPhotoUri(null);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndAvatar();

    const authListener = supabase.auth.onAuthStateChange(() => {
      fetchUserAndAvatar();
    });

    return () => {
      authListener.data?.subscription?.unsubscribe();
    };
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permissão negada", "Precisamos do acesso às fotos.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
      allowsEditing: true, // <-- Adicione esta linha
  aspect: [1, 1], 
    });

    if (!result.canceled && user?.id) {
      const uri = result.assets[0].uri;
      const extension = uri.split(".").pop() || "jpg";
      const fileName = `avatar-${user.id}.${extension}`;
      const pathInBucket = `files/${fileName}`;
      const mimeType = `image/${extension}`;

      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const binaryString = atob(base64);
        const fileBuffer = Uint8Array.from(binaryString, (char: string) =>
          char.charCodeAt(0)
        );

        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(pathInBucket, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError) {
          return Alert.alert("Erro", "Erro ao enviar imagem.");
        }

        const { data: urlData } = supabase
          .storage
          .from("files")
          .getPublicUrl(pathInBucket);

        const publicUrl = `${urlData.publicUrl}?ts=${Date.now()}`;
        setPhotoUri(publicUrl);

        const { error: updateError } = await supabase
          .from("users")
          .update({ avatar_url: publicUrl })
          .eq("id", user.id);

        if (updateError) {
          return Alert.alert("Erro", "Erro ao atualizar imagem.");
        }

        Alert.alert("Sucesso", "Imagem atualizada!");
      } catch (err) {
        Alert.alert("Erro", "Erro ao processar imagem.");
      }
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permissão negada", "Precisamos de acesso à câmera.");
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: false,
      aspect: [1, 1], 

    });

    if (!result.canceled && user?.id) {
      const uri = result.assets[0].uri;
      const extension = uri.split(".").pop() || "jpg";
      const fileName = `avatar-${user.id}.${extension}`;
      const pathInBucket = `files/${fileName}`;
      const mimeType = `image/${extension}`;

      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const binaryString = atob(base64);
        const fileBuffer = Uint8Array.from(binaryString, (char: string) =>
          char.charCodeAt(0)
        );

        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(pathInBucket, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError) {
          return Alert.alert("Erro", "Erro ao enviar imagem.");
        }

        const { data: urlData } = supabase
          .storage
          .from("files")
          .getPublicUrl(pathInBucket);

        const publicUrl = `${urlData.publicUrl}?ts=${Date.now()}`;
        setPhotoUri(publicUrl);

        const { error: updateError } = await supabase
          .from("users")
          .update({ avatar_url: publicUrl })
          .eq("id", user.id);

        if (updateError) {
          return Alert.alert("Erro", "Erro ao atualizar imagem.");
        }

        Alert.alert("Sucesso", "Imagem atualizada!");
      } catch (err) {
        Alert.alert("Erro", "Erro ao processar imagem.");
      }
    }
  };

  const handleSaveName = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { name: newName },
    });

    if (error) {
      Alert.alert("Erro", "Não foi possível atualizar o nome");
    } else {
      setModalVisible(false);
      Alert.alert("Sucesso", "Nome atualizado com sucesso!");
    }
  };

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user?.email);
    if (error) {
      Alert.alert("Erro", "Erro ao enviar e-mail.");
    } else {
      Alert.alert("Verifique seu e-mail", "Link de redefinição enviado.");
    }
  };

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();
    setAuth(null);
    if (error) {
      Alert.alert("Erro", "Erro ao sair da conta.");
    }
    navigation.navigate("signin");
  };

  const creationDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "N/A";

  if (loading) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: "center" }]} >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Usuário não encontrado.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1f222a" }}>
      <Text style={styles.txtPerfil}>Configuração</Text>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.filesContainer}
          onPress={() => {
            Alert.alert(
              "Escolha uma opção",
              "Selecione de onde você quer pegar a foto",
              [
                { text: "Selecionar Fotos...", onPress: pickImage },
                { text: "Tirar Foto", onPress: takePhoto },
                { text: "Cancelar", style: "cancel" },
              ],
              { cancelable: true }
            );
          }}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.files} />
          ) : (
            <Ionicons name="person-circle" size={120} color="#ccc" />
          )}
        </TouchableOpacity>
  
        <View style={styles.cardInfo}>
          <Text style={styles.name}>
            {user.user_metadata?.name || "Nome não definido"}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.id}>ID: {user.id}</Text>
  
          <View style={styles.infoBox}>
            <Ionicons name="calendar" size={20} color="#ccc" />
            <Text style={styles.infoText}>Conta criada em: {creationDate}</Text>
          </View>
        </View>
  
        <Text style={styles.sectionTitle}>Ações</Text>
  
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="edit-2" size={18} color="#fff" />
          <Text style={styles.buttonText}>Editar Nome</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <MaterialIcons name="lock-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Trocar Senha</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignout}>
          <Ionicons name="exit-outline" color="gray" size={24} />
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
}  

const styles = StyleSheet.create({
  txtPerfil: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 80,
    paddingBottom: 20,
    textAlign: 'left',
    marginLeft:20
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  filesContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop:20
  },
  files: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#00d4ff",
  },
  name: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20,
    textAlign: "center",
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
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 8,
    color: "#ccc",
    fontSize: 14,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#31343d",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 12,
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    left:130,
    marginTop: 40,
    backgroundColor: "#292c35",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 10,
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
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    color: "#fff",
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
  },
  cardInfo: {
    backgroundColor: "#2a2d36",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  id: {
    fontSize: 12,
    color: "#777",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionTitle: {
    color: "#ccc",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },

});

