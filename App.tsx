import './gesture-handler';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/index.routes';
import { useState, useEffect } from 'react';
import { Loading } from './src/components/Loading';
export default function App() {
  const [isLoadingLoggedUser, setIsLoadingLoggedUser] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    setTimeout(() => {
      
      setIsLoadingLoggedUser(false);
      setUser(null); 
    },);
  }, []);
  const linking = {
    prefixes: ['https://reset-password-app-quadra.netlify.app'],
    config: {
      screens: {
        resetPassword: 'reset-password',
      },
    },
  };
  
  return (
    <View style={{ flex: 1 }}>
      {isLoadingLoggedUser ? (
        <Loading loading={isLoadingLoggedUser} />
      ) : (
        <NavigationContainer linking={linking}> 
          <Routes />
        </NavigationContainer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
