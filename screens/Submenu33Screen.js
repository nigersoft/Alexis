// screens/Submenu33Screen.js
import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { getDBConnection,ACTUALIZAR_DB,EXPORTAR_DB} from '../ModuloDb/MDb.js';
import { Button} from 'react-native-elements';


export default function Submenu33Screen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
                   title="Exportar DB"
                   buttonStyle={styles.updateButton}
                   onPress={EXPORTAR_DB}
                 />  


                 <Button
                   title="Importar DB"
                   buttonStyle={styles.Button}
                   onPress={ACTUALIZAR_DB}
                 />  

    </View>
  );
}


const styles = StyleSheet.create({
  
  checkboxContainer: {
   display:'flex',
   
    flexDirection: 'row',
    alignItems: 'right',
    
    //backgroundColor: 'green',
    //marginLeft:3,
    padding: 16,
    
  },

   container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding:16,
  },
  
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  Button: {
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: '#2089dc',
    margin:10,
    padding:10
  },

  


  

});
