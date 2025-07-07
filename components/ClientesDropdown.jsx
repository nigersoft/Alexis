import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getDBConnection, getAllClientes } from '../ModuloDb/MDb.js';

const ClientesDropdown = ({ onChange, initialValue = null }) => {
  const [clientes, setClientes] = useState([]);
  const [selected, setSelected] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  const loadClientes = async (cnx) => {
    const listaClientes = await getAllClientes(cnx);

    const dropdownData = listaClientes.map(client => ({
      label: `${client.Nombre} ${client.Apellido}`,
      value: client.Id,
    }));

    setClientes(dropdownData);

    // Selección inicial si hay `initialValue`
    if (initialValue) {
      const found = dropdownData.find(item => item.value === initialValue);
      if (found) {
        setSelected(initialValue);
        if (onChange) onChange(found);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const connection = await getDBConnection();
        await loadClientes(connection);
      } catch (error) {
        console.error('Error cargando Clientes:', error);
        setLoading(false);
      }
    })();
  }, []);

  const handleSelect = (item) => {
    setSelected(item.value);
    if (onChange) onChange(item);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        data={clientes}
        search
        labelField="label"
        valueField="value"
        placeholder="-- Elige cliente --"
        value={selected}
        onChange={handleSelect}
        searchPlaceholder="Buscar cliente"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  dropdown: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#fff',
  },
});

export default ClientesDropdown;
