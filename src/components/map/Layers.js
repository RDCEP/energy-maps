import {CoalMines} from './layers/CoalMines';
import {OilWells} from './layers/OilWells';
import {GasPipelines} from './layers/GasPipelines';
import {WindFarms} from './layers/WindFarms';
import {getAssetValue} from '../header/AssetTotal';
import {NuclearPlants} from './layers/NuclearPlants';
import {CoalPlants} from './layers/CoalPlants';
import {HydroPlants} from './layers/HydroPlants';
import {SolarPV} from './layers/SolarPV';
import {GeothermalPlants} from './layers/GeothermalPlants';
import {BiofuelPlants} from './layers/BiofuelPlants';

const layerObjects = () => {
  return [ CoalMines, OilWells, GasPipelines, CoalPlants, NuclearPlants,
    HydroPlants, WindFarms, SolarPV, GeothermalPlants, BiofuelPlants,
  ].reverse();
}

export const getLayersFromState = (layerState, zoomLevel, dataYear) => {
  return [...layerState].map(layer => {
    return layer.func(
      zoomLevel,
      layer.visible,
      getAssetValue(layer.func.layerName, dataYear)
    );
  })
};

export const initializeLayerState = function(dataYear) {
  const layerState = [];
  for (const layerObject of layerObjects()) {
    layerState.push({ func: layerObject})
  }
  [...layerState].map(layer => {
    layer.id = layer.func.id;
    layer.visible = false;
    layer.assetValue = getAssetValue(layer.func.layerName, dataYear)
    return layer;
  });
  return layerState;
}