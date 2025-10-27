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
import {GasProcessing} from './layers/GasProcessing';
import {NaturalGasPlants} from './layers/NaturalGasPlants';
import {PetroleumPlants} from './layers/PetroleumPlants';
import {AcUnder100} from './layers/AcUnder100';
import {Ac100300} from './layers/Ac100300';
import {Ac345735} from './layers/Ac345735';
import {data} from 'uikit/src/js/util';

/**
 * Sets the available layers and their order in the UI.
 *
 * @return {*[]}
 */
const layerObjects = () => {
  return [
    // CoalMines,
    AcUnder100, Ac100300, Ac345735,
    // OilWells,
    // GasPipelines, GasProcessing,
    CoalPlants, NaturalGasPlants, PetroleumPlants, NuclearPlants,
    HydroPlants, WindFarms, SolarPV, GeothermalPlants, BiofuelPlants,
  ].reverse();
}

/**
 * Return an array of Deck.GL map layers based on the layerState
 *
 * @param layerState {Array} This is the state variable that tracks map layers
 * @param zoomLevel {Number} The current value of the Deck.GL map's viewState.zoom
 * @param dataYear {Number} The current year selected in the UI
 * @return {*[]}
 */
export const getLayersFromState = (layerState, zoomLevel, dataYear) => {
  return [...layerState].map(layer => {
    return layer.func(
      zoomLevel,
      dataYear,
      layer.visible,
      getAssetValue(layer.func.layerName, dataYear)
    );
  })
};

/**
 * Initialize the map layers when the application loads
 *
 * @param dataYear {Number} The current year selected in the UI
 * @return {*[]}
 */
export const initializeLayerState = (dataYear) => {
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