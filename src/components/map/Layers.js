import {CoalMines} from './layers/CoalMines';
import {OilWells} from './layers/OilWells';
import {GasPipelines} from './layers/GasPipelines';
import {assetValues} from '../../const/asset_values/AssetValues';


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
  return [ OilWells, CoalMines, GasPipelines, ];
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

export const getLayersFromState = (layerState, zoomLevel) => {
  return [...layerState].map(layer => {
    return layer.func(zoomLevel, layer.visible);
  })
};

export const updateLayerState = function() {

}

export const initializeLayerState = function(zoomLevel) {

  const layerState = [];

  for (const layerObject of layerObjects()) {
    layerState.push({ func: layerObject})
  }
  [...layerState].map(layer => {
    layer.visible = false;
    layer.assetValue = assetValues[layer.func.layerName]['2012']
    return layer;
  });
  return layerState;
}

// export const reorderLayers = () {
