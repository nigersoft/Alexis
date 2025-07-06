import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import FormularioVentana from '../components/FormularioVentana';

const EditarVentana = ({ route, navigation }) => {
  const { ventana, actualizarVentana } = route.params;

  const [nombre, setNombre] = useState('');
  const [costo, setCosto] = useState('');
  const [base, setBase] = useState('');
  const [altura, setAltura] = useState('');

  useEffect(() => {
    if (ventana) {
      setNombre(ventana.Nombre ?? '');
      setCosto(String(ventana.Costo ?? ''));
      setBase(String(ventana.Base ?? ''));
      setAltura(String(ventana.Altura ?? ''));
    }
  }, [ventana]);

  const handleUpdate = () => {
    if (
      !nombre.trim() ||
      isNaN(base) || base === '' ||
      isNaN(altura) || altura === '' ||
      isNaN(costo) || costo === ''
    ) {
      Alert.alert('Error', 'Todos los campos deben estar completos y numéricos donde corresponde.');
      return;
    }

    const updatedVentana = {
      Id: ventana.Id,
      IdCotizacion: ventana.IdCotizacion,
      IdVidrio: ventana.IdVidrio,
      Nombre: nombre.trim(),
      Costo: parseFloat(costo),
      Base: parseFloat(base),
      Altura: parseFloat(altura),
    };

    actualizarVentana(updatedVentana);
    Alert.alert('✅ Éxito', 'Ventana actualizada correctamente');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FormularioVentana
        Nombre={nombre}
        setNombre={setNombre}
        Base={base}
        setBase={setBase}
        Altura={altura}
        setAltura={setAltura}
        Costo={costo}
        setCosto={setCosto}
        onSubmit={handleUpdate}
        textoBoton="Actualizar ventana"
        mostrarCliente={false}
        mostrarVidrio={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default EditarVentana;
