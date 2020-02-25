/**
 * @file Provides draw functions and any helpers for all power plants.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Plants
 */

/** 
 * Instatiates a new PowerPlant object that contains properties used to power plants to the map and legend.
 * @class
 * @classdesc Used to create objects that represent electricity-generating infrastructure.
 * @extends InfrastructureSet
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render the visualization
 * @param {String} fuel_type - class heading from the data file
 * @param {String} color - rgba value used to draw the grid line
 * @param {String} stroke - rgba value used for symbol outlines and opacity
 */
function PowerPlant(name, text, value, column, draw, fuel_type, color, stroke) {
  InfrastructureSet.call(this, name, text, value, column, draw);
  this.fuel_type = fuel_type || '';
  this.color = color || 'rgba(0, 0, 0, 0.5)';
  this.stroke = stroke || plant_stroke;
}
PowerPlant.prototype = new InfrastructureSet;

SCALE = 1;
let plant_stroke = 'rgba(255, 255, 255, 1)';

 /**
 * A collection of power plant classifications used for filtering.
 * @type {Object} 
 * @property {Object} stroke - contains rgba and scale values to assign to ctx.strokeStyle 
 * @property {Number} scale - sets the scale of all plants to a multiple of global SCALE 
 */
let electricity_generation = {
  stroke: {
    light: 'rgba(255, 255, 255, 1)',
  //   natural_gas: 'darkblue',
  //   sun: 'darkorange',
  //   dark: 'rgba(0, 0, 0, 1)', // TODO: Is this prop used anywhere?
    width: .66 * SCALE
  },
  scale: .3 * SCALE, //old_scale: .9 * SCALE, // TODO: figure out if needed
}; 

/**
 * Helper function for draw_single_plant(). Draw the white background for each symbol.
 * @param {Object} plants - data from the readfile, passes through from draw_single_plant()
 * @param {Object} fuel - fuel object from `electricity_generation`, passes through from draw_single_plant()
 * @param {Object} ctx - HTML5 canvas context
 */
function draw_white_layer(plants, fuel, ctx) {
  features.forEach(function (d) {
    let xy = projection(d.geometry.coordinates);
    draw_power_plant(ctx, xy, viz.white, +d.properties.total_cap);
  });
}

/**
 * Helper function for draw_single_plant(). Returns the desired subset of `data`, filtered by fuel type.
 * @param {Object} data - data from the readfile, passes through from draw_single_plant() 
 * @param {Object} fuel - fuel object from `electricity_generation`, passes through from draw_single_plant() // TODO: update params
 * @param {Object} ctx - HTML5 canvas context
 * @returns {Object} features - the desired data set, narrowed by fuel type
 */
const get_fuel_type = function get_fuel_type(data, fuel) {
  features = data.features
    .filter(function (d) {
      return d.properties.primary_fu === fuel.fuel_type;
    });
    return features;
}

/**
 * Draw a single set of power plants relative to their class.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Object} queued_data - the readfile
 * @param {Object} fuel - fuel object from `electricity_generation`
 */
// TODO: Is this drawing one single plant, or one single set of plants? Change jsdoc if necessary
const draw_single_plant = function draw_single_plant(ctx, queued_data, fuel) {
  console.log('draw_single_plant');

  let plants = queued_data[0];
  get_fuel_type(plants, fuel);

  // features = plants.features
  //   .filter(function (d) {
  //     return d.properties.primary_fu === fuel.fuel_type;
  //   });

  draw_white_layer(plants, fuel, ctx);
  // Draw the standard layer
  features.forEach(function(d, i) {
    let xy = projection(d.geometry.coordinates);
    if (xy === null) {
      //
    } else {
      let color = fuel.color;
      if (fuel == bio_plants) {
        // TODO: come up with a meaningful scaling metric. Can the PADD district help us in some way, at least to come up with the actual data? Perhaps we need to provide some disclaimer about the size of biofuel plants?
        draw_power_plant(ctx, xy, color, +d.properties.PADD * 300);
        // draw_power_plant(ctx, xy, color, +d.geometry.coordinates[1]);
      }
      else {
        draw_power_plant(ctx, xy, color, +d.properties.total_cap);
      }
    }
    if (i === features.length - 1) { 
      hide_spinner(); 
    }
  });

};

// TODO: Determine purpose and add jsdoc
const draw_power_plant = function draw_power_plant(ctx, xy, color, r) {
  ctx.strokeStyle = electricity_generation.stroke.light;
  ctx.lineWidth = electricity_generation.stroke.width;
  ctx.fillStyle = color;
  // TODO: extract math to variable or function
  r = Math.sqrt(r / Math.PI) * electricity_generation.scale;
  ctx.beginPath();
  // Draw larger circle for stroke, so that stroke aligns to outside of
  //  of circumference
  draw_circle(ctx, xy, r + ctx.lineWidth);
  // FIXME: Need a better method of changing stroke color for lighter circles.
  if (color !== viz.white) {
    if (color === ng_plants.color) {
      ctx.strokeStyle = 'darkblue';
    } else if (color === solar_plants.color) {
      ctx.strokeStyle = 'darkorange';
    }
    ctx.stroke();
  }
  draw_circle(ctx, xy, r);
  ctx.fill();
};

const draw_coal_plants = function draw_coal_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, coal_plants)
};

const draw_ng_plants = function draw_ng_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, ng_plants)
};

const draw_petro_plants = function draw_petro_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, pet_plants)
};

const draw_hydro_plants = function draw_hydro_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, hyc_plants)
};

const draw_nuclear_plants = function draw_nuclear_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, nuc_plants)
};

const draw_wind_farms = function draw_wind_farms(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, wnd_farms)
};

