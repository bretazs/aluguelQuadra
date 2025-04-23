import React, { useState, useContext, useRef, useEffect } from "react";
import { style } from "./styles";
import { Animated, TouchableOpacity } from "react-native";
import { Ball } from "../../components/Ball";
import { Input } from "../../components/Input";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Flag } from "../../components/Flag";
import { themas } from "../../global/themes";
import { AuthContextList } from "../../context/authContext_list";
import {
  Text,
  View,
  StatusBar,
  FlatList,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { formatDateToBR } from "../../global/funtions";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { useCallback } from "react";
import { supabase } from "../../libs/supabase";
import { useAuth } from "../../context/AuthContext";


export default function Home() {
  const { setAuth } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [local, setLocal] = useState("");
  const [quadraSelecionada, setQuadraSelecionada] = useState("");
  const [quadrasCadastradas, setQuadrasCadastradas] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [quadraSelecionadaItem, setQuadraSelecionadaItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [diaSelecionado, setdiaSelecionado] = useState(null);
  const [diasSemana, setDiasDaSemana] = useState([]);
  const [dataFormatada, setdataFormatada] = useState([]);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);

  const fetchQuadras = async () => {
    try {
      const { data, error } = await supabase.from("quadras").select("*");

      if (error) throw error;
      console.log("Dados das quadras:", data);
      setQuadrasCadastradas(data);
    } catch (err) {
      console.error("Erro ao buscar quadras.", err);
    }
  };

  useEffect(() => {
    const hoje = new Date();
    const dias = [];

    for (let i = 0; i < 7; i++) {
      const data = new Date();
      data.setDate(hoje.getDate() + i);

      dias.push({
        diaSemana: data.toLocaleDateString("pt-BR", { weekday: "short" }),
        dataFormatada: data.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        data, 
      });
    }

    setDiasDaSemana(dias);
    setdiaSelecionado(dias[0]);
  }, []);

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
    fetchUserAndAvatar();
    fetchQuadras();

    const authListener = supabase.auth.onAuthStateChange(() => {
      fetchUserAndAvatar();
      fetchQuadras();
    });

    return () => {
      authListener.data?.subscription?.unsubscribe();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const { taskList, handleDelete, handleEdit, filter } =
    useContext<AuthContextType>(AuthContextList);

  const swipeableRefs = useRef([]);

  const renderRightActions = () => (
    <View style={style.Button}>
      <AntDesign name="delete" size={20} color={"#FFF"} />
    </View>
  );

  const renderLeftActions = () => (
    <View style={[style.Button, { backgroundColor: themas.Colors.blueLigth }]}>
      <AntDesign name="edit" size={20} color={"#FFF"} />
    </View>
  );

  const handleSwipeOpen = (direction, item, index) => {
    if (direction === "right") {
      handleDelete(item);
      swipeableRefs.current[index]?.close();
    } else if (direction === "left") {
      handleEdit(item);
      swipeableRefs.current[index]?.close();
    }
  };

  const _renderCard = (item: PropCard, index: number) => {
    const color =
      item.flag === "Day use" ? themas.Colors.blueLigth : themas.Colors.red;
    return (
      <Swipeable
        ref={(ref) => (swipeableRefs.current[index] = ref)}
        key={item.item}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={(direction) => handleSwipeOpen(direction, item, index)}
      >
        <View style={style.card}>
          <View style={style.rowCard}>
            <View style={style.rowCardLeft}>
              <Ball color={color} />
              <View>
                <Text style={style.titleCard}>{item.title}</Text>
                <Text style={style.descriptionCard}>{item.description}</Text>
                <Text style={style.descriptionCard}>
                  até {formatDateToBR(item.timeLimit)}
                </Text>
              </View>
            </View>
            <Flag caption={item.flag} color={color} />
          </View>
        </View>
      </Swipeable>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserAndAvatar();
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={[style.container, { backgroundColor: "#1f222a", flex: 1 }]}>
      <StatusBar barStyle="light-content" />

      {isRefreshing && (
        <Animated.View
          style={{
            alignItems: "center",
            marginVertical: 10,
            opacity,
            paddingVertical: 10,
          }}
        >
          <ActivityIndicator size="small" color={themas.Colors.blueLigth} />
        </Animated.View>
      )}

      <FlatList
        data={taskList}
        keyExtractor={(item, index) => item.item.toString()}
        renderItem={({ item, index }) => _renderCard(item, index)}
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        ListHeaderComponent={
          <>
            <View style={style.header}>
              <Text style={style.greeting}>
                Bom dia, <Text style={{ fontWeight: "bold" }}>{newName}</Text>
              </Text>
              <View style={style.boxInput}>
                <Input
                  IconLeft={MaterialIcons}
                  placeholder="Procure uma arena"
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
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
                paddingBottom: 20,
                textAlign: "center",
                marginHorizontal: "auto",
              }}
            >
              Arenas perto de você
            </Text>

            <FlatList
              data={quadrasCadastradas}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    {
                      backgroundColor:
                        quadraSelecionada === item.id ? "#00b0ff" : "#2a2d38",
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      marginBottom: 14,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    },
                  ]}
                  onPress={() => {
                    setLocal(item.nome_quadra);
                    setQuadraSelecionada(item.id);
                    setQuadraSelecionadaItem(item);
                  }}
                >
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      resizeMode="cover"
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: "#fff",
                        marginRight: 12,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        backgroundColor: "#ccc",
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 12,
                        borderWidth: 2,
                        borderColor: "#fff",
                      }}
                    >
                      <Text
                        style={{
                          color: "#333",
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        Imagem indisponível
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {item.nome_quadra}
                    </Text>

                    <TouchableOpacity
                      onPress={async () => {
                        setLocal(item.nome_quadra);
                        setQuadraSelecionada(item.id);
                        setQuadraSelecionadaItem(item);
                        setModalVisible(true);

                        const { data, error } = await supabase
                          .from("horarios")
                          .select("*")
                          .eq("quadra_id", item.id);

                        if (error) {
                          console.log("Erro ao buscar horarios", error);
                          Alert.alert(
                            "Erro, não foi possível carregar os horários."
                          );
                          return;
                        }
                        setHorarios(data);

                        if (data.length > 0) {
                          setModalVisible(true);
                        } else {
                          Alert.alert(
                            "Sem horários disponíveis",
                            "Essa quadra ainda não tem horários cadastrados."
                          );
                        }
                      }}
                      style={{
                        backgroundColor: "#1f3b51",
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        marginLeft: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        Selecionar
                      </Text>
                    </TouchableOpacity>

                    <Modal
                      animationType="fade"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => {
                        setModalVisible(false);
                        setQuadraSelecionadaItem(null);
                      }}
                    >
                      <Pressable
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setModalVisible(false);
                          setQuadraSelecionadaItem(null);
                        }}
                      >
                        <Pressable
                          style={{
                            backgroundColor: "white",
                            padding: 20,
                            borderRadius: 10,
                            width: 300,
                            alignItems: "center",
                          }}
                          onPress={(e) => e.stopPropagation()}
                        >
                          {quadraSelecionadaItem ? (
                            <>
                              <Text
                                style={{ fontSize: 18, fontWeight: "bold" }}
                              >
                                Arena selecionada:
                              </Text>
                              <Text
                                style={{ marginVertical: 10, fontSize: 18 }}
                              >
                                {local}
                              </Text>

                              {horarios && horarios.length > 0 ? (
                                <>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontWeight: "bold",
                                      marginBottom: 10,
                                      color: "#1f222a",
                                      alignSelf: "flex-start",
                                    }}
                                  >
                                    Selecione uma data:
                                  </Text>

                                  <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginBottom: 10 }}
                                  >
                                    {diasSemana.map((dia, index) => (
                                      <TouchableOpacity
                                        key={index}
                                        onPress={() => setdiaSelecionado(dia)}
                                        style={{
                                          backgroundColor:
                                            diaSelecionado?.dataFormatada ===
                                            dia.dataFormatada
                                              ? "#0fb0ff"
                                              : "#f2f2f2",
                                          paddingVertical: 12,
                                          paddingHorizontal: 16,
                                          marginRight: 8,
                                          borderRadius: 20,
                                          alignItems: "center",
                                          borderWidth: 2,
                                          borderColor:
                                            diaSelecionado?.dataFormatada ===
                                            dia.dataFormatada
                                              ? "#00b0ff"
                                              : "#ddd",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontWeight: "bold",
                                            color:
                                              diaSelecionado?.dataFormatada ===
                                              dia.dataFormatada
                                                ? "#fff"
                                                : "#333",
                                            fontSize: 12,
                                          }}
                                        >
                                          {dia.diaSemana.toUpperCase()}
                                        </Text>
                                        <Text
                                          style={{
                                            color:
                                              diaSelecionado?.dataFormatada ===
                                              dia.dataFormatada
                                                ? "#fff"
                                                : "#333",
                                          }}
                                        >
                                          {dia.dataFormatada.split("/")[0]}
                                        </Text>
                                      </TouchableOpacity>
                                    ))}
                                  </ScrollView>

                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontWeight: "bold",
                                      marginBottom: 10,
                                      color: "#1f222a",
                                      alignSelf: "flex-start",
                                    }}
                                  >
                                    Selecione um horário:
                                  </Text>

                                  <View
                                    style={{
                                      flexDirection: "row",
                                      flexWrap: "wrap",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <ScrollView
                                      horizontal
                                      showsHorizontalScrollIndicator={false}
                                      style={{ marginBottom: 2 }}
                                    >
                                      {horarios.map((horario) => (
                                        <TouchableOpacity
                                          key={horario.id}
                                          style={{
                                            backgroundColor: "#1f3b51",
                                            
                                            paddingVertical: 14,
                                            paddingHorizontal: 8,
                                            borderRadius: 30,
                                            marginHorizontal: 6,
                                            alignItems: "center",
                                          }}
                                          onPress={() => {
                                            setHorarioSelecionado(horario);
                                            setAgendamentoConfirmado(false);
                                          }}
                                        >
                                          {!agendamentoConfirmado && (
                                            <Text
                                              style={{
                                                color: "#fff",
                                                fontWeight: "bold",
                                                fontSize: 14,
                                              }}
                                            >
                                              {horario.horario}
                                            </Text>
                                          )}

                                          {diaSelecionado &&
                                            horarioSelecionado &&
                                            !agendamentoConfirmado && (
                                              <TouchableOpacity
                                                onPress={() =>
                                                  setAgendamentoConfirmado(true)
                                                }
                                               
                                              >
                                                
                                              </TouchableOpacity>
                                            )}

                                          {agendamentoConfirmado && (
                                            <View
                                              style={{
                                                marginTop: 20,
                                                alignItems: "center",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  color: "#00b0ff",
                                                  fontWeight: "bold",
                                                  fontSize: 16,
                                                }}
                                              >
                                                Agendamento Salvo!
                                              </Text>
                                              <Text
                                                style={{
                                                  textAlign: "center",
                                                  color: "#fff",
                                                  marginTop: 4,
                                                  fontSize: 8,
                                                }}
                                              >
                                                Seu agendamento foi salvo com
                                                sucesso.
                                              </Text>
                                            </View>
                                          )}
                                          
                                        </TouchableOpacity>
                                      ))}
                                    </ScrollView>
                                  </View>
                                </>
                              ) : (
                                <Text style={{ marginVertical: 10 }}>
                                  Nenhum horário disponível.
                                </Text>
                              )}

                              {quadraSelecionadaItem.aula && (
                                <View style={{ marginVertical: 10 }}>
                                  <Text style={{ fontWeight: "bold" }}>
                                    Aula:
                                  </Text>
                                  <Text>{quadraSelecionadaItem.aula}</Text>
                                </View>
                              )}

                              {quadraSelecionadaItem.horario_disponivel && (
                                <View style={{ marginVertical: 10 }}></View>
                              )}

                              {typeof quadraSelecionadaItem.max_pessoas ===
                                "number" &&
                                typeof quadraSelecionadaItem.pessoas_agendadas ===
                                  "number" && (
                                  <View style={{ marginVertical: 10 }}>
                                    <Text style={{ fontWeight: "bold" }}>
                                      Capacidade:
                                    </Text>
                                    <Text style={{ textAlign: "center" }}>
                                      {quadraSelecionadaItem.pessoas_agendadas}{" "}
                                      / {quadraSelecionadaItem.max_pessoas}
                                    </Text>
                                  </View>
                                )}

                              <TouchableOpacity
                                onPress={() => {
                                  setModalVisible(false);
                                  setQuadraSelecionadaItem(null);
                                }}
                                style={{
                                  backgroundColor: "#00b0ff",
                                  paddingVertical: 6,
                                  paddingHorizontal: 12,
                                  borderRadius: 10,
                                  marginTop: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: 12,
                                  }}
                                >
                                  Fechar
                                </Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <ActivityIndicator size="small" color="#00b0ff" />
                          )}
                        </Pressable>
                      </Pressable>
                    </Modal>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        }
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />
    </View>
  );
}
