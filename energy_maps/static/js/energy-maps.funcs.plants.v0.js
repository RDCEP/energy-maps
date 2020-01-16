/**
 * @file Provides draw functions and any helpers for all power plants.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Plants
 */

 /**
 * A collection of power plant classifications used for filtering.
 * @type {Object} 
 * @property {string} identifier - an abbreviation of the class name in the data file
 * @property {string} fuel_type - a nested property; cooresponds to class heading in data file 
 * @property {string} color - a nested property; corresponds to `viz` object; used to distinguish plant sets on screen 
 */
let plant_classes = {
  PLANT_CLASS_COAL: {
    fuel_type: 'COAL',
    color: viz.plants.coal
  },
  PLANT_CLASS_GEO: { 
    fuel_type: 'GEO',
    color: viz.plants.geo
  },
  PLANT_CLASS_HYC: {
    fuel_type: 'HYC',
    color: viz.plants.hydro
  }, 
  PLANT_CLASS_NG: {
    fuel_type: 'NG',
    color: viz.plants.gas
  }, 
  PLANT_CLASS_NUC: {
    fuel_type: 'NUC',
    color: viz.plants.nuclear
  }, 
  PLANT_CLASS_PET: {
    fuel_type: 'PET',
    color: viz.plants.oil
  }, 
  PLANT_CLASS_SUN: {
    fuel_type: 'SUN',
    color: viz.plants.solar
  },
  PLANT_CLASS_WND: {
    fuel_type: 'WND',
    color: viz.plants.wind
  }
}; 

/**
 * Helper function for draw_single_plant(). Draw the white background for each symbol.
 * @param {Object} plants - data from the readfile, passes through from draw_single_plant()
 * @param {Object} fuel - fuel object from `plant_classes`, passes through from draw_single_plant()
 * @param {Object} ctx - HTML5 canvas context
 */
function draw_white_layer(plants, fuel, ctx) {
  features.forEach(function (d) {
    let xy = projection(d.geometry.coordinates);
    draw_power_plant(ctx, xy, viz.white, +d.properties.total_cap);
  });
}

/**
 * Draw a single set of power plants relative to their class.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Object} queued_data - the readfile
 * @param {Object} fuel - fuel object from `plant_classes`
 */
const draw_single_plant = function draw_single_plant(ctx, queued_data, fuel) {
  console.log('draw_single_plant');

  let plants = queued_data[0];

  features = plants.features
    .filter(function (d) {
      return d.properties.primary_fu === fuel.fuel_type;
    });

  draw_white_layer(plants, fuel, ctx);
  // Draw the standard layer
  features.forEach(function(d, i) {
    let xy = projection(d.geometry.coordinates);
    if (xy === null) {
      //
    } else {
      let color = fuel.color;
      draw_power_plant(ctx, xy, color, +d.properties.total_cap);
    }
    if (i === features.length - 1) { 
      hide_spinner(); 
    }
  });

};

const draw_power_plant = function draw_power_plant(ctx, xy, color, r) {
  ctx.strokeStyle = viz.plants.stroke.light;
  ctx.lineWidth = viz.plants.stroke.width;
  ctx.fillStyle = color;
  r = Math.sqrt(r / Math.PI) * viz.plants.scale;
  ctx.beginPath();
  // Draw larger circle for stroke, so that stroke aligns to outside of
  //  of circumference
  draw_circle(ctx, xy, r + ctx.lineWidth);
  // FIXME: Need a better method of changing stroke color for lighter circles.
  if (color !== viz.white) {
    if (color === viz.plants.gas) {
      ctx.strokeStyle = 'darkblue';
    } else if (color === viz.plants.solar) {
      ctx.strokeStyle = 'darkorange';
      // ctx.strokeStyle = viz.plants.stroke.dark;
    }
    ctx.stroke();
  }
  draw_circle(ctx, xy, r);
  ctx.fill();
};

const draw_coal_plants = function draw_coal_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, plant_classes.PLANT_CLASS_COAL)
};

const draw_ng_plants = function draw_ng_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, plant_classes.PLANT_CLASS_NG)
};

const draw_petro_plants = function draw_petro_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, plant_classes.PLANT_CLASS_PET)
};

const draw_hydro_plants = function draw_hydro_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, plant_classes.PLANT_CLASS_HYC)
};

const draw_nuclear_plants = function draw_nuclear_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, plant_classes.PLANT_CLASS_NUC)
};

const draw_wind_farms = function draw_wind_farms(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, plant_classes.PLANT_CLASS_WND)
};

const draw_solar_plants = function draw_solar_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, plant_classes.PLANT_CLASS_SUN)
};

const draw_geo_plants = function draw_geo_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, plant_classes.PLANT_CLASS_GEO)
};


















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