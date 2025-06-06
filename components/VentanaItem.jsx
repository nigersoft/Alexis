// components/VidrioItem.jsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

const VentanaItem = ({ Ventana, onEdit, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{Ventana.Nombre} </Text>
        <Text style={styles.details}>₡ {Ventana.Costo}</Text>
       
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => onEdit(Vidrio)} style={styles.actionButton}>
          <Icon name="edit" type="material" color="#2089dc" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(Vidrio.Id)} style={styles.actionButton}>
          <Icon name="delete" type="material" color="#ff0000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 15,
  },
});

export default VentanaItem ;