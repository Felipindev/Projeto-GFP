import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./src/pages/Login";
import MenuDrawer from "./src/pages/MenuDrawer";
import Cadastro from "./src/pages/Cadastro";
import CadContas from "./src/pages/CadContas";

const stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <stack.Navigator
         screenOptions={{
                contentStyle: {
                    backgroundColor: '#008080',
                },
                headerStyle: {
                    backgroundColor: '#008080',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                    borderBottomColor: 'transparent',
                },
                headerTintColor: '#f8f8f8',
            }}
      >
        <stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <stack.Screen name="Cadastro" component={Cadastro} options={{headerShown: false}} />
        <stack.Screen name="MenuDrawer" component={MenuDrawer} options={{headerShown: false}} />
        <stack.Screen name="CadContas" component={CadContas}
          options={{title: 'Cadastro de Contas'}}
        />
      </stack.Navigator>
    </NavigationContainer>
  )
}