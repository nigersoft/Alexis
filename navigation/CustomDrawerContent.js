// navigation/CustomDrawerContent.js
import React, { useState } from 'react';
import { BackHandler } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { ListItem } from 'react-native-elements';
import { Icon } from 'react-native-elements';

export default function CustomDrawerContent(props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <DrawerContentScrollView {...props}>
      {/* Menu1 */}
      <ListItem onPress={() => props.navigation.navigate('Cotizaciones')} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Cotizaciones</ListItem.Title>
        </ListItem.Content>
      </ListItem>

      {/* Menu2 */}
      <ListItem onPress={() => props.navigation.navigate('Menu2')} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Menu2</ListItem.Title>
        </ListItem.Content>
      </ListItem>

      {/* Menu3 con submenús */}
      <ListItem.Accordion
        containerStyle={{ backgroundColor: '#f8f8f8' }}
        content={
          <ListItem.Content>
            <ListItem.Title>Configuraciones</ListItem.Title>
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}
      >
        <ListItem onPress={() => props.navigation.navigate('ListaClientes')} bottomDivider>
          <ListItem.Content style={{ paddingLeft: 20 }}>
            <ListItem.Title>Clientes</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem onPress={() => props.navigation.navigate('Materiales')} bottomDivider>
          <ListItem.Content style={{ paddingLeft: 20 }}>
            <ListItem.Title>Materiales</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem onPress={() => props.navigation.navigate('Submenu3.3')} bottomDivider>
          <ListItem.Content style={{ paddingLeft: 20 }}>
            <ListItem.Title>Submenu3.3</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </ListItem.Accordion>

      {/* Ítem para salir de la app */}
      <ListItem
        containerStyle={{ marginTop: 20, borderTopWidth: 1, borderColor: '#eee' }}
        onPress={() => BackHandler.exitApp()}
        bottomDivider
      >
        {/* Aquí el Icon de React Native Elements */}

        <Icon
          name="exit-to-app" // Nombre del icono (puedes probar otros como 'logout', 'sign-out')
          type="material-community" // Familia de iconos (puedes usar 'font-awesome', 'ionicon', etc.)
          size={30}
          color="red" // Cambia el color a tu gusto
        />
        
        <ListItem.Content>
          <ListItem.Title style={{ color: 'red' }}>
            Salir
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

    </DrawerContentScrollView>
  );
}
