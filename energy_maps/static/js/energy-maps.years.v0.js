/**
 * @file Provides objects and functions for year selection.
 * @author Nathan Matteson
 * @module
 */

EnergyMaps = (function (EnergyMaps) {

  'use strict';

  const createButton = function createButton
    (year)
  {
    d3.select('.options-list h6')
      .append('button')
      .attr('data-year', year)
      .text(year)
      .on('click', _changeDataYear);
  };

  const _changeDataYear = function _changeDataYear
    ()
  {
    let that = d3.select(this);
    let dataYear = +that.attr('data-year');
    DATA_YEAR = dataYear;
    API_URL_PREFIX = `http://127.0.0.1:5000/api/v0.1.0/infrastructure/${dataYear}`;
    for (let i = 0, n = LAYERS.length; i < n; ++i) {
      EnergyMaps.showLayerAssetTotal(LAYERS[i], dataYear);
    }
    EnergyMaps.drawActiveLayers();

    EnergyMaps.displayAssetTotal();
  };

  const assetKludge = function assetKludge
    () {
    let unchangedLayers2022 = [
      EnergyMaps.gasWell, EnergyMaps.oilWell, EnergyMaps.railroad,
      EnergyMaps.AcNaAndUnder100, EnergyMaps.Ac100300,
      EnergyMaps.Ac345735, EnergyMaps.dc, EnergyMaps.gasPipeline,
      EnergyMaps.oilPipeline, EnergyMaps.oilProductPipeline
    ];
    for (let i = 0, n = unchangedLayers2022.length; i < n; ++i) {
      unchangedLayers2022[i].unchanged_2022 = true;
    }
  };

  createButton(2012);
  createButton(2022);
  assetKludge();

  return EnergyMaps;

})(EnergyMaps || {});