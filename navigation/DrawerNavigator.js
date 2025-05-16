// navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import Menu1Screen from '../screens/Menu1Screen';
import Menu2Screen from '../screens/Menu2Screen';
import ListaClientes from '../screens/ListaClientes';
import MaterialesScreen from '../screens/MaterialesScreen';
import Submenu33Screen from '../screens/Submenu33Screen';
import NuevoClienteScreen from '../screens/NuevoClienteScreen';
import EditarClienteScreen from '../screens/EditarClienteScreen';
import EditarVidrioScrm from '../screens/EditarVidrioScreen';
import NuevoVidrio from '../screens/NuevoVidrio';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Menu1" component={Menu1Screen} />
      <Drawer.Screen name="Menu2" component={Menu2Screen} />
      {/* Se registran las pantallas asociadas a los submenús de Menu3 */}
      <Drawer.Screen name="ListaClientes" component={ListaClientes} />
      <Drawer.Screen name="Materiales" component={MaterialesScreen} />
      <Drawer.Screen name="Submenu3.3" component={Submenu33Screen} />
      <Drawer.Screen name="NuevoCliente" component={NuevoClienteScreen} />
      <Drawer.Screen name="EditarCliente" component={EditarClienteScreen}  options={{ unmountOnBlur: true }} />
      <Drawer.Screen name="NuevoVidrio" component={NuevoVidrio} />
      <Drawer.Screen name="EditarVidrio" component={EditarVidrioScrm} />
    </Drawer.Navigator>
  );
}
