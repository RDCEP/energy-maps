EnergyMaps = (function (EnergyMaps) {

  'use strict';

  const energyMapsCache = new Dexie('EnergyMapsCache');

  energyMapsCache.version(1).stores({
      layers: `
        name,
        docs`,
    });

  EnergyMaps.cache = energyMapsCache;
  return EnergyMaps;

})(EnergyMaps || {});