import './gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/routes/index.routes';
import { useState } from 'react';



export default function App() {
  return (
    
    <NavigationContainer>
      <Routes />
    </NavigationContainer>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
