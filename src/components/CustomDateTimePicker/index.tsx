import React, { useEffect } from 'react';
import { View, Modal, Platform, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { style } from './styles';  

const CustomDateTimePicker = ({ type, onDateChange, show, setShow }) => {
    const [date, setDate] = React.useState(new Date());

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
                return;
            }
        }

        if (type === 'time') {
            const selectedTime = new Date(currentDate);

            const isSameDay = date.toDateString() === now.toDateString();

            if (isSameDay && selectedTime < now) {
                Alert.alert("Horário inválido", "Você não pode escolher um horário que já passou.");
                return;
            }
        }

        setDate(currentDate);  
        setShow(false); 
    };

    const closeModal = () => {
        setShow(false); 
    };

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
                                style={{ borderRadius: 10 }} 
                                testID="dateTimePicker"
                                value={date}
                                mode={type}  
                                is24Hour={true}  
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                                onChange={onChange}  
                                minimumDate={type === 'date' ? new Date() : undefined}
                                textColor={Platform.OS === 'ios' ? '#4a8fb8' : undefined}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    },
    container: {
        width: '80%',  
        alignItems:'center',
        backgroundColor: 'black',
        padding: 20,
        fontFamily:'bold',
        fontSize:16,
        borderRadius: 10,  
    },
});

export default CustomDateTimePicker;