const draw_solar_plants = function draw_solar_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, solar_plants)
};

const draw_geo_plants = function draw_geo_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, geo_plants)
};

const draw_bio_plants = function draw_bio_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, bio_plants)
};

// Instantiate PowerPlants

let coal_plants = new PowerPlant('coal-plant', 'Coal power plant', 1_092_000_000_000, 'electricity-generation', [ {
  f: draw_coal_plants,
  src: ['/static/json/power_plants_split/power_plants-COAL.json'],
  w: d3.json,
} ], 'COAL', 'rgba(0, 0, 0, .5)', plant_stroke);

let ng_plants = new PowerPlant('natural-gas-plant', 'Natural gas power plant', 488_000_000_000, 'electricity-generation', [ {
  f: draw_ng_plants,
    src: ['/static/json/power_plants_split/power_plants-NG.json'],
    w: d3.json,
} ], 'NG', 'rgba(0, 191, 255, .5)', 'darkblue');

let pet_plants = new PowerPlant('petroleum-plant', 'Petroleum power plant', 64_000_000_000, 'electricity-generation', [ {
  f: draw_petro_plants,
  src: ['/static/json/power_plants_split/power_plants-PET.json'],
  w: d3.json,
} ], 'PET', 'rgba(34, 139, 34, .5)', plant_stroke);

let nuc_plants = new PowerPlant('nuclear-plant', 'Nuclear power plant', 597_000_000_000, 'electricity-generation', [ {
  f: draw_nuclear_plants,
  src: ['/static/json/power_plants_split/power_plants-NUC.json'],
  w: d3.json,
} ], 'NUC', 'rgba(255, 0, 0, .5)', plant_stroke);

let hyc_plants = new PowerPlant('hydro-plant', 'Hydro power plant', 597_000_000_000, 'electricity-generation', [ {
  f: draw_hydro_plants,
  src: ['/static/json/power_plants_split/power_plants-HYC.json'],
  w: d3.json,
} ], 'HYC', 'rgba(11, 36, 251, .5)', plant_stroke);

let wnd_farms = new PowerPlant('wind-farms', 'Wind farm', 132_000_000_000, 'electricity-generation', [ {
  f: draw_wind_farms,
  src: ['/static/json/power_plants_split/power_plants-WND.json'],
  w: d3.json,
} ], 'WND', 'rgba(144, 29, 143, .5)', plant_stroke);

let solar_plants = new PowerPlant('solar-PV', 'Solar power plant', 14_000_000_000, 'electricity-generation', [ {
  f: draw_solar_plants,
  src: ['/static/json/power_plants_split/power_plants-SUN.json'],
  w: d3.json,
} ], 'SUN', 'rgba(255, 215, 0, .5)', 'darkorange');

let geo_plants = new PowerPlant('geothermal-plant', 'Geothermal power plant', 22_000_000_000, 'electricity-generation', [ {
  f: draw_geo_plants,
  src: ['/static/json/power_plants_split/power_plants-GEO.json'],
  w: d3.json,
} ], 'GEO', 'rgba(210, 105, 30, .5)', plant_stroke);

let bio_plants = new PowerPlant('biofuel', 'Biofuel power plant', 51_000_000_000, 'electricity-generation', [ {
  f: draw_bio_plants,
  src: ['/static/json/power_plants_split/power_plants-BIO.json'],
  w: d3.json,
} ], 'BIO', 'rgba(17, 75, 30, .5)', plant_stroke);


let biofuel = { 
  name: 'biofuel',
  value: 51_000_000_000,
  draw: false,
  column: 'electricity-generation',
}
















// FIXME: MOVE TO A STATIC MAPS FUNCS DIR/FILE OR DELETE LATER
// UNTIL A DECISION IS MADE, THIS CODE IS SAFE TO IGNORE (COMMENT LEFT 01/15/2020)
// Old code, used for drawing the static images. Replace with code
// that just calls each function
const draw_power_plants = function draw_power_plants(ctx, queued_data, nff) {
  console.log('draw_power_plants');

  let plants = queued_data[0];

  // Toggle fuels for fossil vs non-fossil fuels
  let fuels = ['PET', 'NG', 'COAL'];
  if (nff) {
    fuels = ['SUN', 'WND', 'NUC', 'GEO', 'HYC'];
  }

  plants.features.filter(function(d) {
      return fuels.indexOf(d.properties.primary_fu) > -1;
    })
    .forEach(function(d) {
      let xy = projection(d.geometry.coordinates);
      draw_power_plant(ctx, xy, viz.white, +d.properties.total_cap);
    });
  plants.features
    .filter(function(d) {
      return fuels.indexOf(d.properties.primary_fu) > -1;
    }).forEach(function(d) {
      let xy = projection(d.geometry.coordinates);
      if (xy === null) {
        //
      } else {
        let color = fuel.color;
        draw_power_plant(ctx, xy, color, +d.properties.total_cap);
      }
    });
};

const draw_ff_plants = function draw_ff_plants(ctx, queued_data) {
  // draw_power_plants(ctx, queued_data, false) // old implementation
  // suggested implementation below:
  draw_petro_plants(ctx, queued_data);
  draw_ng_plants(ctx, queued_data);
  draw_coal_plants(ctx, queued_data);
};

const draw_nff_plants = function draw_nff_plants(ctx, queued_data) {
  // draw_power_plants(ctx, queued_data, true) old implementation
  // suggested implementation below:
  draw_solar_plants(ctx, queued_data);
  draw_wind_farms(ctx, queued_data);
  draw_nuclear_plants(ctx, queued_data);
  draw_geo_plants(ctx, queued_data);
  draw_hydro_plants(ctx, queued_data);
};