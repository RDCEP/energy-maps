/**
 * @file Provides draw functions and any helpers for all power plants.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Plants
 */

EnergyMaps = (function (energy_maps, InfrastructureSet) {

  'use strict';

  /**
   * Instantiates a new PowerPlant object that contains properties used
   * to power plants to the map and legend.
   * @class
   * @classdesc Used to create objects that represent electricity-generating
   * infrastructure.
   * @extends InfrastructureSet
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   * @param {String} fuel_type - class heading from the data file
   * @param {String} color - rgba value used to draw the grid line
   * @param {String} stroke - rgba value used for symbol outlines and opacity
   */
  function PowerPlant(name, text, value, column, draw_props, fuel_type, color, stroke) {
    InfrastructureSet.call(this, name, text, value, column, draw_props);
    this.fuel_type = fuel_type || '';
    this.color = color || 'rgba(0, 0, 0, 0.5)';
    this.stroke = stroke || plant_stroke;
    this.z_index = 0;
    /**
     * Draw power plant legend to its HTML5 canvas context.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     */
    this.draw_legend = function draw_power_plant_legend(ctx, x, y) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = _electricity_generation.stroke.width;

      // TODO: The vertical increment spacing is different for power plants
      //  because their icons are larger than others. Should we apply one
      //  uniform spacing increment for all layers or should we keep it
      //  the way it is?
      y += 18 * SCALE;
      ctx.beginPath();
      energy_maps.draw_circle(ctx, [x, y], 7 * SCALE);
      ctx.stroke();
      ctx.fill();

      let text = this.text;
      y = energy_maps.advance_for_type(y, ctx, text, text_offset, x);
      return y;
    };
  }
  PowerPlant.prototype = new InfrastructureSet;

  function WindSpeed(name, text, value, column, draw_props, long, lat, speed) {
    InfrastructureSet.call(this, name, text, value, column, draw_props);
    this.long = long;
    this.lat = lat;
    this.speed = speed;
    // Add direction if available
    this.draw_legend = function draw_wind_speed_legend(ctx, x, y) {
      // do stuff
    };
  }
  WindSpeed.prototype = new InfrastructureSet;

  SCALE = 1;
  let plant_stroke = 'rgba(255, 255, 255, 1)';

  /**
  * A collection of power plant classifications used for filtering.
  * @type {Object}
  * @property {Object} stroke - contains rgba and scale values to assign
  * to ctx.strokeStyle
  * @property {Number} scale - sets the scale of all plants to a multiple
  * of global SCALE
  */
  let _electricity_generation = {
    stroke: {
      light: 'rgba(255, 255, 255, 1)',
      width: .66 * SCALE
    },
    // TODO: figure out if needed
    // This is used in the `draw_power_plant()` function
    scale: .3 * SCALE
  };

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
  function _draw_white_layer(plants, fuel, ctx, features) {
    features.forEach(function (d) {
      let xy = energy_maps.projection(d.geometry.coordinates);
      for (coord in xy) {
        if (coord != null) {
          // TODO: Does this need a year conditional? Probably
          _draw_power_plant(ctx, xy, viz.white, +d.properties.original.SUMMER_CAP);
        }
        else {
          console.log(coord)
        }
      }
      // draw_power_plant(ctx, xy, viz.white, +d.properties.original.total_cap);
      // draw_power_plant(ctx, xy, viz.white, +d.properties.original.SUMMER_CAP);
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
  const _draw_standard_layer = function draw_standard_layer(ctx, xy, fuel, d) {
    let color = fuel.color;
    if (coord != null) {
      if (DATA_YEAR === 2012) {
        _draw_power_plant(ctx, xy, color, +d.properties.original.total_cap);
      }
      else if (DATA_YEAR === 2022) {
        _draw_power_plant(ctx, xy, color, +d.properties.original.SUMMER_CAP);
      }
    }
    else {
      console.log(coord)
    }
  }

  /**
   * Helper function for draw_single_plant(). Returns the desired subset
   * of `data`, filtered by fuel type.
   * @param {Object} data - data from the readfile, passes through
   * from draw_single_plant()
   * @param {Object} fuel - fuel object from `electricity_generation`,
   * passes through from draw_single_plant() // TODO: update params
   * @param {Object} ctx - HTML5 canvas context
   * @returns {Object} features - the desired data set, narrowed by fuel type
   */
  const _get_fuel_type = function get_fuel_type(data, fuel) {
    return data.features
      .filter(function (d) {
        // return d.properties.original.primary_fu === fuel.fuel_type;
        return d.properties.type.secondary == fuel.fuel_type
      });
  }

  /**
   * Draw a single set of power plants relative to their class.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Object} queued_data - the readfile
   * @param {Object} fuel - fuel object from `electricity_generation`
   */
  // TODO: Is this drawing one single plant, or one single set of plants?
  //  Change jsdoc if necessary
  const _draw_single_plant = function draw_single_plant(ctx, queued_data, fuel) {
    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let plants = queued_data[0];
    let features = _get_fuel_type(plants, fuel);
    _draw_white_layer(plants, fuel, ctx, features);
    // Draw the standard layer
    features.forEach(function(d, i) {
      let xy = energy_maps.projection(d.geometry.coordinates);
      if (xy === null) {
        //
      } else {
        _draw_standard_layer(ctx, xy, fuel, d);
      }
      if (i === features.length - 1) {
        energy_maps.finish_loading_layer();
      }
    });
  };

  // TODO: Determine purpose and add jsdoc
  const _draw_power_plant = function draw_power_plant(ctx, xy, color, r) {
    ctx.strokeStyle = _electricity_generation.stroke.light;
    ctx.lineWidth = _electricity_generation.stroke.width / TRANSFORM.k ** .71;
    ctx.fillStyle = color;
    // TODO: extract math to variable or function
    r = Math.sqrt(r / Math.PI) * _electricity_generation.scale;
    r = r / TRANSFORM.k ** .5;
    ctx.beginPath();
    // Draw larger circle for stroke, so that stroke aligns to outside of
    //  of circumference
    energy_maps.draw_circle(ctx, xy, r + ctx.lineWidth);
    // FIXME: Need a better method of changing stroke color for lighter circles.
    if (color !== VIZ.white) {
      if (color === energy_maps.ng_plants.color) {
        ctx.strokeStyle = 'darkblue';
      } else if (color === solar_plants.color) {
        ctx.strokeStyle = 'darkorange';
      }
      ctx.stroke();
    }
    energy_maps.draw_circle(ctx, xy, r);
    ctx.fill();
  };

  const _draw_coal_plants = function draw_coal_plants(ctx, queued_data) {
    _draw_single_plant(ctx, queued_data, energy_maps.coal_plants);
  };

  const _draw_ng_plants = function draw_ng_plants(ctx, queued_data) {
    _draw_single_plant(ctx, queued_data, energy_maps.ng_plants);
  };

  const _draw_petro_plants = function draw_petro_plants(ctx, queued_data) {
    _draw_single_plant(ctx, queued_data, energy_maps.pet_plants);
  };

  const _draw_hydro_plants = function draw_hydro_plants(ctx, queued_data) {
    _draw_single_plant(ctx, queued_data, energy_maps.hyc_plants);
  };

  const _draw_nuclear_plants = function draw_nuclear_plants(ctx, queued_data) {
    _draw_single_plant(ctx, queued_data, energy_maps.nuc_plants);
  };

  const _draw_wind_farms = function draw_wind_farms(ctx, queued_data) {
    _draw_single_plant(ctx, queued_data, energy_maps.wnd_farms);
  };

  const _draw_solar_plants = function draw_solar_plants(ctx, queued_data) {
    _draw_single_plant(ctx, queued_data, energy_maps.solar_plants);
  };

  const _draw_geo_plants = function draw_geo_plants(ctx, queued_data) {
    _draw_single_plant(ctx, queued_data, energy_maps.geo_plants);
  };

  // Instantiate PowerPlants

  energy_maps.coal_plants = new PowerPlant('coal-plants', 'Coal plants', {2012: 1_092_000_000_000, 2022: 681_740_400_000}, 'electricity-generation', [{
    draw_layer: _draw_coal_plants,
    src: [`/power_plants/coal`],
    d3_fetch: d3.json,
  }], 'coal', 'rgba(0, 0, 0, .5)', plant_stroke);

  energy_maps.ng_plants = new PowerPlant('natural-gas-plants', 'Nat. gas plants', {2012: 488_000_000_000, 2022: 564_559_069_258}, 'electricity-generation', [{
    draw_layer: _draw_ng_plants,
      src: [`/power_plants/natural_gas`],
      d3_fetch: d3.json,
  }], 'natural_gas', 'rgba(0, 191, 255, .5)', 'darkblue');

  energy_maps.pet_plants = new PowerPlant('petroleum-plants', 'Petro. plants', {2012: 64_000_000_000, 2022: null}, 'electricity-generation', [{
    draw_layer: _draw_petro_plants,
    src: [`/power_plants/petroleum`],
    d3_fetch: d3.json,
  }], 'petroleum', 'rgba(34, 139, 34, .5)', plant_stroke);

  energy_maps.nuc_plants = new PowerPlant('nuclear-plants', 'Nuclear plants', {2012: 597_000_000_000, 2022: null}, 'electricity-generation', [{
    draw_layer: _draw_nuclear_plants,
    src: [`/power_plants/nuclear`],
    d3_fetch: d3.json,
  }], 'nuclear', 'rgba(255, 0, 0, .5)', plant_stroke);

  energy_maps.hyc_plants = new PowerPlant('hydro-plants', 'Hydro. plants', {2012: 597_000_000_000, 2022: null}, 'electricity-generation', [{
    draw_layer: _draw_hydro_plants,
    src: [`/power_plants/hydroelectric`],
    d3_fetch: d3.json,
  }], 'hydroelectric', 'rgba(11, 36, 251, .5)', plant_stroke);

  energy_maps.wnd_farms = new PowerPlant('wind-farms', 'Wind farms', {2012: 132_000_000_000, 2022: null}, 'electricity-generation', [{
    draw_layer: _draw_wind_farms,
    src: [`/power_plants/wind`],
    d3_fetch: d3.json,
  }], 'wind', 'rgba(144, 29, 143, .5)', plant_stroke);

  energy_maps.solar_plants = new PowerPlant('solar-PV', 'Solar PV', {2012: 14_000_000_000, 2022: null}, 'electricity-generation', [{
    draw_layer: _draw_solar_plants,
    src: [`/power_plants/solar`],
    d3_fetch: d3.json,
  }], 'solar', 'rgba(255, 215, 0, .5)', 'darkorange');

  energy_maps.geo_plants = new PowerPlant('geothermal-plants', 'Geo. plants', {2012: 22_000_000_000, 2022: null}, 'electricity-generation', [{
    draw_layer: _draw_geo_plants,
    src: [`/power_plants/geothermal`],
    d3_fetch: d3.json,
  }], 'geothermal', 'rgba(210, 105, 30, .5)', plant_stroke);

  // let bio_plants = new PowerPlant('biofuel', 'Biofuel power plants', 51_000_000_000, 'electricity-generation', [ {
  //   draw_layer: draw_bio_plants,
  //   src: [`${API_URL_PREFIX}/power_plants/power_plants-BIO.json`],
  //   d3_fetch: d3.json,
  // } ], 'BIO', 'rgba(17, 75, 30, .5)', plant_stroke);

  energy_maps.biofuel = {
    name: 'biofuel',
    value: {2012: 51_000_000_000, 2022: null},
    draw_props: false,
    column: 'electricity-generation',
  };

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);