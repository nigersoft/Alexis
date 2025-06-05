import React, { useState } from 'react';
import { getDBConnection, getAllMateriales, getCostoVidrioById} from '../ModuloDb/MDb.js';



export const suma = async(B,A,IdVid) =>{

  try {
     const Base = Number(B)
     const Altura = Number(A)
     const db = await getDBConnection()
     const listaMateriales= await getAllMateriales(db)
     const CostoVidrio = await getCostoVidrioById(db,IdVid)
     
     
    //     // Almacena los costos de cada material de la bd
     const CostoCargador = listaMateriales.find(m => m.Id === 1).Costo
     const CostoUmbra = listaMateriales.find(m => m.Id === 2).Costo
     const CostoJamba = listaMateriales.find(m => m.Id === 3).Costo
     const CostoInferior = listaMateriales.find(m => m.Id === 4).Costo
     const CostoSuperior = listaMateriales.find(m => m.Id === 5).Costo
     const CostoLateralMovil = listaMateriales.find(m => m.Id === 6).Costo
     const CostoLateralFijo = listaMateriales.find(m => m.Id === 7).Costo
     const CostoCerradura = listaMateriales.find(m => m.Id === 8).Costo
     const CostoRodin = listaMateriales.find(m => m.Id === 9).Costo
     const CostoEmpaque = listaMateriales.find(m => m.Id === 10).Costo
     const CostoGuiaPlastica = listaMateriales.find(m => m.Id === 11).Costo
     const CostoFelpa = listaMateriales.find(m => m.Id === 12).Costo
     const CostoTornillos = listaMateriales.find(m => m.Id === 13).Costo

    //   /// Calcula los cost0s

     const Cargador = (Base /100) * CostoCargador
     const Umbra = (Base/100) * CostoUmbra
     const Jamba = ((Altura - 1.8)/100) * CostoJamba * 2
     const Inferior = (((Base/2)- 1.2)/100)* CostoInferior
     const Superior = (((Base/2)- 1.6)/100)* CostoSuperior * 3
     const LateralMovil = ((Altura - 3.1)/100) * CostoLateralMovil * 2
     const LateralFijo = ((Altura - 2.4)/100) * CostoLateralFijo * 2
     const Cerradura = CostoCerradura
     const Rodin = 4 * CostoRodin
     const Empaque = (((Base+Altura)*2)/100)* CostoEmpaque
     const GuiPlastica = (Base/100) * CostoGuiaPlastica
     const Felpa = (Base/100) * CostoFelpa
     const Tornillos = 12 * CostoTornillos

     const Vidrio =(((Base * Altura) -(10.6*Altura)-((19.1*Base)/2) +101.23 )/10000) * CostoVidrio
     //const Vidrio =((Base * Altura)/10000)  * CostoVidrio

     CostoTotal = Cargador + Umbra + Jamba + Inferior + Superior + LateralMovil + LateralFijo + Cerradura + Rodin + Empaque + GuiPlastica + Felpa + Tornillos
      /////////// ver consola

console.log('📦 Desglose de Cálculo de Materiales:');
console.log('Cargador:        ', Cargador);
console.log('Umbra:           ', Umbra);
console.log('Jamba:           ', Jamba);
console.log('Inferior:        ', Inferior);
console.log('Superior:        ', Superior);
console.log('LateralMovil:    ', LateralMovil);
console.log('LateralFijo:     ', LateralFijo);
console.log('Cerradura:       ', Cerradura);
console.log('Rodin:           ', Rodin);
console.log('Empaque:         ', Empaque);
console.log('Guía Plástica:   ', GuiPlastica);
console.log('Felpa:           ', Felpa);
console.log('Tornillos:       ', Tornillos);
console.log('Costo Empaque:       ', CostoEmpaque);
console.log('Base:       ', Base);
console.log('Altura:       ', Altura);



      ///////////////////////
    

     return  CostoTotal + Vidrio
  } catch (error) {
    console.error('Error al obtener datos de los materiales:', error);
    throw error;
  }

}