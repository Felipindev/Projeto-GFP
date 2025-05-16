import { createDrawerNavigator } from "@react-navigation/drawer";
import Principal from "./Principal";
import Contas from "./Contas";

const Drawer = createDrawerNavigator();

export default function MenuDrawer(){
    return(
        <Drawer.Navigator 
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
            <Drawer.Screen name="PRINCIPAL" component={Principal} />
            <Drawer.Screen name="CONTAS" component={Contas} />
        </Drawer.Navigator>
    )
}
