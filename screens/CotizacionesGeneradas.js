// screens/Menu2Screen.js
// screens/ClientesListScreen.jsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import CotizacionItem from '../components/CotizacionItem.jsx';
import { getDBConnection, getAllCotizaciones, deleteCliente } from '../ModuloDb/MDb.js';

const CotizacionesGeneradas = ({ navigation }) => {
  const [Cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const database = await getDBConnection();
        setDb(database);
        await loadCOtizaciones(database);
      } catch (error) {
        console.error("Error Cargando database", error);
        Alert.alert("Error", "No se pudo cargar la base de datos");
      } finally {
        setLoading(false);
      }
    };
    
    loadDatabase();
  }, []);

  useEffect(() => {
    // Recargar las cotizaciones cuando la pantalla reciba el foco
    const unsubscribe = navigation.addListener('focus', () => {
      if (db) {
        loadCOtizaciones(db);
      }
    });

    return unsubscribe;
  }, [navigation, db]);

  const loadCOtizaciones = async (database) => {
    try {
      const cotizacionData = await getAllCotizaciones(database);
      setCotizaciones(cotizacionData );
    } catch (error) {
      console.error("Error Cargando Cotizaciones", error);
      Alert.alert("Error", "No se pudieron cargar las Cotizaciones");
    }
  };

  const handleEdit = (cliente) => {
   // navigation.navigate('EditarCliente', { cliente }); = Modificar
    //navigation.push('EditarCliente', { cliente });
    
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta cotización?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCliente(db, id);
              await loadCOtizaciones(db);
              Alert.alert("Éxito", "Cotización eliminada correctamente");
            } catch (error) {
              console.error("Error deleting cotizacion", error);
              Alert.alert("Error", "No se pudo eliminar la Cotización");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Cotizaciones}
        keyExtractor={(item) => item.Id.toString()}
        renderItem={({ item }) => (
          <CotizacionItem
            cotizacion={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            
            
          />
        )}
      />
      <Button
        title="Agregar Cotizacion"
        buttonStyle={styles.addButton}
        onPress={() => navigation.navigate('NuevoCliente')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'relative',
    margin: 50,
    marginBottom:80,
    borderRadius: 8,
    paddingBottom: 10,
  },
});

export default CotizacionesGeneradas;


