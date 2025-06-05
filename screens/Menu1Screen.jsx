import React, { useState,useEffect } from 'react';
import { View, StyleSheet, TextInput,ScrollView,Alert} from 'react-native';

import { Text, Checkbox } from 'react-native-paper';
import { Button , Divider} from 'react-native-elements';
import ClientesDropdown from '../components/ClientesDropdown';
import VidriosDropdown from '../components/VidriosDropdown';
import { getDBConnection} from '../ModuloDb/MDb.js';

import { suma} from '../services/ModuloFunciones.jsx';

export default function Menu1Screen() {
  const [checked, setChecked] = useState(false);
  const[Altura,setAltura] = useState();
  const[Base,setBase]= useState()
  const[Nombre, setNombre] = useState()
  const[idCliente,setIdCliente] = useState()
  const[idVidrio,setIdVidrio] = useState()
  

  const db = getDBConnection();
  

  const msgPrueba = async()=>{
    //const a = parseFloat(10,10)
    const costoM = await suma(Base,Altura,1);
    Alert.alert(`Costo Materiales: ${costoM}`)
  }

  const handleClientesChange = (item) => {
    //console.log('Cliente seleccionado:', item);
    setIdCliente(item.value)
    console.log('Cliente seleccionado:', idCliente);
  };

   const handleVidriosChange = (item) => {
    //console.log('Cliente seleccionado:', item);
    setIdVidrio(item.value)
    console.log('Cliente seleccionado:', idCliente);
  };
  


  return (
    <ScrollView style={styles.container}>

      <View style={styles.formContainer}>
       
        <View style={styles.checkboxContainer}>
           
          <View style={styles.ClienteCointainer}>
             <Text style={styles.label}>Cliente:</Text>
             <ClientesDropdown onChange={handleClientesChange} />
          </View>
          
          <Text style={styles.label}>Puerta</Text>
          <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          />  
                  
        </View>

        <Text style={styles.label}>Vidrio:</Text>
        <VidriosDropdown onChange={handleClientesChange} />
        <Text style={styles.label}>Nombre:</Text>
       
              <TextInput
                style={styles.input}
                value={Nombre}
                onChangeText={setNombre}
                keyboardType="text"
                placeholder="Digite una descripción"
              />



         <View style={styles.MedidasContainer}>

           <View style={styles.MedidaContiner}>

               <Text style={styles.label}>Altura:</Text>
              <TextInput
                style={styles.input}
                value={Altura}
                onChangeText={setAltura}
                keyboardType="numeric"
                placeholder="Digite la Altura"
              />

           </View>

           <View style={styles.MedidaContiner}>

             <Text style={styles.label}>Base:</Text>
              <TextInput
                style={styles.input}
                value={Base}
                onChangeText={setBase}
                keyboardType="numeric"
                placeholder="Digite la Base"
              />
            
           </View>


         </View>


         <Button
                   title="Agregar"
                   buttonStyle={styles.updateButton}
                   onPress={msgPrueba}
                 />     

      
      <Divider style={{ backgroundColor: '#CED0CE', marginVertical: 12 }} />
       <Text>Aquí van a ir las cotizaciones</Text>
       
    </View>

    </ScrollView>

    
  );
}

const styles = StyleSheet.create({
  
  checkboxContainer: {
   display:'flex',
   
    flexDirection: 'row',
    alignItems: 'center',
    
    //backgroundColor: 'green',
    marginLeft:3,
    
  },

   container: {
    
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
    
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
  saveButton: {
    borderRadius: 8,
    marginTop: 16,
  },

  Button: {
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: '#2089dc',
  },

  MedidasContainer: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  MedidaContiner:{
  marginLeft: 10,
  marginRight: 10
  },

 ClienteCointainer:{
    display:'flex',
    flexDirection:'column',
  },

});
