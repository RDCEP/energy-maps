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

export const getLayersFromState = (layerState) => {


  return [...layerState].map(layer => {

  })

};


export const initializeLayerState = function(zoomLevel) {

  const layers = [];
  for (const layerObject of layerObjects()) {
    layers.push({ func: layerObject})
  }

  return [...layers].map(layer => {
    layer.visible = false;
    layer.assetValue = assetValues[layer.func(zoomLevel).layerName]
    return layer;
  });

}

// export const reorderLayers = () {
