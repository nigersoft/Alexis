import React, { useState } from 'react';
import { getDBConnection, getAllMateriales} from '../ModuloDb/MDb.js';



export const CostoMateriales=(Base,Altura,db) =>{

    //const connection =  getDBConnection();
    const [materiales, setMateriales] = useState([]);


    
    const listaMateriales=  getAllMateriales(db)
    setMateriales(listaMateriales);
    
    // Almacena los costos de cada material de la bd
    const CostoCargador = materiales.find(m => m.id === 1).Costo
    const CostoUmbra = materiales.find(m => m.id === 2).Costo
    const CostoJamba = materiales.find(m => m.id === 3).Costo
    const CostoInferior = materiales.find(m => m.id === 4).Costo
    const CostoSuperior = materiales.find(m => m.id === 5).Costo
    const CostoLateralMovil = materiales.find(m => m.id === 6).Costo
    const CostoLateralFijo = materiales.find(m => m.id === 7).Costo
    const CostoCerradura = materiales.find(m => m.id === 8).Costo
    const CostoRodin = materiales.find(m => m.id === 9).Costo
    const CostoEmpaque = materiales.find(m => m.id === 10).Costo
    const CostoGuiaPlastica = materiales.find(m => m.id === 11).Costo
    const CostoFelpa = materiales.find(m => m.id === 12).Costo
    const CostoTornillos = materiales.find(m => m.id === 13).Costo

  /// Calcula los cost0s

  const Cargador = (Base /100) * CostoCargador
  const Umbra = (Base/100) * CostoUmbra
  const Jamba = ((Altura - 1.8)/100) * CostoJamba *2


  const CostoTotal = Cargador + Umbra + Jamba

return CostoTotal

}

