EnergyMaps = (function (EnergyMaps) {

  'use strict';

  const energyMapsCache = new Dexie('EnergyMapsCache');

  energyMapsCache.version(1).stores({
      layers: `
        name,
        docs`,
    });

  // Clear the cache on page load. Because the cache is a buggy mess.
  // And the API needs to faster so that we don;t need the cache at all.
  energyMapsCache.layers.clear();

  EnergyMaps.cache = energyMapsCache;
  return EnergyMaps;

})(EnergyMaps || {});