import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ptBR } from "date-fns/locale";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../@types/navigation";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function MeusAgendamentos() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);


  const fetchAgendamentos = async () => {
    try {
      const { data, error } = await supabase
        .from("agendamentos")
        .select(
          `*, quadras (id, nome_quadra, image_url), horarios (id, horario, tipo, data_disponivel)`
        )
        .eq("user_id", user.id)
        .order("data", { ascending: true });

      if (error) throw error;

      setAgendamentos(data || []);
    } catch (err) {
      console.error("Erro ao buscar agendamentos", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAgendamentos();
    }, [])
  );
  


  const desmarcarAgendamento = async () => {
    if (!agendamentoSelecionado) return;

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", agendamentoSelecionado.id);

    if (error) {
      Alert.alert("Erro", "Não foi possível cancelar.");
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setAgendamentos((prev) =>
        prev.filter((a) => a.id !== agendamentoSelecionado.id)
      );
      setModalVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1f222a" }}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1f222a", padding: 20 }}>
      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "bold", marginBottom: 16 }}>
        Meus Agendamentos
      </Text>

      {agendamentos.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <MaterialIcons name="event-busy" size={50} color="#BBB" />
          <Text style={{ color: "#BBB", textAlign: "center", marginTop: 20 }}>
            Você ainda não tem agendamentos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#2c2f38",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("Agenda", {
                  quadra: item.quadras,
                  horario: item.horarios
                })}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>
                  {item.quadras?.nome_quadra}
                </Text>
                <Text style={{ color: "#BBB" }}>
                  {format(new Date(item.horarios?.data_disponivel), "dd/MM/yyyy", { locale: ptBR })} às {item.horarios?.horario}
                </Text>
                <Text style={{ color: "#BBB" }}>
                  Tipo: {item.horarios?.tipo}
                </Text>
                <Text style={{ color: "#4caf50", marginTop: 4 }}>
                  Status: {item.status}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setAgendamentoSelecionado(item);
                  setModalVisible(true);
                }}
                style={{
                  backgroundColor: "#e53935",
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 24,
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>
                  Desmarcar Horário
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Modal de Confirmação de Cancelamento */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#FFF", padding: 24, borderRadius: 12, width: "80%" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Desmarcar agendamento?</Text>
            <Text style={{ fontSize: 14, marginBottom: 24 }}>
              Você tem certeza que deseja desmarcar este horário?
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 10 }}
              >
                <Text style={{ color: "#1e88e5" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={desmarcarAgendamento}
                style={{ padding: 10 }}
              >
                <Text style={{ color: "#e53935", fontWeight: "bold" }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
