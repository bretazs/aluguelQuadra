import React, { useEffect, useState } from "react";
import {
  View, Text, ActivityIndicator, Alert,
  TouchableOpacity, Image,
} from "react-native";
import {
  useNavigation, useRoute, RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../@types/navigation"; 

type AgendaRouteProp = RouteProp<RootStackParamList, "Agenda">;

export default function Agenda() {
  const { user } = useAuth();
  const route = useRoute<AgendaRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { quadra, horario } = route.params;

  const [detalhesQuadra, setDetalhesQuadra] = useState<any>(null);
  const [detalhesHorario, setDetalhesHorario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleConfirmarAgendamento = async () => {
    try {
      const nomeUsuario = user?.user_metadata?.name;
  
      const { error } = await supabase.from("agendamentos").insert([{
        user_id: user.id,
        nome_usuario: nomeUsuario,
        quadra_id: quadra.id,
        horario_id: horario.id,
        data: horario.data_disponivel,
        tipo: horario.tipo,
        status: "Confirmado", 
      }]);
  
      if (error) {
        Alert.alert("Erro", "Não foi possível agendar. Tente novamente.");
        return;
      }
  
   
      const { error: updateError } = await supabase
        .from("agendamentos")
        .update({ status: "Confirmado" }) 
        .eq("user_id", user.id) 
        .eq("quadra_id", quadra.id) 
        .eq("horario_id", horario.id); 
  
      if (updateError) {
        Alert.alert("Erro", "Não foi possível atualizar o status. Tente novamente.");
        return;
      }
  
      Alert.alert("Sucesso", "Agendamento confirmado com sucesso!");
      navigation.navigate("Agenda", {
        quadra,
        horario,
      });
      
    } catch (err) {
      console.log("Erro ao confirmar agendamento!", err);
      Alert.alert("Erro", "Algo deu errado. Tente novamente!");
    }
  };
  

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [{ data: quadraData }, { data: horarioData }] = await Promise.all([
          supabase.from("quadras").select("*").eq("id", quadra.id).single(),
          supabase.from("horarios").select("*").eq("id", horario.id).single(),
        ]);

        setDetalhesQuadra(quadraData);
        setDetalhesHorario(horarioData);
      } catch {
        Alert.alert("Erro", "Erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1f222a" }}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  const diaSemana = format(new Date(horario.data_disponivel), "EEEE", { locale: ptBR });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1f222a", padding: 20 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8 }}>Voltar</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "bold", marginBottom: 12 }}>
        Detalhes do Agendamento
      </Text>

      {quadra?.image_url && (
        <Image
          source={{ uri: quadra.image_url }}
          style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 16, alignSelf: "center" }}
          resizeMode="cover"
        />
      )}

      <Text style={{ color: "#BBB" }}>
        <Text style={{ fontWeight: "bold" }}>Arena: </Text>{quadra?.nome_quadra}
      </Text>

      <Text style={{ color: "#BBB" }}>
        <Text style={{ fontWeight: "bold" }}>Data: </Text>{format(new Date(horario.data_disponivel), "dd/MM/yyyy", { locale: ptBR })}
      </Text>

      <Text style={{ color: "#BBB" }}>
        <Text style={{ fontWeight: "bold" }}>Horário: </Text>{horario?.horario}
      </Text>

      <Text style={{ color: "#BBB" }}>
        <Text style={{ fontWeight: "bold" }}>Tipo: </Text>{horario?.tipo}
      </Text>

      <Text style={{ color: "#BBB" }}>
        <Text style={{ fontWeight: "bold" }}>Dia da Semana: </Text>{diaSemana}
      </Text>

      <TouchableOpacity onPress={handleConfirmarAgendamento} style={{
        backgroundColor: "#4caf50", paddingVertical: 14, borderRadius: 24, marginTop: 20, alignItems: "center",
      }}>
        <Text style={{ color: "#FFF", fontWeight: "bold" }}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
