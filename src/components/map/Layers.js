import {CoalMines} from './layers/CoalMines';
import {OilWells} from './layers/OilWells';
import {GasPipelines} from './layers/GasPipelines';
import {WindFarms} from './layers/WindFarms';
import {getAssetValue} from '../header/AssetTotal';
import {SolarPV} from './layers/SolarPV';

const layerObjects = () => {
  return [ OilWells, CoalMines, GasPipelines, WindFarms, SolarPV].reverse();
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