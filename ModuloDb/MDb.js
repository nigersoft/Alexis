// ModuloDb/MDb.js
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

export const getDBConnection = async () => {
  const dbName = 'DB_Cotizador.db';
  const dbDir  = FileSystem.documentDirectory + 'SQLite';
  const dbPath = `${dbDir}/${dbName}`;

  try {
    // 1) Crear carpeta SQLite si no existe
    const dirInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }

    // 2) Copiar base desde assets solo si no existe en dispositivo
    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (!dbInfo.exists) {
      // Carga el asset .db empaquetado
      const asset = Asset.fromModule(
        require('../assets/databases/DB_Cotizador.db')
      );
      // Descarga el asset para obtener localUri
      await asset.downloadAsync();

      // Copia el fichero descargado a la ruta de SQLite
      await FileSystem.copyAsync({
        from: asset.localUri,
        to:   dbPath
      });
      console.log('📦 Base de datos copiada a:', dbPath);
    }

    // 3) Abrir la base de datos con API async
    return await SQLite.openDatabaseAsync(dbName);
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
    throw error;
  }
};

export const getAllClientes = async (db) => {
  try {
    const clientes = await db.getAllAsync('SELECT * FROM Clientes');
    return clientes;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

export const getClienteById = async (db, id) => {
  try {
    const cliente = await db.getFirstAsync('SELECT * FROM Clientes WHERE Id = ?', id);
    return cliente || null;
  } catch (error) {
    console.error('Error al obtener cliente por Id:', error);
    throw error;
  }
};

export const insertCliente = async (db, cliente) => {
  const { Nombre, Apellido, Telefono, Email } = cliente;
  try {
    const result = await db.runAsync(
      'INSERT INTO Clientes (Nombre, Apellido, Telefono, Email) VALUES (?, ?, ?, ?)',
      Nombre, Apellido, Telefono, Email
    );
    return { rowsAffected: result.changes, insertId: result.lastInsertRowId };
  } catch (error) {
    console.error('Error al insertar cliente:', error);
    throw error;
  }
};

export const updateCliente = async (db, cliente) => {
  const { Id, Nombre, Apellido, Telefono, Email } = cliente;
  try {
    const result = await db.runAsync(
      'UPDATE Clientes SET Nombre = ?, Apellido = ?, Telefono = ?, Email = ? WHERE Id = ?',
      Nombre, Apellido, Telefono, Email, Id
    );
    return result.changes;
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    throw error;
  }
};

export const deleteCliente = async (db, id) => {
  try {
    const result = await db.runAsync(
      'DELETE FROM Clientes WHERE Id = ?',
      id
    );
    return result.changes;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw error;
  }
};

// ***************  Materiales ***********************

export const getAllMateriales = async (db) => {
  try {
    const materiales = await db.getAllAsync('SELECT * FROM Materiales');
    return materiales;
  } catch (error) {
    console.error('Error al obtener Materiales:', error);
    throw error;
  }
};

export const update_Material= async (db, material) => {
  
  try {
    const result = await db.runAsync(
      'UPDATE Materiales SET Costo = ? WHERE Id = ?',
      material.Costo, material.Id
    );
    return result.changes;
  } catch (error) {
    console.error('Error al actualizar el Costo del Material:', error);
    throw error;
  }
};

//////////////////////////// Vidrios ///////////////////////////////////

export const getAllVidrios = async (db) => {
  try {
    const materiales = await db.getAllAsync('SELECT * FROM Vidrios');
    return materiales;
  } catch (error) {
    console.error('Error al Cargar Vidrios:', error);
    throw error;
  }
};

///////// Inserta un nuevo vidrio //////////////
export const insertVidrio = async (db, Vidrio)=> {
  const { Descripcion,Costo} = Vidrio;
  try {
    const result = await db.runAsync(
      'INSERT INTO Vidrios (Descripcion, Costo) VALUES (?, ?)',
      Descripcion, Costo
    );
    return { rowsAffected: result.changes, insertId: result.lastInsertRowId };
  } catch (error) {
    console.error('Error al ingresar el Vidrio:', error);
    throw error;
  }
};


//////// Actualiza un vidrio /////////////////////

export const updateVidrio = async (db, Vidrio) => {
  const { Id, Descripcion, Costo} = Vidrio;
  try {
    const result = await db.runAsync(
      'UPDATE Vidrios SET Descripcion = ?, Costo = ? WHERE Id = ?',
      Descripcion, Costo, Id
    );
    return result.changes;
  } catch (error) {
    console.error('Error al actualizar el Vidrio:', error);
    throw error;
  }
};
//////////////////////// Elimina el vidrio

export const deleteVidrio = async (db, id) => {
  try {
    const result = await db.runAsync(
      'DELETE FROM Vidrios WHERE Id = ?',
      id
    );
    return result.changes;
  } catch (error) {
    console.error('Error al eliminar Vidrio:', error);
    throw error;
  }
};

///////// Buscar costo del vidrio por id ////////////

export const getCostoVidrioById = async (db, id) => {
  try {
    const CostoVidrio = await db.getFirstAsync('select Costo from Vidrios where Id = ?', id);
    return CostoVidrio.Costo;
  } catch (error) {
    console.error('Error al obtener el vidrio por Id:', error);
    throw error;
  }
};