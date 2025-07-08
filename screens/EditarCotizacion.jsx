import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, FlatList,TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from 'react-native-elements';
import { getDBConnection, getVentanasPorCotizacion , deleteVentanas} from '../ModuloDb/MDb';
import VentanaItem from '../components/VentanaItem';
import ClientesDropdown from '../components/ClientesDropdown';


const EditarCotizacion = ({ route, navigation }) => {
  const { cotizacion } = route.params;
  const [db, setDb] = useState(null);
  const [ventanas, setVentanas] = useState([]);
  const [idCliente, setIdCliente] = useState();
  const [margen, setMargen] = useState(1.3); // Margen de ganancia
  const [Descripcion, setDescripcion] = useState()

  useEffect(() => {
  const init = async () => {
    try {
      const database = await getDBConnection();
      setDb(database);
      setVentanas([]);
      await cargarDatos(database);
      setIdCliente(cotizacion.IdCliente);
      setDescripcion(cotizacion.Descripcion);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar la cotización");
    }
  };
  init();
}, [cotizacion]);

  const cargarDatos = async (database) => {
    const v = await getVentanasPorCotizacion(database, cotizacion.Id);

    console.log("Ventanas cargadas:", v);  // <-- revisa aqui
    setIdCliente(cotizacion.IdCliente);
    setDescripcion(cotizacion.Descripcion);

    setVentanas(v);
  };

  const handleEdit = (ventana) => {
    // setVentanas(prev =>
    //   prev.map(v => v.Id === ventana.Id ? ventana : v)
    // );

    navigation.navigate('EdiVentana', { ventana});
  };

 

 

const handleDeleteVentana = (id) => {
  const ventanaSeleccionada = ventanas.find(v => v.Id === id);

  Alert.alert(
    '¿Eliminar ventana?',
    `¿Estás seguro de que deseas eliminar la ventana "${ventanaSeleccionada?.Nombre || 'sin nombre'}"?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteVentanas(id); // Asegúrate que sea una función async
            const nuevas = ventanas.filter(v => v.Id !== id);
            setVentanas(nuevas);
            Alert.alert('✅ Eliminado', 'La ventana ha sido eliminada.');
          } catch (error) {
            console.error('Error al eliminar la ventana:', error);
            Alert.alert('❌ Error', 'No se pudo eliminar la ventana.');
          }
        },
      },
    ],
    { cancelable: true }
  );
};


  const guardarCambios = async () => {
    try {
      // Acá podrías hacer update del cliente, del margen, etc.
      Alert.alert('✅ Guardado', 'Cambios de la cotización actualizados');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar');
    }
  };

  return (
    
    <View style={styles.container}>
        <Text style={styles.label}>Descripcion:</Text>
            <TextInput
              style={styles.input}
              value={Descripcion}          // <-- aquí uso el estado local
              onChangeText={setDescripcion}
              placeholder="Ej: Ventana Principal"
             />


          <Text style={styles.label}>Cliente</Text>
          <ClientesDropdown
            onChange={(item) => setIdCliente(item.value)}
            //initialValue={idCliente}
            value={idCliente}
          />

          <Text style={styles.label}>Ventanas:</Text>

      <FlatList
      data={ventanas}
      keyExtractor={(item) => item.Id.toString()}
      
      renderItem={({ item }) => (
        <VentanaItem
          Ventana={item}
          onEdit={handleEdit}
          
          onDelete={handleDeleteVentana}
        />
      )}
      
    />


       <Button
          title="Guardar Cambios"
          buttonStyle={styles.button}
          onPress={guardarCambios}
        />   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
});

export default EditarCotizacion;
