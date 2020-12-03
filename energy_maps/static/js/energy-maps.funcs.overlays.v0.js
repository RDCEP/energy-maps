/**
 * @file Provides draw functions and any helpers for additional
 * miscellaneous overlays.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Overlays
 */

/** 
 * Instatiates a new StateBoundary object that contains properties used
 * to draw state boundary lines to the map.
 * @class
 * @classdesc Used to create objects that represent state boundaries.
 * @extends InfrastructureSet
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render
 * the visualization
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
 * Instatiates a new WindMap object that contains properties used to draw
 * wind capacity contours to the map.
 * @class
 * @classdesc Used to create objects that represent a wind capacity map.
 * @extends InfrastructureSet
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render
 * the visualization
 * @property {String} stroke - rgba value to set the canvas stroke
 * @property {Number} width - width value set relative to SCALE
 */
function WindMap(name, text, value, column, draw, stroke, width) {
  InfrastructureSet.call(this, name, text, value, column, draw);
  this.stroke = stroke;
  this.width = width;
  this.z_index = 0;
}
WindMap.prototype = new InfrastructureSet;

/**
 * Draw state boundaries on the infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_state_boundaries = function draw_state_boundaries(ctx, queued_data) {
  console.log('draw_state_boundaries');

  path.context(ctx);
  let output_geojson = simplify("states-no-overlap", queued_data);

  ctx.strokeStyle = state_boundaries.stroke;
  ctx.lineWidth = state_boundaries.width / transform.k;
  ctx.setLineDash([
    0,
    state_boundaries.width / transform.k * 2
  ]);
  ctx.beginPath();
  path(output_geojson);
  ctx.stroke();
  ctx.setLineDash([]);
  finish_loading_layer();
};

/**
 * Draw wind map contours on the infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_wind_map = function draw_wind_map(ctx, queued_data) {
  console.log('draw_wind_map');

  path.context(ctx);
  let region = new Path2D();
  region.rect(0, 0, width, height);
  ctx.clip(region);

  let output_geojson;
  let presimplified_data = topojson.presimplify(queued_data[0]);
  let wind_map_colors = [
    '#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c']
  let bands = ['<7m/s', '7-8m/s', '8-9m/s', '9-10m/s', '>10m/s']
  ctx.lineWidth = 0;
  for (let i=0; i<bands.length; ++i) {
    output_geojson = topojson.feature(
      topojson.simplify(presimplified_data, .01 / transform.k**2),
      queued_data[0].objects[bands[i]]);
    ctx.fillStyle = wind_map_colors[i];
    ctx.beginPath();
    path(output_geojson);
    ctx.fill();
  }
  finish_loading_layer();
};

/** Draw wind capacity map legend **/
const draw_wind_map_legend = function draw_wind_map_legend(ctx, x, y, dashed) {
  y += VERTICAL_INCREMENT * 1.5;
  //TODO: This is ugly. It duplicates colors and labels from `draw_wind_map()`
  let wind_map_colors = [
    '#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c']
  let bands = ['<7m/s', '7-8m/s', '8-9m/s', '9-10m/s', '>10m/s']
  ctx.lineCap ='butt';
  ctx.lineWidth = 14 * SCALE;
  //TODO: More ugliness. If everything in the legend is going to overhang by
  // by 7 pixels, the marhigins should just be adjusted.
  x -= 7
  for (let i=0; i<bands.length; ++i) {
    ctx.strokeStyle = wind_map_colors[i];
    ctx.beginPath();
    ctx.moveTo(x * SCALE, y);
    ctx.lineTo(x + 50 * SCALE, y);
    ctx.stroke();
    x += 50
    ctx.fill();
  }
  //TODO: Below is messy but the windmap legend is so different from
  // everything else it's not easy to see another way.
  y += VERTICAL_TYPE_INCREMENT * 4;
  ctx.fillStyle = viz.black;
  ctx.font = LEGEND_FONT;
  ctx.textAlign = 'right'
  ctx.fillText(`${bands[bands.length-1]}`, x, y);
  x = (x + text_offset) / 2
  ctx.textAlign = 'center'
  ctx.fillText('Avg. wind speed', x, y);
  x = 0
  ctx.textAlign = 'left'
  ctx.fillText(`${bands[0]}`, text_offset + x, y);
  ctx.linecap = 'round'
  return y;
};

let state_boundaries = new StateBoundary(
  'state-boundaries',
  'State boundaries',
  null,
  'layers',
  [{
    f: draw_state_boundaries,
    src: ['/static/json/states-10m.json'],
    w: d3.json
  }],
  'rgba(54, 54, 54, 1)',
  1.5
);

let wind_map = new WindMap(
  'wind-capacity',
  'Wind capacity',
  null,
  'layers',
  [{
    f: draw_wind_map,
    src: ['/static/json/wind-map/ws-clipped-merged-simplify20.json'],
    w: d3.json
  }],
);
wind_map.draw_legend = draw_wind_map_legend;
