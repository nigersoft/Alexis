import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { getDBConnection, updateCliente } from '../ModuloDb/MDb.js';

const EditarVentana = ({ route, navigation }) => {
  const { ventana, actualizarVentana } = route.params;
  const [nombre, setNombre] = useState('');
  const [costo, setCosto] = useState(0);
  const [base, setBase] = useState(0);
  const [altura, setAltura] = useState(0);
  const [db, setDb] = useState(null);

  // Sincronizar el formulario con el tablaVentanas cada vez que cambie
  useEffect(() => {
    if (ventana) {
      setNombre(ventana.Nombre);
      setCosto(ventana.Costo);
      setBase(ventana.Base);
      setAltura(ventana.Altura);
    }
  }, [ventana]);

  // Cargar la base de datos
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const database = await getDBConnection();
        setDb(database);
      } catch (error) {
        console.error('Error loading database', error);
        Alert.alert('Error', 'No se pudo cargar la base de datos');
      }
    };
    loadDatabase();
  }, []);

  const handleUpdate = async () => {
    // Validación simple
    if (!nombre.trim() || !costo.trim() || !base.trim() || !altura.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const updatedVentana = {
              Id: ventana.Id,
              IdCotizacion:ventana.IdCotizacion,
              IdVidrio:ventana.IdVidrio,
              Nombre: nombre,
              Costo: costo,
              Base: base,
              Altura:altura,
      };

      actualizarVentana(updatedVentana) // Devuelve la ventana actualizada
      Alert.alert('Éxito', 'Ventana actualizada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error actualizando Ventana', error);
      Alert.alert('Error', 'No se pudo actualizar la ventana');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
        />

        <Text style={styles.label}>Base</Text>
        <TextInput
          style={styles.input}
          value={base}
          onChangeText={setBase}
          placeholder="Base"
        />

        <Text style={styles.label}>Altura</Text>
        <TextInput
          style={styles.input}
          value={altura}
          onChangeText={setAltura}
          placeholder="Altura"
         // keyboardType="phone-pad"
        />

        <Text style={styles.label}>Costo</Text>
        <TextInput
          style={styles.input}
          value={costo}
          onChangeText={setCosto}
          placeholder="Costo"
          //keyboardType="email-address"
          //autoCapitalize="none"
        />

        <Button
          title="Actualizar"
          buttonStyle={styles.updateButton}
          onPress={handleUpdate}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  updateButton: {
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: '#2089dc',
  },
});

export default EditarVentana;
