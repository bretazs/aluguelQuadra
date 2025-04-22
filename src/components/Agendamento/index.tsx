import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Animated,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { style } from "./styles";
import { themas } from "../../global/themes";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "../Input";
import CustomDateTimePicker from '../CustomDateTimePicker';  

export default function Agenda() {
  const { setAuth } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [opacity] = useState(new Animated.Value(0));
  const [local, setLocal] = useState("");
  const [status, setStatus] = useState("Confirmado");
  const [ sucessMessage, setsucessMessage] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  
  const addAgendamento = async (userId, local, data, status) => {
    try {
      
      const formattedDate = format(new Date(data), "yyyy-MM-dd");  
  
      const { data: newAgendamento, error } = await supabase
        .from("agendamentos")
        .insert([
          {
            user_id: userId,
            local: local,
            data: formattedDate,  
            status: status,
          },
        ]);
  
      if (error) throw error;
  
      setsucessMessage("Agendamento feito com sucesso!")

      setTimeout(()=>setsucessMessage(""), 4000)
    } catch (err) {
      console.error("Erro ao adicionar agendamento:", err);
    }
  };
  
  // Função para buscar usuário e dados
  const fetchUserAndData = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session?.user) return;

      const currentUser = session.user;
      setUser(currentUser);

      const { data: userData } = await supabase
        .from("users")
        .select("avatar_url")
        .eq("id", currentUser.id)
        .single();

      setPhotoUri(userData?.avatar_url || null);

      const { data: agendamentosData, error } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("data", { ascending: true });

      if (!error) {
        setAgendamentos(agendamentosData);
        setFiltered(agendamentosData);
      }

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }).start();
      }, 9000);
    }
  };

  useEffect(() => {
    fetchUserAndData();
  }, []);

  // Função de filtro
  const filter = (text: string) => {
    const term = text.toLowerCase();
    const results = agendamentos.filter((item) =>
      item.local.toLowerCase().includes(term)
    );
    setFiltered(results);
  };

  // Função para renderizar cada agendamento
  const renderAgendamento = ({ item }: any) => {
    return (
      <View style={style.card}>
        <Text style={style.cardTitle}>{item.local}</Text>
        <Text style={style.cardDate}>
          {format(new Date(item.data), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </Text>
        <Text style={style.cardStatus}>Status: {item.status}</Text>
      </View>
    );
  };

  return (
    <View style={[style.container, { backgroundColor: "#1f222a" }]}>
      {loading && (
        <Animated.View style={{ alignItems: "center", marginVertical: 10, opacity }}>
          <ActivityIndicator size="small" color={themas.Colors.blueLigth} />
        </Animated.View>
      )}

      <View style={style.header}>
        <Text style={style.greeting}>Agendamentos</Text>
        <View style={style.boxInput}>
          <Input
            IconLeft={MaterialIcons}
            placeholder="Filtrar por arena"
            placeholderTextColor="#757575"
            iconLeftName="search"
            onChangeText={(t) => filter(t)}
          />
          
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              style={style.profileImage}
            />
          )}
        </View>
      </View>

      
      <View style={style.formContainer}>
        <TextInput
          style={style.input}
          placeholder="Nome da Arena"
          placeholderTextColor="#757575"
          value={local}
          onChangeText={(text) => setLocal(text)}
        />
        
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={style.input}>
            {format(selectedDateTime, "dd/MM/yyyy")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text style={style.input}>
            {format(selectedDateTime, "HH:mm")}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={style.input}
          placeholder="Status"
          placeholderTextColor="#757575"
          value={status}
          onChangeText={(text) => setStatus(text)}
        />

        <TouchableOpacity
          style={style.addButton}
          onPress={() => {
            const userId = user?.id;
            addAgendamento(userId, local, selectedDateTime, status);
          }}
        >
          <Text style={style.addButtonText}>Adicionar Agendamento</Text>
        </TouchableOpacity>
      </View>
      {sucessMessage !== "" && (
  <Text style={{ color: "green", textAlign: "center", marginTop: 10 }}>
    {sucessMessage}
  </Text>
)}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderAgendamento}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
            !sucessMessage && (
              <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
                Nenhum agendamento encontrado.
              </Text>
            )
          }
      />

      
      <CustomDateTimePicker
        type="date"
        show={showDatePicker}
        setShow={setShowDatePicker}
        onDateChange={(date) => setSelectedDateTime(date)}
        
      />
      
    
      <CustomDateTimePicker
        type="time"
        show={showTimePicker}
        setShow={setShowTimePicker}
        onDateChange={(date) => setSelectedDateTime(date)}
      />
    </View>
  );
}
