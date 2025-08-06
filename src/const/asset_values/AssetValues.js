
export const assetValues = {
  CoalMines: {
    '2012': 41_474_000_000,
  },
  GasPipelines: {
    '2012': 41_474_000_000,
  },
  Railroads: {
    '2012': 137_000_000_000,
    '2022': 137_000_000_000,
  },
  GasWells: {
    '2012': 1_059_000_000_000,
    '2022': 1_059_000_000_000,
  },
  OilWells: {
    '2012': 654_000_000_000,
    '2022': 654_000_000_000,
  },
  ForeignOilWells: {
    '2012': 931_000_000_000,
  },
  ForeignGasWells: {
    '2012': 63_000_000_000,
  },
  GasPipelines: {
    '2012': 940_000_000_000,
    '2022': 940_000_000_000,
  },
  OilProductPipelines: {
  },
  OilPipelines: {
    '2012': 170_000_000_000,
    '2022': 170_000_000_000,
  },
  OilRefineries: {
    '2012': 373_000_000_000,
  },
  GasProcessing: {
    '2012': 45_000_000_000,
  },
  OilGasStorage: {
    '2012': 181_000_000_000,
  },
  CoalPlants: {
    '2012': 1_092_000_000_000,
    '2022': 681_740_400_000,
  },
  WindFarms: {
    '2012': 132_000_000_000,
  }
}

export const getAssetValue = function(layerName, dataYear) {
  return assetValues[layerName][String(dataYear)];
}

export const prettyAssetValue = function(assetValue) {
  const magnitude = Math.floor(Math.log10(assetValue) / 3);
  const unit = {1: 'k', 2: 'M', 3: 'B', 4: 'T'}[magnitude]
  return `$${Math.round(assetValue / Math.pow(10, magnitude * 3) * 10) / 10} ${unit}`
}