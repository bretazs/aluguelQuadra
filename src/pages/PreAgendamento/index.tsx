import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { supabase } from "../../libs/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PreAgendamento() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const { quadra }: any = route.params;
  const [horarios, setHorarios] = useState([]);
  const [modoSelecionado, setModoSelecionado] = useState<"Aulas" | "Aluguel">("Aulas");
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHorarios = async () => {
  try {
    setLoading(true);

    const mapaTipo: Record<"Aulas" | "Aluguel", string> = {
      Aulas: "Aula",
      Aluguel: "Aluguel",
    };
    const tipoBanco = mapaTipo[modoSelecionado];

    console.log("Tipo de agendamento selecionado:", tipoBanco);  
    console.log("Quadra ID:", quadra.id);  

    const { data, error } = await supabase
      .from("horarios")
      .select("*")
      .eq("quadra_id", quadra.id)
      .eq("tipo", tipoBanco)
      .gte("data_disponivel", new Date().toISOString())
      .order("data_disponivel", { ascending: true });

    if (error) throw error;

    console.log("Horários retornados:", data);  
    setHorarios(data ?? []);
  } catch (err) {
    console.error("Erro ao buscar horários", err);
    Alert.alert("Erro ao buscar horários da quadra.");
  } finally {
    setLoading(false);
  }
};

  
  
  

  useEffect(() => {
    if (quadra?.id) {
      fetchHorarios();
    }
  }, [quadra, modoSelecionado]);

  if (!quadra || !quadra.id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1f222a" }}>
        <Text style={{ color: "#FFF" }}>Carregando informações da quadra...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1f222a" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            paddingVertical: 12,
          }}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "bold", fontSize: 16 }}>
            Voltar
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 12 }}>
          <Text style={{
            color: "#FFF",
            fontSize: 22,
            fontWeight: "600",
            marginBottom: 20,
            textAlign: "center",
          }}>
            Arena
          </Text>

          <Text style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#FFF",
            marginBottom: 16,
            textAlign: "center",
          }}>
            {quadra?.nome_quadra}
          </Text>

          {quadra?.image_url ? (
            <Image
              source={{ uri: quadra.image_url }}
              resizeMode="cover"
              style={{
                width: 140,
                height: 140,
                borderRadius: 16,
                marginBottom: 24,
              }}
            />
          ) : (
            <View
              style={{
                width: 140,
                height: 140,
                backgroundColor: "#333",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text style={{ color: "#aaa" }}>Sem Imagem</Text>
            </View>
          )}

          <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
            {["Aulas", "Aluguel"].map((modo) => (
              <TouchableOpacity
                key={modo}
                onPress={() => setModoSelecionado(modo as "Aulas" | "Aluguel")}
                style={{
                  backgroundColor: modoSelecionado === modo ? "#1e88e5" : "#2a2a2a",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  marginHorizontal: 6,
                  borderWidth: 1,
                  borderColor: modoSelecionado === modo ? "#1e88e5" : "#444",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 14 }}>{modo}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Horários */}
          <Text style={{
            color: "#BBB",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 12,
          }}>
            Horários disponíveis
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#1e88e5" />
          ) : !horarios || horarios.length === 0 ? (
            <Text style={{ color: "#777", fontSize: 14, textAlign: "center" }}>
              Nenhum horário disponível.
            </Text>
          ) : (
            <FlatList
            data={horarios}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
            renderItem={({ item }) => {
              const diaSemana = format(new Date(item.data_disponivel), 'EEEE', { locale: ptBR });
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: horarioSelecionado?.id === item.id ? "#4caf50" : "#1e1e1e",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    marginHorizontal: 6,
                    borderWidth: horarioSelecionado?.id === item.id ? 0 : 1,
                    borderColor: "#333",
                  }}
                  onPress={() => setHorarioSelecionado(item)}
                >
                  <Text style={{
                    color: "#FFF",
                    fontSize: 14,
                    fontWeight: "500",
                  }}>
                    {item.horario} {/* Aqui está a correção, substituindo 'horario_disponivel' por 'horario' */}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          
          )}

          {horarioSelecionado && (
            <TouchableOpacity
              disabled={!horarioSelecionado}
              onPress={() => {
                if (!horarioSelecionado) {
                  Alert.alert("Selecione um horário antes de agendar.");
                  return;
                }

                Alert.alert(
                  "Confirmar Agendamento",
                  "Você tem certeza que deseja confirmar este horário?",
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Confirmar",
                      onPress: () => {
                        navigation.navigate("Agendamento", {
                          quadra: quadra,
                          horario: horarioSelecionado,
                          diasSemana: format(new Date(horarioSelecionado.data_disponivel), 'EEEE', { locale: ptBR }),
                        });
                        
                      },
                    },
                  ]
                );
              }}
              style={{
                backgroundColor: horarioSelecionado ? "#1e88e5" : "#444",
                paddingVertical: 14,
                paddingHorizontal: 28,
                borderRadius: 24,
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: horarioSelecionado ? 1 : 0.6,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 8,
              }}
            >
              <FontAwesome5 name="calendar-check" size={24} color="#FFF" style={{ marginRight: 8 }} />
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "bold",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Agendar Horário
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

