import React, { useEffect, useState } from 'react';
import {
    View,
    Modal,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const CustomDateTimePicker = ({ type, onDateChange, show, setShow }) => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        if (onDateChange) {
            onDateChange(date);
        }
    }, [date, onDateChange]);
    const onChange = (event, selectedDate) => {
        if (event?.type === 'dismissed') {
            setShow(false);
            return;
        }
    
        const now = new Date();
        const currentDate = selectedDate || date;
    
        if (type === 'date') {
            const selectedDay = new Date(currentDate);
            selectedDay.setHours(0, 0, 0, 0);
    
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            if (selectedDay < today) {
                Alert.alert("Data inválida", "Você não pode escolher uma data no passado.");
            } else {
                const newDate = new Date(date);
                newDate.setFullYear(selectedDay.getFullYear());
                newDate.setMonth(selectedDay.getMonth());
                newDate.setDate(selectedDay.getDate());
    
                setDate(newDate);
                setShow(false);
            }
            return;
        }
    
        if (type === 'time') {
            // Combina a data já escolhida com o horário selecionado
            const selectedTime = new Date(currentDate);
            selectedTime.setFullYear(date.getFullYear());
            selectedTime.setMonth(date.getMonth());
            selectedTime.setDate(date.getDate());
    
            // Se a data for no futuro, o horário é sempre válido
            if (selectedTime > now) {
                Alert.alert("Sucesso", "Horário marcado com sucesso.");
                setDate(selectedTime);
                setShow(false);
            } else if (selectedTime.toDateString() === now.toDateString() && selectedTime <= now) {
                // Se a data for hoje e o horário já passou
                Alert.alert("Horário inválido", "Você não pode escolher um horário que já passou.");
            } else {
                // Caso contrário, horário válido
                Alert.alert("Sucesso", "Horário marcado com sucesso.");
                setDate(selectedTime);
                setShow(false);
            }
            return;
        }
    };
    
    
    const closeModal = () => setShow(false);

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={show}
            onRequestClose={closeModal}
        >
            <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={type}
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChange}
                                minimumDate={type === 'date' ? new Date() : undefined}
                                textColor={Platform.OS === 'ios' ? '#8eaede' : undefined}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: '86%',
        height:40,
        padding: 20,
        backgroundColor: 'black',
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    dateText: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
    },
});

export default CustomDateTimePicker;
