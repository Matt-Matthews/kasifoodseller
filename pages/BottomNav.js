import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomeTabBar from '../components/CustomeTabBar';
import Form from './Form';
import Home from './Home';
import Map from './Map';
import Orders from './Orders';
import Search from './Search';
import Settings from './Settings';



const Tab = createBottomTabNavigator();

export default function BottomNav() {
  return (
    <Tab.Navigator 
    
        screenOptions={{
            headerShown: false, 
            }}
        tabBar={(props) => <CustomeTabBar {...props} />}
        sceneContainerStyle={{backgroundColor: '#fff'}}
        >
      <Tab.Screen t name="Home" component={Orders} />
      <Tab.Screen t name="Form" component={Form} />
    </Tab.Navigator>
  );
}
