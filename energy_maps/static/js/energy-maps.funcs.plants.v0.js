/**
 * @typedef {Object} geojson_geometry
 * @property {String} type
 * @property {Array} coordinates
 */

/**
 * @typedef {Object} power_plant_properties
 * @property {String} total_cap - Annual capacity in TKTK
 * @property {String} primary_fu - Primary fuel
 */

/**
 * @typedef {Object} power_plant_feature
 * @property {geojson_geometry} geometry
 * @property {power_plant_properties} properties
 */

/**
 * @typedef {Object} power_plant_geojson
 * @property {Object} crs
 * @property {power_plant_feature[]} features
 */

/**
 * @typedef {power_plant_geojson} power_plant
 * @property
 */

/**
 *
 * @param {power_plant_geojson[]} queued_data
 */
const draw_power_plants = function draw_power_plants(ctx, queued_data, nff) {
  console.log('draw_power_plants');

  let wells = queued_data[0];

  // Toggle fuels for fossil vs non-fossil fuels
  let fuels = ['PET', 'NG', 'COAL'];
  if (nff) {
    fuels = ['SUN', 'WND', 'NUC', 'GEO', 'HYC'];
  }

  wells.features.filter(function(d) {
      return fuels.indexOf(d.properties.primary_fu) > -1;
    })
    .forEach(function(d) {
      let xy = projection(d.geometry.coordinates);
      draw_power_plant(ctx, xy, viz.white, +d.properties.total_cap);
    });
  wells.features
    .filter(function(d) {
      return fuels.indexOf(d.properties.primary_fu) > -1;
    }).forEach(function(d) {
      let xy = projection(d.geometry.coordinates);
      if (xy === null) {
        //
      } else {
        let color = 'black';
        switch(d.properties.primary_fu) {
          case 'COAL': color = viz.plants.coal; break;
          case 'NG': color = viz.plants.gas; break;
          case 'PET': color = viz.plants.oil; break;
          case 'HYC': color = viz.plants.hydro; break;
          case 'SUN': color = viz.plants.solar; break;
          case 'WND': color = viz.plants.wind; break;
          case 'GEO': color = viz.plants.geo; break;
          case 'NUC': color = viz.plants.nuclear; break;
          default:
            color =  'rgba(255, 255, 255, 0)';  break;
        }
        draw_power_plant(ctx, xy, color, +d.properties.total_cap);
      }
    });
  // plants_legend(ctx, nff);
};

const draw_ff_plants = function draw_ff_plants(ctx, queued_data) {
  draw_power_plants(ctx, queued_data, false)
};

const draw_nff_plants = function draw_nff_plants(ctx, queued_data) {
  draw_power_plants(ctx, queued_data, true)
};

const draw_power_plant = function draw_power_plant(ctx, xy, color, r) {
  ctx.strokeStyle = viz.plants.stroke.light;
  ctx.lineWidth = viz.plants.stroke.width;
  ctx.fillStyle = color;
  ctx.beginPath();
  draw_circle(ctx, xy, Math.sqrt(r / Math.PI) * viz.plants.scale);
  ctx.fill();
  if (color !== viz.white) {
    if (color === viz.plants.gas ||
        color === viz.plants.solar)
    {
      ctx.strokeStyle = viz.plants.stroke.dark;
    }
    ctx.stroke();
  }
};

