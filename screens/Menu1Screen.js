import React, { useState } from 'react';
import { View, StyleSheet, TextInput,ScrollView  } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';
import { Text, Checkbox } from 'react-native-paper';

export default function Menu1Screen() {
  const [checked, setChecked] = useState(false);
  const[Altura,setAltura] = useState();
  const[Base,setBase]= useState()

  return (
    <ScrollView style={styles.container}>

      <View style={styles.formContainer}>
        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>Puerta</Text>
          
          <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          />
        </View>
        
      
       
         <Text style={styles.label}>Altura:</Text>
              <TextInput
                style={styles.input}
                value={Altura}
                onChangeText={setAltura}
                keyboardType="numeric"
                placeholder="Digite la Altura"
              />
         <Text style={styles.label}>Base:</Text>
              <TextInput
                style={styles.input}
                value={Base}
                onChangeText={setBase}
                keyboardType="numeric"
                placeholder="Digite la Base"
              />     

      <Text>Aquí van a ir las cotizaciones</Text>

       
       
    </View>

    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  
  checkboxContainer: {
    // position: 'absolute', // ✅ Posicionamiento absoluto
    top: 10,              // ✅ Separado 20 unidades del borde superior
    left: 6,             // ✅ Separado 20 unidades del borde izquierdo
    flexDirection: 'row',
    alignItems: 'center',
    
    //backgroundColor: 'green',
   
  },

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
  saveButton: {
    borderRadius: 8,
    marginTop: 16,
  },

});
