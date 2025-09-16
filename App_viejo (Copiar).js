import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('clientes.db');

export default function App() {
  // Estados para la lista de clientes y campos del formulario
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Crea la tabla "Clientes" si no existe
  const crearTabla = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Clientes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          apellido TEXT,
          telefono TEXT,
          email TEXT
        );`,
        [],
        () => console.log('Tabla creada o ya existe'),
        (txObj, error) => { console.log('Error al crear la tabla', error); return true; }
      );
    });
  };

  // Cargar todos los clientes de la base de datos
  const cargarClientes = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Clientes',
        [],
        (txObj, { rows: { _array } }) => setClientes(_array),
        (txObj, error) => { console.log('Error al obtener datos', error); return true; }
      );
    });
  };

  // Agregar un nuevo cliente
  const agregarCliente = () => {
    if (nombre === '' || apellido === '' || telefono === '' || email === '') {
      Alert.alert('Por favor ingrese todos los campos');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Clientes (nombre, apellido, telefono, email) VALUES (?, ?, ?, ?)',
        [nombre, apellido, telefono, email],
        (txObj, resultSet) => {
          console.log('Cliente agregado', resultSet);
          cargarClientes();
          limpiarCampos();
        },
        (txObj, error) => { console.log('Error al agregar cliente', error); return true; }
      );
    });
  };

  // Actualizar un cliente existente
  const actualizarCliente = () => {
    if (editingId === null) return;
    if (nombre === '' || apellido === '' || telefono === '' || email === '') {
      Alert.alert('Por favor ingrese todos los campos');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Clientes SET nombre = ?, apellido = ?, telefono = ?, email = ? WHERE id = ?',
        [nombre, apellido, telefono, email, editingId],
        (txObj, resultSet) => {
          console.log('Cliente actualizado', resultSet);
          cargarClientes();
          limpiarCampos();
          setEditingId(null);
        },
        (txObj, error) => { console.log('Error al actualizar cliente', error); return true; }
      );
    });
  };

  // Eliminar un cliente
  const eliminarCliente = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Clientes WHERE id = ?',
        [id],
        (txObj, resultSet) => {
          console.log('Cliente eliminado', resultSet);
          cargarClientes();
        },
        (txObj, error) => { console.log('Error al eliminar cliente', error); return true; }
      );
    });
  };

  // Limpiar los campos del formulario
  const limpiarCampos = () => {
    setNombre('');
    setApellido('');
    setTelefono('');
    setEmail('');
  };

  // Seleccionar un cliente para editar y llenar el formulario
  const editarCliente = (cliente) => {
    setNombre(cliente.nombre);
    setApellido(cliente.apellido);
    setTelefono(cliente.telefono);
    setEmail(cliente.email);
    setEditingId(cliente.id);
  };

  // Inicializar la tabla y cargar datos al montar el componente
  useEffect(() => {
    crearTabla();
    cargarClientes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD Clientes</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.buttonContainer}>
        {editingId === null ? (
          <Button title="Agregar Cliente" onPress={agregarCliente} />
        ) : (
          <Button title="Actualizar Cliente" onPress={actualizarCliente} />
        )}
      </View>
      <FlatList
        style={styles.list}
        data={clientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemText}>
              {item.nombre} {item.apellido}
            </Text>
            <Text style={styles.itemText}>Tel: {item.telefono}</Text>
            <Text style={styles.itemText}>Email: {item.email}</Text>
            <View style={styles.buttons}>
              <Button title="Editar" onPress={() => editarCliente(item)} />
              <Button title="Eliminar" onPress={() => eliminarCliente(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginVertical: 5, 
    borderRadius: 5 
  },
  buttonContainer: { marginVertical: 10 },
  list: { marginTop: 20 },
  listItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    marginBottom: 10 
  },
  itemText: { fontSize: 16 },
  buttons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
});
