EnergyMaps = (function (EnergyMaps) {

  'use strict';

  async function getData(func, url) {
    console.log(func, url)
    const cacheVersion = 1;
    const cacheName = `energy-maps-${cacheVersion}`;
    // const url = "https://jsonplaceholder.typicode.com/todos/1";
    let cachedData = await _getCachedData(cacheName, url);
    console.log(cachedData)

    if (cachedData) {
      console.log("Retrieved cached data");
      return cachedData;
    }

    console.log("Fetching fresh data");

    const cacheStorage = await caches.open(cacheName);
    func(url).then((response) => {
      if (!response.ok) {
        throw new TypeError("bad response status");
      }
      console.log(response)
      return cacheStorage.put(url, response)
    })
    // const response = await func(url);
    // const status = await cacheStorage.put(url, response);
    // console.log(status)
    // await cacheStorage.add(func(url));
    cachedData = await _getCachedData(cacheName, url);
    console.log(cachedData)
    await _deleteOldCaches(cacheName);

    return cachedData;
  }

  // Get data from the cache.
  async function _getCachedData(cacheName, url) {
    const cacheStorage = await caches.open(cacheName);
    console.log(cacheStorage)
    const cachedResponse = await cacheStorage.match(url);
    console.log(cachedResponse)

    if (!cachedResponse || !cachedResponse.ok) {
      return false;
    }

    return await cachedResponse.json();
  }

  async function _deleteOldCaches(currentCache) {
    const keys = await caches.keys();

    for (const key of keys) {
      const isOurCache = key.startsWith("energy-maps-");
      if (currentCache === key || !isOurCache) {
        continue;
      }
      caches.delete(key);
    }
  }

  // _deleteOldCaches('energy-maps-1')
  EnergyMaps.getCachedData = getData;
  return EnergyMaps;

})(EnergyMaps || {});