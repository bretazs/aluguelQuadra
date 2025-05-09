import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/home';
import User from '../pages/user';
import Agendamento from '../components/Agendamento'
import PreAgendamento from '../pages/PreAgendamento';
import Agenda from "../pages/Agenda"
import CustomTabBar from '../components/CustomTabBar';
import { AuthProviderList } from '../context/authContext_list';

const Tab = createBottomTabNavigator();

export default function BottomRoutes() {
  return (
    <AuthProviderList>
      <Tab.Navigator
        id={undefined}
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >  
        <Tab.Screen 
          name="Home" 
          component={Home} 
        />
        <Tab.Screen 
          name="User"
          component={User} 
        />
        <Tab.Screen 
          name="Agenda"
          component={Agenda} 
        />
        <Tab.Screen 
          name="Agendamento"
          component={Agendamento} 
        />
        <Tab.Screen 
          name="PreAgendamento"
          component={PreAgendamento} 
        />
      </Tab.Navigator>
    </AuthProviderList>
  );
}
