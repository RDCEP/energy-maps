/**
 * @file Provides draw functions and any helpers for all power plants.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Plants
 */

EnergyMaps = (function (EnergyMaps) {

  'use strict';

  /**
   * Instantiates a new PowerPlant object that contains properties used
   * to power plants to the map and legend.
   * @class
   * @classdesc Used to create objects that represent electricity-generating
   *  infrastructure.
   * @extends InfrastructureSet
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} drawProps - properties used to parse the data and render
   *  the visualization
   * @param {String} fuelType - class heading from the data file
   * @param {String} color - rgba value used to draw the grid line
   * @param {String} stroke - rgba value used for symbol outlines and opacity
   */
  let PowerPlant = function PowerPlant
    (name, text, value, column, drawProps,
     fuelType, color, stroke)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.fuelType = fuelType || '';
    this.color = color || 'rgba(0, 0, 0, 0.5)';
    this.stroke = stroke || plantStroke;
    this.zIndex = 0;
    /**
     * Draw power plant legend to its HTML5 canvas context.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     */
    this.drawLegend = function drawPowerPlantLegend(ctx, x, y) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = .66 * SCALE;

      // TODO: The vertical increment spacing is different for power plants
      //  because their icons are larger than others. Should we apply one
      //  uniform spacing increment for all layers or should we keep it
      //  the way it is?
      y += 18 * SCALE;
      ctx.beginPath();
      EnergyMaps.drawCircle(ctx, [x, y], 7 * SCALE);
      ctx.stroke();
      ctx.fill();

      let text = this.text;
      y = EnergyMaps.advanceForType(y, ctx, text, TEXT_OFFSET, x);
      return y;
    };
  }
  PowerPlant.prototype = new EnergyMaps.InfrastructureSet;

  let WindSpeed = function WindSpeed
    (name, text, value, column, drawProps, long, lat, speed)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.long = long;
    this.lat = lat;
    this.speed = speed;
    // Add direction if available
    this.drawLegend = function drawWindSpeedLegend(ctx, x, y) {
      // do stuff
    };
  }
  WindSpeed.prototype = new EnergyMaps.InfrastructureSet;

  const plantStroke = 'rgba(255, 255, 255, 1)';

  /**
   * Helper function for draw_single_plant(). Draw the white background
   * for each symbol.
   * @param {Object} plants - data from the readfile, passes through from
   * draw_single_plant()
   * @param {Object} fuel - fuel object from `electricity_generation`, passes
   * through from draw_single_plant()
   * @param {Object} ctx - HTML5 canvas context
   * @param {Array} features
   */
  const _drawWhiteLayer = function _drawWhiteLayer
    (plants, fuel, ctx, features)
  {
    features.forEach(function (d) {
      let xy = EnergyMaps.projection(d.geometry.coordinates);
      if (xy !== null) {
          // TODO: Does this need a year conditional? Probably
        _drawPowerPlant(ctx, xy, VIZ.white, +d.properties.original.SUMMER_CAP);
      } else {
        console.log(xy)
      }
    });
  }

  /**
   * Helper function for draw_single_plant(). Draw the standard layer for
   * each symbol.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} xy - xy coordinates
   * @param {Object} fuel - fuel object from `electricity_generation`,
   * passes through from draw_single_plant()
   * @param {Object} d - data element filtered by fuel type from the readfile
   */
  const _drawStandardLayer = function _drawStandardLayer
    (ctx, xy, fuel, d)
  {
    let color = fuel.color;
    // if (coord != null) {  # FIXME: `coord` is not defined
      if (DATA_YEAR === 2012) {
        // _drawPowerPlant(ctx, xy, color, +d.properties.original.totalCap);
        _drawPowerPlant(ctx, xy, color, +d.properties.original.total_cap);
      }
      else if (DATA_YEAR === 2022) {
        _drawPowerPlant(ctx, xy, color, +d.properties.original.SUMMER_CAP);
      }
    // }
    // else {
    //   console.log(coord)
    // }
  }

  /**
   * Helper function for draw_single_plant(). Returns the desired subset
   * of `data`, filtered by fuel type.
   * @param {Object} data - data from the readfile, passes through
   * from draw_single_plant()
   * @param {Object} fuel - fuel object from `electricity_generation`,
   * passes through from draw_single_plant()
   * @returns {Object} features - the desired data set, narrowed by fuel type
   */
  const _getFuelType = function _getFuelType
    (data, fuel)
  {
    return data.features
      .filter(function (d) {
        // return d.properties.original.primary_fu === fuel.fuel_type;
        return d.properties.type.secondary === fuel.fuelType
      });
  }

  /**
   * Draw a single set of power plants relative to their class.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Object} queuedData - the readfile
   * @param {Object} fuel - fuel object from `electricity_generation`
   */
  // TODO: Is this drawing one single plant, or one single set of plants?
  //  Change jsdoc if necessary
  const _drawSinglePlant = function _drawSinglePlant
    (ctx, queuedData, fuel)
  {
    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    let plants = queuedData[0];
    let features = _getFuelType(plants, fuel);
    _drawWhiteLayer(plants, fuel, ctx, features);
    // Draw the standard layer
    features.forEach(function(d, i) {
      let xy = EnergyMaps.projection(d.geometry.coordinates);
      if (xy === null) {
        //
      } else {
        _drawStandardLayer(ctx, xy, fuel, d);
      }
      if (i === features.length - 1) {
        EnergyMaps.finishLoadingLayer();
      }
    });
  };

  // TODO: Determine purpose and add jsdoc
  const _drawPowerPlant = function _drawPowerPlant
    (ctx, xy, color, r)
  {
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.lineWidth = .66 * SCALE / EnergyMaps.transform.k ** .71;
    ctx.fillStyle = color;
    // TODO: extract math to variable or function
    r = Math.sqrt(r / Math.PI) * .3 * SCALE;
    r = r / EnergyMaps.transform.k ** .5;
    ctx.beginPath();
    // Draw larger circle for stroke, so that stroke aligns to outside of
    //  of circumference
    EnergyMaps.drawCircle(ctx, xy, r + ctx.lineWidth);
    // FIXME: Need a better method of changing stroke color for lighter circles.
    if (color !== VIZ.white) {
      if (color === EnergyMaps.naturalGasPlants.color) {
        ctx.strokeStyle = 'darkblue';
      } else if (color === solarPlants.color) {
        ctx.strokeStyle = 'darkorange';
      }
      ctx.stroke();
    }
    EnergyMaps.drawCircle(ctx, xy, r);
    ctx.fill();
  };

  const _drawCoalPlants = function _drawCoalPlants
    (ctx, queuedData)
  {
    _drawSinglePlant(ctx, queuedData, EnergyMaps.coalPlants);
  };

  const _drawNgPlants = function _drawNgPlants
    (ctx, queuedData)
  {
    _drawSinglePlant(ctx, queuedData, EnergyMaps.naturalGasPlants);
  };

  const _drawPetroPlants = function _drawPetroPlants
    (ctx, queuedData)
  {
    _drawSinglePlant(ctx, queuedData, EnergyMaps.petroleumPlants);
  };

  const _drawHydroPlants = function _drawHydroPlants
    (ctx, queuedData)
  {
    _drawSinglePlant(ctx, queuedData, EnergyMaps.hydroPlants);
  };

  const _drawNuclearPlants = function _drawNuclearPlants
    (ctx, queuedData)
  {
    _drawSinglePlant(ctx, queuedData, EnergyMaps.nuclearPlants);
  };

  const _drawWindFarms = function _drawWindFarms
    (ctx, queuedData)
  {
    _drawSinglePlant(ctx, queuedData, EnergyMaps.windFarms);
  };

  const _drawSolarPlants = function _drawSolarPlants
    (ctx, queuedData)
  {
    _drawSinglePlant(ctx, queuedData, EnergyMaps.solarPlants);
  };

  const _drawGeoPlants = function _drawGeoPlants
    (ctx, queuedData)
  {
    _drawSinglePlant(ctx, queuedData, EnergyMaps.geothermalPlants);
  };

  // Instantiate PowerPlants

  const coalPlants = new PowerPlant('coal-plants', 'Coal plants',
    {2012: 1_092_000_000_000, 2022: 681_740_400_000}, 'electricity-generation',
    [{
      drawLayer: _drawCoalPlants,
      src: [`/power_plants/coal`],
      d3Fetch: d3.json,
    }], 'coal', 'rgba(0, 0, 0, .5)', plantStroke);

  const naturalGasPlants = new PowerPlant('natural-gas-plants', 'Nat. gas plants',
    {2012: 488_000_000_000, 2022: 564_559_069_258}, 'electricity-generation',
    [{
      drawLayer: _drawNgPlants,
      src: [`/power_plants/natural_gas`],
      d3Fetch: d3.json,
    }], 'natural_gas', 'rgba(0, 191, 255, .5)', 'darkblue');

  const petroleumPlants = new PowerPlant('petroleum-plants', 'Petro. plants',
    {2012: 64_000_000_000, 2022: null}, 'electricity-generation', [{
      drawLayer: _drawPetroPlants,
      src: [`/power_plants/petroleum`],
      d3Fetch: d3.json,
    }], 'petroleum', 'rgba(34, 139, 34, .5)', plantStroke);

  const nuclearPlants = new PowerPlant('nuclear-plants', 'Nuclear plants',
    {2012: 597_000_000_000, 2022: null}, 'electricity-generation',
    [{
      drawLayer: _drawNuclearPlants,
      src: [`/power_plants/nuclear`],
      d3Fetch: d3.json,
    }], 'nuclear', 'rgba(255, 0, 0, .5)', plantStroke);

  const hydroPlants = new PowerPlant('hydro-plants', 'Hydro. plants',
    {2012: 597_000_000_000, 2022: null}, 'electricity-generation', [{
      drawLayer: _drawHydroPlants,
      src: [`/power_plants/hydroelectric`],
      d3Fetch: d3.json,
    }], 'hydroelectric', 'rgba(11, 36, 251, .5)', plantStroke);

  const windFarms = new PowerPlant('wind-farms', 'Wind farms',
    {2012: 132_000_000_000, 2022: null}, 'electricity-generation', [{
      drawLayer: _drawWindFarms,
      src: [`/power_plants/wind`],
      d3Fetch: d3.json,
    }], 'wind', 'rgba(144, 29, 143, .5)', plantStroke);

  const solarPlants = new PowerPlant(
    'solar-PV', 'Solar PV', {2012: 14_000_000_000, 2022: null},
    'electricity-generation', [{
      drawLayer: _drawSolarPlants,
      src: [`/power_plants/solar`],
      d3Fetch: d3.json,
    }], 'solar', 'rgba(255, 215, 0, .5)', 'darkorange');

  const geothermalPlants = new PowerPlant('geothermal-plants', 'Geo. plants',
    {2012: 22_000_000_000, 2022: null}, 'electricity-generation', [{
      drawLayer: _drawGeoPlants,
      src: [`/power_plants/geothermal`],
      d3Fetch: d3.json,
    }], 'geothermal', 'rgba(210, 105, 30, .5)', plantStroke);

  // let bio_plants = new PowerPlant('biofuel', 'Biofuel power plants', 51_000_000_000, 'electricity-generation', [ {
  //   draw_layer: draw_bio_plants,
  //   src: [`${API_URL_PREFIX}/power_plants/power_plants-BIO.json`],
  //   d3_fetch: d3.json,
  // } ], 'BIO', 'rgba(17, 75, 30, .5)', plant_stroke);

  const biofuel = {
    name: 'biofuel',
    assetValue: {2012: 51_000_000_000, 2022: null},
    drawProps: false,
    column: 'electricity-generation',
  };

  EnergyMaps.coalPlants = coalPlants;
  EnergyMaps.naturalGasPlants = naturalGasPlants;
  EnergyMaps.petroleumPlants = petroleumPlants;
  EnergyMaps.nuclearPlants = nuclearPlants;
  EnergyMaps.hydroPlants = hydroPlants;
  EnergyMaps.windFarms = windFarms;
  EnergyMaps.solarPlants = solarPlants;
  EnergyMaps.geothermalPlants = geothermalPlants;
  EnergyMaps.biofuel = biofuel;

  return EnergyMaps;

})(EnergyMaps || {});