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

const legend_window = d3.select('.main.legend');
const legend_menu = d3.select('.menu.legend');

console.log(legend_window)

const legend_drag_started = function legend_drag_started() {

  d3.event.on('drag', dragged).on('end', ended);

  function dragged() {
    legend_menu
      .style('right', `${
        parseInt(legend_window.style('right'), 10) - d3.event.dx}px`)
      .style('top', `${
        parseInt(legend_window.style('top'), 10) + d3.event.dy}px`);
  }

  function ended() {
    //
  }
}

legend_menu
  // Set horizontal position on page load.
  // Screen width - width of .content-wrap + 100 extra pixels
  .style('right', `${(width-1200)/2+100}px`)
  // Set vertical position on page load.
  .style('top', '300px')
  .call(d3.drag().on('start', legend_drag_started));

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
 * Update the entire legend. Call each relevant draw function and
 * render them in the appropriate order. Legend is drawn to the hidden
 * tmpctx context so that the height can be calculated before the legend
 * is then copied to the visible context.
 * @param {Object} tmpctx - HTML5 canvas context
 * @param {Object} ctx - HTML5 canvas context
 * @param {Object[]} layers - An array of objects representing resources to be rendered on top of the map canvas.
 */
const update_legend = function update_legend(tmpctx, ctx, layers) {
  // FIXME: width in globals is now 850.
  console.log('update_lend:', layers)
  let x = 32 * SCALE;
  let x_offset = 10 * SCALE;
  let y = 10 * SCALE;
  // Offset for text
  // let text_offset = 30 * SCALE; // TODO: Figure out why this was here and reinstate or delete
  for (let i = 0; i < layers.length; ++i) {
    if (layers[i].active) {
      y = layers[i].draw_legend(tmpctx, x, y);
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
  d3.select('.legend.canvas canvas')
    .attr('height', y+20)
    .node().getContext('2d')
    .drawImage(d3.select('.legend.tmpcanvas canvas').node(), 0, 0);

};
