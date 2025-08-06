import {CoalMines} from './layers/CoalMines';
import {OilWells} from './layers/OilWells';
import {GasPipelines} from './layers/GasPipelines';
import {WindFarms} from './layers/WindPowerPlants';
import {getAssetValue} from '../../const/asset_values/AssetValues';


//FIXME: Need to make a function that takes a visibility object and zoomLevel
// as args, build a layer list, and returns it. Eventually need to create
// logic for updating data attributes as necessary. Each layer will have
// some sort of scaling logic based on zoomLevel.

// export const zoomLayers = (layers, zoomLevel) => {
//   return [...layers].map((layer) => {
//     return layer(zoomLevel)
//   })
// }

const layerObjects = () => {
  return [ OilWells, CoalMines, GasPipelines, WindFarms];
}

export const getLayers = (zoomLevel) => {

  return [
    OilWells(zoomLevel),
    CoalMines(zoomLevel),
    GasPipelines(zoomLevel),
    // Railroads,
    // OilPipelines,
  ];

};

export const getLayersFromState = (layerState, zoomLevel, dataYear) => {
  return [...layerState].map(layer => {
    return layer.func(
      zoomLevel,
      layer.visible,
      getAssetValue(layer.func.layerName, dataYear)
    );
  })
};

export const updateLayerState = function() {

}

export const initializeLayerState = function(dataYear) {

  const layerState = [];

  for (const layerObject of layerObjects()) {
    layerState.push({ func: layerObject})
  }
  [...layerState].map(layer => {
    layer.visible = false;
    layer.assetValue = getAssetValue(layer.func.layerName, dataYear)
    return layer;
  });
  return layerState;
}

// export const reorderLayers = () {
