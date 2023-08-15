/**
 * @file Provides draw functions and any helpers for the map legend.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Legends
 */

 // TODO: Factor out repetitive behavior
 
 // TODO: Document functions

EnergyMaps = (function (EnergyMaps) {

  'use strict';

  // const legend = document.getElementsByClassName('legend window main menu')[0];
  const legend = d3.select('.legend');

  /**
   * @type {Object}
   * @description HTML5 canvas for the application legend
   * @memberof Init
   */
  const legendCanvas = d3
    .select('.legend-canvas')
    .append('canvas')
    .attr('width', 400)
    .attr('height', 0);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */
  let legendCtx = legendCanvas.node().getContext('2d');
  legendCtx.lineCap = 'round';

  const legendTmpCanvas = d3
    .select('.legend-tmpcanvas')
    .append('canvas')
    .attr('width', 400)
    .attr('height', 1000);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */
  let legendTmpCtx = legendTmpCanvas.node().getContext('2d');
  legendTmpCtx.lineCap = 'round';

  /**
   * Convert rems to pixels (based on user's settings)
   * @param {Number} rem - rems to convert
   * @returns {Number} - pixels equal to rems
   */
  const _remToPx = function _remToPx
    (rem)
  {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  /**
   * Advance vertical increment for legend type (text display)
   * @param {Number} y - y axis
   * @param {Object} ctx - HTML5 canvas context
   * @param {string} text - the text to be displayed
   * @param {Number} textOffset - ?
   * @param {Number} x - x axis
   * @returns {Number} y - updated y axis
   */
  const advanceForType = function advanceForType
    (y, ctx, text, textOffset, x)
  { // TODO: consider taking bite size pieces out of here to make more universal. Maybe object can be passed to handle text & ctx at least
    y += VERTICAL_TYPE_INCREMENT;
    ctx.fillStyle = VIZ.black;
    ctx.font = LEGEND_FONT;
    ctx.fillText(`${text}`, textOffset + x, y);
    return y;
  };

  /**
   * Advance vertical increment for legend symbol
   * @param {Number} y - y axis
   * @param {Object} ctx - HTML5 canvas context
   * @param {string} color - symbol color, bound to `VIZ` object (some still loosely implemented)
   * @param {string} lineWidth - symbol lineWidth, bound to `VIZ` object (some still loosely implemented)
   * @returns {Number} y - updated y axis
   */
  const advanceVerticalIncrement = function advanceVerticalIncrement
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
     * @param {string} color - symbol color, bound to `VIZ` object (some still loosely implemented)
     * @param {string} text - the text for the layer written to the legend
     */

  /**
   * Update the entire legend. Call each relevant draw function and
   * render them in the appropriate order. Legend is drawn to the hidden
   * tmpCtx context so that the height can be calculated before the legend
   * is then copied to the visible context.
   * @param {Object} tmpCtx - HTML5 canvas context
   * @param {Object} ctx - HTML5 canvas context
   * @param {Object[]} layers - An array of objects representing resources
   * to be rendered on top of the map canvas.
   */
  const updateLegend = function updateLegend
    (tmpCtx, ctx, layers)
  {
    // FIXME: width in globals is now 850.
    legend.property('hidden', false);
    let x = 32 * SCALE;
    let xOffset = 10 * SCALE;
    let y = 10 * SCALE;

    // NOTE: Reversing layers so that the bottom layer of the map is on the
    for (let i = ACTIVE_LAYERS.length-1; i >= 0; --i) {
      // if (!(ACTIVE_LAYERS[i] instanceof StateBoundary)) {
      if (!(ACTIVE_LAYERS[i].name === 'state-boundaries')) {
        y = ACTIVE_LAYERS[i].drawLegend(tmpCtx, x, y);
      }
    }

    d3.select('.legend-canvas canvas')
      .attr('height', y+20)
      .node().getContext('2d')
      .drawImage(d3.select('.legend-tmpcanvas canvas').node(), 0, 0);

  };

  EnergyMaps.legend = legend;
  EnergyMaps.legendCtx = legendCtx;
  EnergyMaps.legendTmpCtx = legendTmpCtx;
  EnergyMaps.advanceForType = advanceForType;
  EnergyMaps.advanceVerticalIncrement = advanceVerticalIncrement;
  EnergyMaps.updateLegend = updateLegend;

  return EnergyMaps;

})(EnergyMaps || {});