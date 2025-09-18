// ModuloDb/MDb.js
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

// Singleton para manejar la conexión de la base de datos
class DatabaseManager {
  constructor() {
    this.db = null;
    this.isInitializing = false;
    this.initPromise = null;
    this.dbName = 'DB_Cotizador.db';
    this.dbDir = FileSystem.documentDirectory + 'SQLite';
    this.dbPath = `${this.dbDir}/${this.dbName}`;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 segundo
  }

  // Método para esperar un tiempo específico
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para verificar si la base de datos está disponible
  async isDatabaseReady() {
    if (!this.db) return false;
    
    try {
      // Prueba simple para verificar que la conexión está activa
      await this.db.getFirstAsync('SELECT 1 as test');
      return true;
    } catch (error) {
      console.log('Base de datos no está lista:', error.message);
      return false;
    }
  }

  // Método para inicializar la base de datos con reintentos
  async initializeDatabase() {
    // Si ya se está inicializando, esperar a que termine
    if (this.isInitializing && this.initPromise) {
      return await this.initPromise;
    }

    // Si ya está inicializada y funcional, retornarla
    if (this.db && await this.isDatabaseReady()) {
      return this.db;
    }

    // Marcar como en proceso de inicialización
    this.isInitializing = true;
    
    // Crear promesa de inicialización
    this.initPromise = this._performInitialization();
    
    try {
      const result = await this.initPromise;
      this.isInitializing = false;
      return result;
    } catch (error) {
      this.isInitializing = false;
      this.initPromise = null;
      throw error;
    }
  }

