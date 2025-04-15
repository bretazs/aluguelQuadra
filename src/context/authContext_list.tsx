import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { themas } from "../global/themes";
import { Flag } from "../components/Flag";
import { Input } from "../components/Input";
import { Modalize } from "react-native-modalize";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Loading } from "../components/Loading";

type AuthContextProps = {
  onOpen: () => void;
  taskList: PropCard[];
  handleEdit: (item: PropCard) => void;
  handleDelete: (item: PropCard) => void;
  taskListBackup: PropCard[];
  filter: (text: string) => void;
  username: string;
  setUsername: (name: string) => void;
};
export const AuthContextList: any = createContext({});

const flags = [
  { caption: "Mensalista", color: themas.Colors.red },
  { caption: "Day use", color: themas.Colors.blueLigth },
];

export const AuthProviderList = (props) => {
  const modalizeRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("Mensalista");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [taskListBackup, setTaskListBackup] = useState([]);
  const [item, setItem] = useState(0);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  useEffect(() => {
    get_taskList();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (date) => {
    setSelectedTime(date);
  };
  const handleSave = async () => {
    const newItem = {
      item: item !== 0 ? item : Date.now(),
      title,
      description,
      flag: selectedFlag,
      timeLimit: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      ).toISOString(),
    };
    onClose();

    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem("taskList");
      let taskList = storedData ? JSON.parse(storedData) : [];

      const itemIndex = taskList.findIndex(
        (task) => task.item === newItem.item
      );

      if (itemIndex >= 0) {
        taskList[itemIndex] = newItem;
      } else {
        taskList.push(newItem);
      }

      await AsyncStorage.setItem("taskList", JSON.stringify(taskList));
      setTaskList(taskList);
      setTaskListBackup(taskList);
      setData();
    } catch (error) {
      console.error("Erro ao salvar o item:", error);
      onOpen();
    } finally {
      setLoading(false);
    }
  };

  const filter = (t: string) => {
    if (taskList.length == 0) return;
    const array = taskListBackup;
    const campos = ["title", "description"];
    if (t) {
      const searchTerm = t.trim().toLowerCase();

      const filteredArr = array.filter((item) => {
        for (let i = 0; i < campos.length; i++) {
          if (item[campos[i].trim()].trim().toLowerCase().includes(searchTerm))
            return true;
        }
      });

      setTaskList(filteredArr);
    } else {
      setTaskList(array);
    }
  };

  const handleEdit = async (itemToEdit: PropCard) => {
    setTitle(itemToEdit.title);
    setDescription(itemToEdit.description);
    setSelectedFlag(itemToEdit.flag);
    setItem(itemToEdit.item);

    const timeLimit = new Date(itemToEdit.timeLimit);
    setSelectedDate(timeLimit);
    setSelectedTime(timeLimit);

    onOpen();
  };

  const handleDelete = async (itemToDelete) => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem("taskList");
      const taskList = storedData ? JSON.parse(storedData) : [];

      const updatedTaskList = taskList.filter(
        (item) => item.item !== itemToDelete.item
      );

      await AsyncStorage.setItem("taskList", JSON.stringify(updatedTaskList));
      setTaskList(updatedTaskList);
      setTaskListBackup(updatedTaskList);
    } catch (error) {
      console.error("Erro ao excluir o item:", error);
    } finally {
      setLoading(false);
    }
  };

  async function get_taskList() {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem("taskList");
      const taskList = storedData ? JSON.parse(storedData) : [];
      setTaskList(taskList);
      setTaskListBackup(taskList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const _renderFlags = () => {
    return flags.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setSelectedFlag(item.caption);
        }}
      >
        <Flag
          caption={item.caption}
          color={item.color}
          selected={item.caption == selectedFlag}
        />
      </TouchableOpacity>
    ));
  };

  const setData = () => {
    setTitle("");
    setDescription("");
    setSelectedFlag("Mensalita");
    setItem(0);
    setSelectedDate(new Date());
    setSelectedTime(new Date());
  };

  const _container = () => {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => onClose()}>
              <MaterialIcons name="close" size={30} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {item != 0 ? "Editar tarefa" : "Criar tarefa"}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <AntDesign name="check" size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Input 
              title="Título:"
              labelStyle={styles.label}
              value={title}
              onChangeText={setTitle}
            />
            <Input
              title="Descrição:"
              numberOfLines={5}
              height={100}
              multiline
              labelStyle={styles.label}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
            <View style={{ width: "100%", flexDirection: "row", gap: 10 }}>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                style={{ width: 120 , zIndex: 999 }}
              >
                <Input 
                  title="Data:"
                  labelStyle={styles.label}
                  editable={false}
                  value={selectedDate.toLocaleDateString()}
                  onPress={() => setShowDatePicker(true)}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={{ width: 100 }}
              >
                <Input
                  title="Horário:"
                  labelStyle={styles.label}
                  editable={false}
                  value={selectedTime.toLocaleTimeString()}
                  onPress={() => setShowTimePicker(true)}
                />
              </TouchableOpacity>
            </View>

            <CustomDateTimePicker
              type="date"
              onDateChange={handleDateChange}
              show={showDatePicker}
              setShow={setShowDatePicker}
            />
            <CustomDateTimePicker
              type="time"
              onDateChange={handleTimeChange}
              show={showTimePicker}
              setShow={setShowTimePicker}
            />

            <View style={styles.containerFlag}>
              <Text style={styles.flag}>Flags:</Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                {_renderFlags()}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <AuthContextList.Provider
      value={{
        onOpen,
        taskList,
        handleEdit,
        handleDelete,
        taskListBackup,
        filter,
        username,
        setUsername,
      }}
    >
      <Loading loading={loading} />
      {props.children}
      <Modalize
        ref={modalizeRef}
        childrenStyle={{ height: 600 }}
        adjustToContentHeight={true}
      >
        {_container()}
      </Modalize>
    </AuthContextList.Provider>
  );
};

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    width: "100%",
    height: 40,
    paddingHorizontal: 40,
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    width: "100%",
    paddingHorizontal: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#000",
    alignItems:'center'
    
  },
  containerFlag: {
    width: "100%",
    padding: 10,
  },
  flag: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inputColor:{
    backgroundColor:'black',
   
  }
});

export const useAuth = () => useContext(AuthContextList);
