import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';
import { Text, Checkbox } from 'react-native-paper';

export default function Menu1Screen() {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
        />
        <Text style={styles.label}>Puerta</Text>
      </View>

      <Text>Aquí van a ir las cotizaciones</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
     position: 'absolute', // ✅ Posicionamiento absoluto
    top: 20,              // ✅ Separado 20 unidades del borde superior
    left: 20,             // ✅ Separado 20 unidades del borde izquierdo
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
  },
});
