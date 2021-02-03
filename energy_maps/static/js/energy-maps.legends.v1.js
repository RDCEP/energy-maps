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
const advance_for_type = function advance_for_type(y, ctx, text, text_offset, x) { // TODO: consider taking bite size pieces out of here to make more universal. Maybe object can be passed to handle text & ctx at least
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
const advance_vertical_increment = function advance_vertical_increment(y, ctx, color, lineWidth) { // TODO: consider taking bite size pieces out of here to make more universal. Maybe object can be passed to handle text, color, and ctx at least
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
 * @param {Object[]} layers - An array of objects representing resources
 * to be rendered on top of the map canvas.
 */
const update_legend = function update_legend(tmpctx, ctx, layers) {
  // FIXME: width in globals is now 850.
  legend.hidden = false;
  let x = 32 * SCALE;
  let x_offset = 10 * SCALE;
  let y = 10 * SCALE;

  //NOTE: Reversing layers so that the bottom layer of the map is on the
  // bottom of the legend.
  for (let i = layers.length-1; i >= 0; --i) {
    if (layers[i].active && !(layers[i] instanceof StateBoundary)) {
      y = layers[i].draw_legend(tmpctx, x, y);
    }
  }

  d3.select('.legend.canvas canvas')
    .attr('height', y+20)
    .node().getContext('2d')
    .drawImage(d3.select('.legend.tmpcanvas canvas').node(), 0, 0);
};
