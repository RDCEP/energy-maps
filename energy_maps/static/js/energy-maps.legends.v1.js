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
  // let text_offset = 30 * SCALE; // TODO: Figure out why this was here and reinstate or delete
  for (let i = 0; i < layers.length; ++i) {
    if (layers[i].active) {
      y = layers[i].draw_legend(ctx, x, y); 
      console.log(layers[i])
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
