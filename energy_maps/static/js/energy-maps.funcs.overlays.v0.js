/**
 * @file Provides draw functions and any helpers for additional miscellaneous overlays.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Overlays
 */

/** 
 * Instatiates a new StateBoundary object that contains properties used to draw state boundary lines to the map.
 * @class
 * @classdesc Used to create objects that represent state boundaries.
 * @extends InfrastructureSet
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render the visualization
 * @property {String} stroke - rgba value to set the canvas stroke
 * @property {Number} width - width value set relative to SCALE
 */
function StateBoundary(name, text, value, column, draw, stroke, width) {
    InfrastructureSet.call(this, name, text, value, column, draw);
    this.stroke = stroke;
    this.width = width;
    this.z_index = 0;
  }
  StateBoundary.prototype = new InfrastructureSet;

/**
 * Draw railroads on the coal infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas railroad"
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_state_boundaries = function draw_state_boundaries(ctx, queued_data) {
    console.log('draw_state_boundaries');
  
    path.context(ctx);
    output_geojson = simplify("states", queued_data);
  
    ctx.strokeStyle = state_boundaries.stroke;
    ctx.lineWidth = state_boundaries.width;
    ctx.beginPath();
    path(output_geojson);
    ctx.stroke();
    hide_spinner();
  };

  let state_boundaries = new StateBoundary('state-boundaries', 'State boundaries', 0, 'layers', [{
    f: draw_state_boundaries,
    src: ['/static/json/states-10m.json'],
    w: d3.json
  }], 'rgba(68, 108, 179, 1)', 1.5);
