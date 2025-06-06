import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getDBConnection,getAllClientes} from '../ModuloDb/MDb.js';



const ClientesDropdown = ({ onChange }) => {

const [clientes, setClientes] = useState([]);
const [selected, setSelected] = useState(null);

const loadClientes = async(cnx)=>{
 const listaClientes= await getAllClientes(cnx)
 
  const dropdownData = listaClientes.map(client => ({
          label:client.Nombre,
          value: client.Id,
          apellido: client.Apellido,
        }));

  setClientes(dropdownData);      
}


//////////////////////////////

useEffect(() => {
    (async () => {
      try {
        const connection = await getDBConnection();
        
       await loadClientes(connection);

        // Controla los errores
      } catch (error) {
        console.error('Error cargando Clientes:', error);
      } 
    })();
  }, []);

/////////////// handleSelect

 const handleSelect = (item) => {
    setSelected(item.value);
    if (onChange) onChange(item); // comunica selección si se necesita
  };

////////////////////////////////
return (

    <View style={styles.container}>
      
        <Dropdown
          style={styles.dropdown}
          data={clientes}
          search
          labelField="label" 
          valueField="value"
          placeholder="-- Elige cliente--"
          renderItem={item => (
            <View style={styles.item}>
              <Text>{item.label}</Text>
              <Text style={styles.apellido}>{item.apellido}</Text>
            </View>
          )}
          value={selected}
          onChange={handleSelect}
        />
    
    </View>
)


}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    padding: 5,
    
  },
 
  dropdown: {
   width: '100%',            // <- esto es lo que garantiza el ancho completo
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    //marginBottom: 16,
    backgroundColor: '#fff',
  },
  
});



export default ClientesDropdown;