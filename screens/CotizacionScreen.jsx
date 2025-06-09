import React, { useState,useEffect } from 'react';
import { View, StyleSheet, TextInput,ScrollView,Alert,FlatList} from 'react-native';


import { Text, Checkbox } from 'react-native-paper';
import { Button , Divider} from 'react-native-elements';
import ClientesDropdown from '../components/ClientesDropdown.jsx';
import VidriosDropdown from '../components/VidriosDropdown.jsx';
import { getDBConnection,ACTUALIZAR_DB} from '../ModuloDb/MDb.js';
import VentanaItem from '../components/VentanaItem.jsx';

import { formatearColones, CalcularCostos,IdCotizacion,} from '../services/ModuloFunciones.jsx';

export default function CotizacionesScreen() {
 // const [checked, setChecked] = useState(false);
  const[Altura,setAltura] = useState();
  const[Base,setBase]= useState()
  const[Nombre, setNombre] = useState()
  const[idCliente,setIdCliente] = useState()
  const[idVidrio,setIdVidrio] = useState()
  const [Ventanas, setVentanas] = useState([]);
  const [Total, setTotal]= useState(0)

  const [db, setDb] = useState(null);

  useEffect(() => {
      const loadDatabase = async () => {
        try {
          const database = await getDBConnection();
          setDb(database);
          
        } catch (error) {
          console.error("Error Cargando la Base de datos", error);
          Alert.alert("Error", "No se pudo cargar la base de datos");
        }
      };
      
      loadDatabase();
    }, []);
  

  

  const msgPrueba = async () => {
  try {
    
  //  const idCoti = await IdCotizacion(db); // ← Esperar el resultado
  // ACTUALIZAR_DB()
   // Alert.alert(`El último id es: ${idCoti?.Id ?? 'Sin resultados'}`);
   Alert.alert(`Base de Datos Actualizada`)
  // Alert.alert(`El id del vidrio es : ${idVidrio}`)
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

// Guarda la cotizacion en la base de datos

const Guardar = async () => {
  try {
    
    // GuardarCotizacion (idCliente,Ventanas)
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
  

  const Agregar = async()=>{
    //const a = parseFloat(10,10)
    const Costo = await CalcularCostos(Base,Altura,idVidrio);
    const Precio = Costo * 1.30  /// 30% de utilidad, => PROGRAMAR LUEGO
    //Alert.alert(`Costo Materiales: ${costoM}`)
    
    

    const nuevaVentana ={
      Id: Date.now().toString(),
      IdCotizacion: IdCotizacion(db),
      IdVidrio: idVidrio,
      Nombre: `${Nombre}`,
      Costo:  `${Precio}`,
    }

    setVentanas(prev => [...prev, nuevaVentana]); // Agrega una ventana a la lista []

    setNombre("") // Limpia el campo
      
    setTotal(prevTotal => prevTotal + Precio); /// lleva la sumatoria de los costos x ventana

    Alert.alert(`El id de la ventana es : ${nuevaVentana.Id}`)
  }

  const handleEdit = (cliente) => {
      //No hace nada por el momento // Progrmar despues
    
  };

  const handleDelete = (cliente) => {
    //No hace nada por el momento // Progrmar despues
    
  };



  const handleClientesChange = (item) => {
    //console.log('Cliente seleccionado:', item);
    setIdCliente(item.value)
    //console.log('Cliente seleccionado:', idCliente);
  };

   const handleVidriosChange = (item) => {
    //console.log('Cliente seleccionado:', item);
    setIdVidrio(item.value)
   // console.log('Cliente seleccionado:', idCliente);
  };
  


  return (
    

       <View style={styles.container}>
       
        {/* <View style={styles.checkboxContainer}>

           <Text style={styles.label}>Puerta</Text>
          <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          />  
               
        </View> */}
        
        
          
             <Text style={styles.label}>Cliente:</Text>
             <ClientesDropdown  style={styles.dropdown}
             onChange={handleClientesChange} />

          
             <Text style={styles.label}>Vidrio:</Text> 
             <VidriosDropdown onChange={handleVidriosChange} />

          
              
    

        

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

             <Text style={styles.label}>Base:</Text>
              <TextInput
                style={styles.input}
                value={Base}
                onChangeText={setBase}
                keyboardType="numeric"
                placeholder="Digite la Base"
              />
            
           </View>

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

         </View>  


         


         <Button
                   title="Agregar"
                   buttonStyle={styles.updateButton}
                   onPress={Agregar}
                 />     

      
         <Divider style={{ backgroundColor: '#CED0CE', marginVertical: 12 }} />
       
     
       
    

      <FlatList
        data={Ventanas}
        keyExtractor={(item) => item.Id.toString()}
        renderItem={({ item }) => (
          <VentanaItem
            Ventana={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            
            
          />
        )}
      />

      <Text style={styles.label}>TOTAL:  {formatearColones(Total)}</Text>

     <Button
                   title="Guardar Cotización"
                   buttonStyle={styles.updateButton}
                   onPress={msgPrueba}
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
  saveButton: {
    borderRadius: 8,
    marginTop: 16,
  },

  Button: {
    borderRadius: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
 
  },

  

});