  async _performInitialization() {
    let lastError = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${this.maxRetries} de inicialización de BD`);
        
        // 1) Crear carpeta SQLite si no existe
        await this._ensureDirectory();
        
        // 2) Copiar base desde assets solo si no existe en dispositivo
        await this._ensureDatabaseFile();
        
        // 3) Abrir la base de datos
        if (this.db) {
          try {
            await this.db.closeAsync();
          } catch (closeError) {
            console.log('Error cerrando conexión anterior:', closeError.message);
          }
          this.db = null;
        }

        this.db = await SQLite.openDatabaseAsync(this.dbName);
        
        // 4) Verificar que la base de datos funciona correctamente
        await this._verifyDatabase();
        
        console.log('✅ Base de datos inicializada correctamente');
        return this.db;
        
      } catch (error) {
        lastError = error;
        console.error(`❌ Error en intento ${attempt}:`, error.message);
        
        // Limpiar conexión fallida
        if (this.db) {
          try {
            await this.db.closeAsync();
          } catch (closeError) {
            console.log('Error cerrando conexión fallida:', closeError.message);
          }
          this.db = null;
        }
        
        // Si no es el último intento, esperar antes del siguiente
        if (attempt < this.maxRetries) {
          console.log(`⏳ Esperando ${this.retryDelay}ms antes del siguiente intento...`);
          await this.delay(this.retryDelay);
          // Incrementar el delay para el siguiente intento
          this.retryDelay *= 1.5;
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    const errorMessage = `Error al inicializar la base de datos después de ${this.maxRetries} intentos. Último error: ${lastError?.message}`;
    console.error('🚫', errorMessage);
    throw new Error(errorMessage);
  }

  async _ensureDirectory() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.dbDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.dbDir, { intermediates: true });
        console.log('📁 Carpeta SQLite creada');
      }
    } catch (error) {
      throw new Error(`Error creando directorio: ${error.message}`);
    }
  }

  async _ensureDatabaseFile() {
    try {
      const dbInfo = await FileSystem.getInfoAsync(this.dbPath);
      if (!dbInfo.exists) {
        console.log('📦 Copiando base de datos desde assets...');
        
        // Carga el asset .db empaquetado
        const asset = Asset.fromModule(
          require('../assets/databases/DB_Cotizador.db')
        );
        
        // Descarga el asset para obtener localUri
        await asset.downloadAsync();
        
        if (!asset.localUri) {
          throw new Error('No se pudo obtener la URI local del asset');
        }
        
        // Verificar que el asset existe
        const assetInfo = await FileSystem.getInfoAsync(asset.localUri);
        if (!assetInfo.exists) {
          throw new Error('El archivo de asset no existe en la URI local');
        }
        
        // Copia el fichero descargado a la ruta de SQLite
        await FileSystem.copyAsync({
          from: asset.localUri,
          to: this.dbPath
        });
        
        // Verificar que la copia fue exitosa
        const copiedInfo = await FileSystem.getInfoAsync(this.dbPath);
        if (!copiedInfo.exists || copiedInfo.size === 0) {
          throw new Error('La copia de la base de datos falló o resultó en un archivo vacío');
        }
        
        console.log('✅ Base de datos copiada exitosamente a:', this.dbPath);
      }
    } catch (error) {
      throw new Error(`Error preparando archivo de base de datos: ${error.message}`);
    }
  }

  async _verifyDatabase() {
    try {
      // Prueba básica de conectividad
      const result = await this.db.getFirstAsync('SELECT 1 as test');
      if (!result || result.test !== 1) {
        throw new Error('La base de datos no responde correctamente');
      }
      
      // Verificar que las tablas principales existen
      const tableCheck = await this.db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' LIMIT 1"
      );
      
      if (!tableCheck) {
        throw new Error('La base de datos no contiene tablas');
      }
      
      console.log('✅ Verificación de base de datos exitosa');
    } catch (error) {
      throw new Error(`Error verificando base de datos: ${error.message}`);
    }
  }

  // Método para cerrar la conexión
  async closeConnection() {
    if (this.db) {
      try {
        await this.db.closeAsync();
        console.log('🔒 Conexión de base de datos cerrada');
      } catch (error) {
        console.error('Error cerrando base de datos:', error.message);
      } finally {
        this.db = null;
        this.isInitializing = false;
        this.initPromise = null;
      }
    }
  }

  // Método para obtener la conexión con manejo de reconexión
  async getConnection() {
    // Si no hay conexión o no está lista, inicializar
    if (!this.db || !(await this.isDatabaseReady())) {
      return await this.initializeDatabase();
    }
    
    return this.db;
  }

  // Método para verificar si una conexión específica sigue siendo válida
  async validateConnection(db) {
    if (!db) return false;
    try {
      await db.getFirstAsync('SELECT 1 as test');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Método para obtener una nueva conexión válida si la actual falló
  async getValidConnection(currentDb = null) {
    // Si se proporciona una conexión y aún es válida, usarla
    if (currentDb && await this.validateConnection(currentDb)) {
      return currentDb;
    }
    
    // Si la conexión actual no es válida, obtener una nueva
    return await this.getConnection();
  }
}

// Instancia singleton
const dbManager = new DatabaseManager();

// Función exportada para obtener conexión (API compatible con el código anterior)
export const getDBConnection = async () => {
  return await dbManager.getConnection();
};

// Función para cerrar conexión (útil para limpieza)
export const closeDBConnection = async () => {
  return await dbManager.closeConnection();
};

// Wrapper para ejecutar funciones de base de datos con manejo de reconexión
const withReconnection = async (operation, db, ...args) => {
  let attempts = 0;
  const maxAttempts = 2;
  
  while (attempts < maxAttempts) {
    try {
      // Verificar si la conexión actual es válida
      const validDb = await dbManager.getValidConnection(db);
      return await operation(validDb, ...args);
    } catch (error) {
      attempts++;
      console.error(`Error en operación (intento ${attempts}):`, error.message);
      
      if (attempts < maxAttempts) {
        // Cerrar la conexión problemática y obtener una nueva
        if (db) {
          try {
            await db.closeAsync();
          } catch (closeError) {
            console.log('Error cerrando conexión problemática:', closeError.message);
          }
        }
        
        // Resetear el manager para forzar una nueva conexión
        await dbManager.closeConnection();
        await dbManager.delay(500);
        
        // Obtener nueva conexión para el siguiente intento
        db = await getDBConnection();
      } else {
        throw new Error(`Operación falló después de ${maxAttempts} intentos: ${error.message}`);
      }
    }
  }
};

// ============== FUNCIONES ORIGINALES SIN MODIFICAR ==============

export const getAllClientes = async (db) => {
  return await withReconnection(async (validDb) => {
    try {
      const clientes = await validDb.getAllAsync('SELECT * FROM Clientes');
      return clientes;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }, db);
};

export const getClienteById = async (db, id) => {
  return await withReconnection(async (validDb) => {
    try {
      const cliente = await validDb.getFirstAsync('SELECT * FROM Clientes WHERE Id = ?', id);
      return cliente || null;
    } catch (error) {
      console.error('Error al obtener cliente por Id:', error);
      throw error;
    }
  }, db, id);
};

export const insertCliente = async (db, cliente) => {
  return await withReconnection(async (validDb) => {
    const { Nombre, Apellido, Telefono, Email } = cliente;
    try {
      const result = await validDb.runAsync(
        'INSERT INTO Clientes (Nombre, Apellido, Telefono, Email) VALUES (?, ?, ?, ?)',
        Nombre, Apellido, Telefono, Email
      );
      return { rowsAffected: result.changes, insertId: result.lastInsertRowId };
    } catch (error) {
      console.error('Error al insertar cliente:', error);
      throw error;
    }
  }, db, cliente);
};

export const updateCliente = async (db, cliente) => {
  return await withReconnection(async (validDb) => {
    const { Id, Nombre, Apellido, Telefono, Email } = cliente;
    try {
      const result = await validDb.runAsync(
        'UPDATE Clientes SET Nombre = ?, Apellido = ?, Telefono = ?, Email = ? WHERE Id = ?',
        Nombre, Apellido, Telefono, Email, Id
      );
      return result.changes;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  }, db, cliente);
};

export const deleteCliente = async (db, id) => {
  return await withReconnection(async (validDb) => {
    try {
      const result = await validDb.runAsync(
        'DELETE FROM Clientes WHERE Id = ?',
        id
      );
      return result.changes;
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  }, db, id);
};

// ***************  Materiales ***********************

export const getAllMateriales = async (db) => {
  return await withReconnection(async (validDb) => {
    try {
      const materiales = await validDb.getAllAsync('SELECT * FROM Materiales');
      return materiales;
    } catch (error) {
      console.error('Error al obtener Materiales:', error);
      throw error;
    }
  }, db);
};

export const update_Material = async (db, material) => {
  return await withReconnection(async (validDb) => {
    try {
      const result = await validDb.runAsync(
        'UPDATE Materiales SET Costo = ? WHERE Id = ?',
        material.Costo, material.Id
      );
      return result.changes;
    } catch (error) {
      console.error('Error al actualizar el Costo del Material:', error);
      throw error;
    }
  }, db, material);
};

//////////////////////////// Vidrios ///////////////////////////////////

export const getAllVidrios = async (db) => {
  return await withReconnection(async (validDb) => {
    try {
      const materiales = await validDb.getAllAsync('SELECT * FROM Vidrios');
      return materiales;
    } catch (error) {
      console.error('Error al Cargar Vidrios:', error);
      throw error;
    }
  }, db);
};

export const insertVidrio = async (db, Vidrio) => {
  return await withReconnection(async (validDb) => {
    const { Descripcion, Costo } = Vidrio;
    try {
      const result = await validDb.runAsync(
        'INSERT INTO Vidrios (Descripcion, Costo) VALUES (?, ?)',
        Descripcion, Costo
      );
      return { rowsAffected: result.changes, insertId: result.lastInsertRowId };
    } catch (error) {
      console.error('Error al ingresar el Vidrio:', error);
      throw error;
    }
  }, db, Vidrio);
};

export const updateVidrio = async (db, Vidrio) => {
  return await withReconnection(async (validDb) => {
    const { Id, Descripcion, Costo } = Vidrio;
    try {
      const result = await validDb.runAsync(
        'UPDATE Vidrios SET Descripcion = ?, Costo = ? WHERE Id = ?',
        Descripcion, Costo, Id
      );
      return result.changes;
    } catch (error) {
      console.error('Error al actualizar el Vidrio:', error);
      throw error;
    }
  }, db, Vidrio);
};

export const deleteVidrio = async (db, id) => {
  return await withReconnection(async (validDb) => {
    try {
      const result = await validDb.runAsync(
        'DELETE FROM Vidrios WHERE Id = ?',
        id
      );
      return result.changes;
    } catch (error) {
      console.error('Error al eliminar Vidrio:', error);
      throw error;
    }
  }, db, id);
};

export const getCostoVidrioById = async (db, id) => {
  return await withReconnection(async (validDb) => {
    try {
      const CostoVidrio = await validDb.getFirstAsync('select Costo from Vidrios where Id = ?', id);
      return CostoVidrio.Costo;
    } catch (error) {
      console.error('Error al obtener el vidrio por Id:', error);
      throw error;
    }
  }, db, id);
};

export const getAllCotizaciones = async (db) => {
  return await withReconnection(async (validDb) => {
    try {
      const Cotizaciones = await validDb.getAllAsync('Select Coti.Id,Cli.Id as IdCliente,Coti.Descripcion,Cli.Nombre, Cli.Telefono,Sum(V.Costo) as Costo from Cotizaciones as Coti inner JOIN Clientes as Cli on Coti.IdCliente = Cli.Id Inner JOIN Ventanas as V ON Coti.Id = V.IdCotizacion GROUP by Coti.Id');
      return Cotizaciones;
    } catch (error) {
      console.error('Error al obtener las Cotizaciones:', error);
      throw error;
    }
  }, db);
};

export const deleteCotizacionConVentanas = async (db, idCotizacion) => {
  return await withReconnection(async (validDb) => {
    try {
      await validDb.execAsync('BEGIN TRANSACTION');

      await validDb.runAsync(`DELETE FROM Ventanas WHERE IdCotizacion = ?`, [idCotizacion]);
      await validDb.runAsync(`DELETE FROM Cotizaciones WHERE Id = ?`, [idCotizacion]);

      await validDb.execAsync('COMMIT');
    } catch (error) {
      await validDb.execAsync('ROLLBACK');
      throw error;
    }
  }, db, idCotizacion);
};

export const UpdateCotizacion = async (db, idCotizacion, Descripcion) => {
  return await withReconnection(async (validDb) => {
    try {
      await validDb.execAsync('BEGIN TRANSACTION');

      await validDb.runAsync(`update Cotizaciones set Descripcion = ? where Id  = ?`, [Descripcion, idCotizacion]);

      await validDb.execAsync('COMMIT');
    } catch (error) {
      console.error('Error en UpdateCotizacion:', error);
      await validDb.execAsync('ROLLBACK');
      throw error;
    }
  }, db, idCotizacion, Descripcion);
};

export const deleteVentanas = async (db, idVentana) => {
  return await withReconnection(async (validDb) => {
    try {
      await validDb.execAsync('BEGIN TRANSACTION');

      await validDb.runAsync(`DELETE FROM Ventanas WHERE Id = ?`, [idVentana]);

      await validDb.execAsync('COMMIT');
    } catch (error) {
      await validDb.execAsync('ROLLBACK');
      throw error;
    }
  }, db, idVentana);
};

export const getVentanasPorCotizacion = async (db, idCotizacion) => {
  return await withReconnection(async (validDb) => {
    const result = await validDb.getAllAsync(
      `SELECT Id,IdCotizacion,IdVidrio,Descripcion,Costo,Base,Altura FROM Ventanas WHERE IdCotizacion = ?`,
      [idCotizacion]
    );
    return result;
  }, db, idCotizacion);
};

export const ExportarVentanasPorCotizacion = async (db, idCotizacion) => {
  return await withReconnection(async (validDb) => {
    const result = await validDb.getAllAsync(
      `select v.Descripcion as Descripcion, vid.Descripcion as Vidrio, v.Costo as Costo,v.Base as Base, v.Altura as Altura from Ventanas as v inner join Vidrios as vid on vid.Id = v.IdVidrio where v.IdCotizacion = ?`,
      [idCotizacion]
    );
    return result;
  }, db, idCotizacion);
};

export const getClientePorId = async (db, idCliente) => {
  return await withReconnection(async (validDb) => {
    try {
      const result = await validDb.getFirstAsync(
        `SELECT * FROM Clientes WHERE Id = ?`,
        idCliente
      );

      return result;
    } catch (error) {
      console.error("Error al obtener cliente por ID:", error);
      return null;
    }
  }, db, idCliente);
};

export const ACTUALIZAR_DB = async () => {
  const dbName = 'DB_Cotizador.db';
  const dbDir = FileSystem.documentDirectory + 'SQLite';
  const dbPath = `${dbDir}/${dbName}`;

  try {
    // 1) Crear carpeta SQLite si no existe
    const dirInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }

    // 2) Copiar base desde assets solo si no existe en dispositivo
    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (dbInfo.exists) {
      // Carga el asset .db empaquetado
      const asset = Asset.fromModule(
        require('../assets/databases/DB_Cotizador.db')
      );
      // Descarga el asset para obtener localUri
      await asset.downloadAsync();

      // Copia el fichero descargado a la ruta de SQLite
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: dbPath
      });
      console.log('📦 Base de datos copiada a:', dbPath);
      
      // Forzar reconexión después de actualizar
      await dbManager.closeConnection();
    }
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
    throw error;
  }
};

export const EXPORTAR_DB = async () => {
  const dbName = 'DB_Cotizador.db';
  const dbDir = FileSystem.documentDirectory + 'SQLite';
  const dbPath = `${dbDir}/${dbName}`;

  const exportPath = FileSystem.documentDirectory + `backup_${dbName}`;

  try {
    // Verifica si existe la base de datos original
    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (!dbInfo.exists) {
      console.warn('⚠️ La base de datos no existe en:', dbPath);
      return;
    }

    // Copia la base al directorio de documentos accesible
    await FileSystem.copyAsync({
      from: dbPath,
      to: exportPath,
    });

    console.log('✅ Base de datos exportada a:', exportPath);

    // Abre menú para compartir
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(exportPath);
    } else {
      console.warn('⚠️ Compartir no está disponible en este dispositivo.');
    }
  } catch (error) {
    console.error('❌ Error al exportar y compartir la base de datos:', error);
    throw error;
  }
};