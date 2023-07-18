/**
 * @file Provides draw functions and any helpers for the map legend.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Legends
 */

 // TODO: Factor out repetitive behavior
 
 // TODO: Document functions

EnergyMaps = (function (energy_maps, InfrastructureSet) {

  'use strict';

  /**
   * @type {Object}
   * @description HTML5 canvas for the application legend
   * @memberof Init
   */
  const legend_canvas = d3
    .select('.legend-canvas')
    .append('canvas')
    .attr('width', 400)
    .attr('height', 0);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */
  let legend_ctx = legend_canvas.node().getContext('2d');
  legend_ctx.lineCap = 'round';

  const legend_tmpcanvas = d3
    .select('.legend-tmpcanvas')
    .append('canvas')
    .attr('width', 400)
    .attr('height', 1000);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */
  let tmplegend_ctx = legend_tmpcanvas.node().getContext('2d');
  tmplegend_ctx.lineCap = 'round';

  /**
   * Advance vertical increment for legend type (text display)
   * @param {Number} y - y axis
   * @param {Object} ctx - HTML5 canvas context
   * @param {string} text - the text to be displayed
   * @param {Number} text_offset - ?
   * @param {Number} x - x axis
   * @returns {Number} y - updated y axis
   */
  const advance_for_type = function advance_for_type
    (y, ctx, text, text_offset, x)
  { // TODO: consider taking bite size pieces out of here to make more universal. Maybe object can be passed to handle text & ctx at least
    y += VERTICAL_TYPE_INCREMENT;
    ctx.fillStyle = VIZ.black;
    ctx.font = LEGEND_FONT;
    ctx.fillText(`${text}`, text_offset + x, y);
    return y;
  };

  /**
   * Advance vertical increment for legend symbol
   * @param {Number} y - y axis
   * @param {Object} ctx - HTML5 canvas context
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   * @param {string} lineWidth - symbol lineWidth, bound to `viz` object (some still loosely implemented)
   * @returns {Number} y - updated y axis
   */
  const advance_vertical_increment = function advance_vertical_increment
    (y, ctx, color, lineWidth)
  { // TODO: consider taking bite size pieces out of here to make more universal. Maybe object can be passed to handle text, color, and ctx at least
    y += VERTICAL_INCREMENT;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = color;
    ctx.beginPath();
    return y;
  };

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
  const update_legend = function update_legend
    (tmp_ctx, ctx, layers)
  {
    // FIXME: width in globals is now 850.
    energy_maps.legend.hidden = false;
    let x = 32 * SCALE;
    let x_offset = 10 * SCALE;
    let y = 10 * SCALE;

    //NOTE: Reversing layers so that the bottom layer of the map is on the
    // bottom of the legend.
    // for (let i = layers.length-1; i >= 0; --i) {
    //   if (layers[i].active && !(layers[i] instanceof StateBoundary)) {
    //     y = layers[i].draw_legend(tmpctx, x, y);
    //   }
    // }

    // previous was less optimized
    for (let i = ACTIVE_LAYERS.length-1; i >= 0; --i) {
      // if (!(ACTIVE_LAYERS[i] instanceof StateBoundary)) {
      if (!(ACTIVE_LAYERS[i].name === 'state-boundaries')) {
        y = ACTIVE_LAYERS[i].draw_legend(tmp_ctx, x, y);
      }
    }

    d3.select('.legend-canvas canvas')
      .attr('height', y+20)
      .node().getContext('2d')
      .drawImage(d3.select('.legend-tmpcanvas canvas').node(), 0, 0);

  };

  energy_maps.legend_ctx = legend_ctx;
  energy_maps.tmplegend_ctx = tmplegend_ctx;
  energy_maps.advance_for_type = advance_for_type;
  energy_maps.advance_vertical_increment = advance_vertical_increment;
  energy_maps.update_legend = update_legend;

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);