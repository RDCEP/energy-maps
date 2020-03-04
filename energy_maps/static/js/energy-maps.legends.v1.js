/**
 * @file Provides draw functions and any helpers for the map legend.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Legends
 */

 // TODO: Factor out repetitive behavior
 
 // TODO: Document functions

const LEGEND_FONT_SIZE = 14 * SCALE;
const LEGEND_FONT = `bold ${LEGEND_FONT_SIZE}px Arial`;
const VERTICAL_INCREMENT = 15 * SCALE;
const VERTICAL_TYPE_INCREMENT = 5 * SCALE;

/**
 * Advance vertical increment for legend type (text display)
 * @param {Number} y - y axis
 * @param {Object} ctx - HTML5 canvas context
 * @param {string} text - the text to be displayed
 * @param {Number} text_offset - ?
 * @param {Number} x - x axis
 * @returns {Number} y - updated y axis
 */
function advance_for_type(y, ctx, text, text_offset, x) { // TODO: consider taking bite size pieces out of here to make more universal. Maybe object can be passed to handle text & ctx at least
  y += VERTICAL_TYPE_INCREMENT;
  ctx.fillStyle = viz.black;
  ctx.font = LEGEND_FONT;
  ctx.fillText(`${text}`, text_offset + x, y);
  return y;
}

/**
 * Advance vertical increment for legend symbol
 * @param {Number} y - y axis
 * @param {Object} ctx - HTML5 canvas context
 * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
 * @param {string} lineWidth - symbol lineWidth, bound to `viz` object (some still loosely implemented)
 * @returns {Number} y - updated y axis
 */
function advance_vertical_increment(y, ctx, color, lineWidth) { // TODO: consider taking bite size pieces out of here to make more universal. Maybe object can be passed to handle text, color, and ctx at least
  y += VERTICAL_INCREMENT;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;
  ctx.beginPath();
  return y;
}

/**
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   * @param {string} text - the text for the layer written to the legend
   */

/**
 * Update the entire legend. Call each relevant draw function and render them in the appropriate order
 * @param {Object} ctx - HTML5 canvas context
 * @param {Object[]} layers - An array of objects representing resources to be rendered on top of the map canvas.
 */
const update_legend = function update_legend(ctx, layers) {
  // FIXME: width in globals is now 850.
  let x = 950 * SCALE;
  let x_offset = 10 * SCALE;
  let y = 200 * SCALE;
  // Offset for text
  let text_offset = 30 * SCALE;

  // Consider using Function.prototype.bind() to bind ctx, x, and y to the object's properties (draw function with params for stroke and width)
  for (let i = 0; i < layers.length; ++i) {
    if (layers[i].active) { 
      switch (layers[i].name) {
        case 'oil-well':
          y = draw_well_legend(ctx, x, y, oil_well);
          break;
        case 'gas-well':
          console.log('gas-well switch');
          y = draw_well_legend(ctx, x, y, gas_well);
          break;
        case 'gas-pipeline':
          y = draw_pipeline_legend(ctx, x, y, gas_pipeline);
          break;
        case 'oil-pipeline':          
          y = draw_pipeline_legend(ctx, x, y, oil_pipeline);
          break;
        case 'oil-refinery':
          y = draw_refinery_legend(ctx, x, y, oil_refinery);
          break;
        case 'railroad':;
          y = draw_railroad_legend(ctx, x, y, railroad);
          break;
        case 'coal-mine':
          y = draw_coalmine_legend(ctx, x, y, coal_mine);
          break;
        case 'coal-plant':
          y = draw_power_plant_legend(ctx, x, y, coal_plants);
          break;
        case 'geothermal-plant':
          y = draw_power_plant_legend(ctx, x, y, geo_plants);
          break;
        case 'hydro-plant':
          y = draw_power_plant_legend(ctx, x, y, hyc_plants);
          break;
        case 'natural-gas-plant':
          y = draw_power_plant_legend(ctx, x, y, ng_plants);
          break;
        case 'nuclear-plant':
          y = draw_power_plant_legend(ctx, x, y, nuc_plants);
          break;
        case 'petroleum-plant':
          y = draw_power_plant_legend(ctx, x, y, pet_plants);
          break;
        case 'solar-PV':
          y = draw_power_plant_legend(ctx, x, y, solar_plants);
          break;
        case 'wind-farms':
          y = draw_power_plant_legend(ctx, x, y, wnd_farms);
          break;
        case 'AC-lines-under-100-kV':
          y = draw_grid_ac_legend(ctx, x, y, ac_na);
          console.log(y)
          y = draw_grid_ac_legend(ctx, x, y, ac_under_100);
          break;
        case 'AC-lines-100-to-300-kV':
          y = draw_grid_ac_legend(ctx, x, y, ac_100_200);
          y = draw_grid_ac_legend(ctx, x, y, ac_200_300);
          break;
        case 'AC-lines-345-to-735-kV':
          y = draw_grid_ac_legend(ctx, x, y, ac_345);
          y = draw_grid_ac_legend(ctx, x, y, ac_500);
          y = draw_grid_ac_legend(ctx, x, y, ac_735_plus);
          break;
        case 'DC-lines':
          y = draw_grid_dc_legend(ctx, x, y, dc);
          break;
        case 'gas-processing':
          y = draw_processing_legend(ctx, x, y, gas_processing);
          break;
        case 'gas-storage':
          y = draw_storage_legend(ctx, x, y, oil_and_gas.processing.gas_storage);
          break;
        default:
          break;
      }
    }
  }

  let draw_plants_legend = layers.filter(function(d) { // TODO: Do we still need this? What is it doing?
    return ["coal-plant", "geothermal-plant", "hydro-plant",
    "natural-gas-plant", "nuclear-plant", "petroleum-plant",
    "solar-PV", "wind-farms",].indexOf(d[0]) > -1;
  }).length > 0;
  if (draw_plants_legend) {
    // draw_circle(ctx, xy, Math.sqrt(r / Math.PI) * electricity_generation.scale);
    // y +=
  }

};
