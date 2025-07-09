import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Button, Text } from 'react-native-elements';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { getDBConnection, ExportarVentanasPorCotizacion } from '../ModuloDb/MDb';
import { formatearColones } from '../services/ModuloFunciones';

const ExportarCotizacion = ({ route, navigation }) => {
  const { cotizacion } = route.params;
  const [ventanas, setVentanas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const db = await getDBConnection();
        const datosVentanas = await ExportarVentanasPorCotizacion(db, cotizacion.Id);
        setVentanas(datosVentanas);
      } catch (error) {
        console.error("Error al cargar ventanas", error);
        Alert.alert("Error", "No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const generarHTML = () => {
    const ventanasHtml = ventanas.map(v => `
      <tr>
        <td>${v.Descripcion}</td>
        <td>${v.Base / 100} x ${v.Altura /100}</td>
        <td>${v.Vidrio}</td>
        <td>${v.Costo}</td>
      </tr>
    `).join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>Cotización</h1>
          <p><strong>Cliente:</strong> ${cotizacion.Nombre}</p>
          <p><strong>Teléfono:</strong> ${cotizacion.Telefono}</p>
          <p><strong>Descripción:</strong> ${cotizacion.Descripcion}</p>
          <p><strong>Costo Total:</strong> ${formatearColones(cotizacion.Costo)}</p>
          <h2>Detalle de Ventanas</h2>
          <table>
            <tr>
              <th>Descripción</th>
              <th>Dimensiones</th>
              <th>Material</th>
              <th>Costo Unitario</th>
            </tr>
            ${ventanasHtml}
          </table>
        </body>
      </html>
    `;
  };

  const exportarPDF = async () => {
  try {
    const htmlContent = generarHTML();

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Compartir no disponible", "No se puede compartir el archivo.");
    }
  } catch (error) {
    console.error("Error exportando PDF:", error);
    Alert.alert("Error", "No se pudo exportar la cotización.");
  }
};


  return (
    <View style={styles.container}>
      <Text h4 style={{ marginBottom: 20 }}>Exportar Cotización</Text>
      <Button title="Generar y Compartir PDF" onPress={exportarPDF} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExportarCotizacion;
