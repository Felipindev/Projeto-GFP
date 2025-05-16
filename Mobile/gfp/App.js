import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./src/pages/Login";
import MenuDrawer from "./src/pages/MenuDrawer";
import Cadastro from "./src/pages/Cadastro";

const stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <stack.Screen name="Cadastro" component={Cadastro} options={{headerShown: false}} />
        <stack.Screen name="MenuDrawer" component={MenuDrawer} options={{headerShown: false}} />
      </stack.Navigator>
    </NavigationContainer>
  )
}