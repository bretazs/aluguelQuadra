import React from "react";
import { ActivityIndicator, View } from 'react-native';
import { style } from "./styles";

type Props = {
    loading: boolean;
};

export function Loading({ loading }: Props) {
    if (!loading) return null; 

    return (
        <View style={style.container}>
            <ActivityIndicator color={'white'} size={24} />
        </View>
    );
}
