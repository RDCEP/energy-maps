/**
 * @file Provides global variables for the application.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

const fill_screen = false;

// vvv Original width and scale definitions vvv
// let width = 2000 * SCALE;

// if (!SCALE) {
//   width = screen.width;
//   SCALE = width / 2000;
// }
// ^^^ end original width and scale definitions ^^^

// alter the width variable below to change the scale of the map
// if you need to make UI adjustments

SCALE = 1;

/**
 * @type {number} 
 * @description Device pixel ratio, used to scale our canvas with
 * clarity relative to the user's device.
 */
let dpi = window.devicePixelRatio;

/**
 * @type {number} 
 * @description Map width, set to some multiple of `SCALE`
 */
let width = window.innerWidth * SCALE;
// let width = 1200 * SCALE; // Note: you can't adjust this value without
                          // significantly effecting legends.

/**
 * @type {number} 
 * @description Map height, set to some fraction of `width`
 */
const height = window.innerHeight;

/**
 * @type {Object} 
 * @description Global page padding
 */
const padding = {top: 10, right: 10, bottom: 50, left: 50};

/**
 * @type {number} 
 * @description Global canvas width, set to some multiple of the sum of `width` and `scale`
 */
const canvas_width = width + SCALE * 400;

let text_offset = 30 * SCALE;

/**
 * @type {Object} 
 * @description A collection of nested objects containing color and scaling properties per resource 
 */
const viz = {
  white: 'rgba(255, 255, 255, 1)',
  black: 'rgba(0, 0, 0, 1)',
  coal: 'rgba(0, 0, 0)',
  map: {
    fill: '#dddddd',
    stroke: '#767676',
    ocean: '#ffffff',
    width: SCALE
  }

};

/** 
 * Instantiates a new generic object that contains properties used to draw infrastructure data to the map and legend.
 * @class
 * @classdesc Base class that allows derived classes to create objects that represent data sets for specific types of infrastructure.
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render the visualization
 */
function InfrastructureSet(name, text, value, column, draw) {
  this.name = name || '';
  this.text = text || '';
  this.value = value || 0;
  this.column = column || '';
  this.z_index = 0;
  this.draw = draw || [{
      f: '',
      src: '',
      w: ''
  }];
}

/** 
 * Instantiates a user interface object that allows you to create a new map.
 * @class
 * @classdesc Base class that allows derived classes to create objects that represent data sets for specific types of infrastructure.
 * @param {Object} map - a map projection on a canvas object? that's probably what this should return... TBD
 * @param {Number} columns - Number of columns rendered to the menu... TBD
 * @param {Object} toggle - checkboxes or something... TBD
 */
function MapBuilderUI(map, columns, toggle) { //TODO: Actually make this a real thing
  this.map = map;
  this.columns = columns;
  this.toggle = toggle;

  function initMenu() {

  }

  function initMenuColumns() {
    
  }

  function initMenuChkbx() {

  }

  function initMenuChkbxLabels() {

  }

  function initMenuAssetValue() {

  }

  function initMenuItm() {

  }

}

// create projection and path objects with which to draw geo objects
let content_width = +d3.select('main .content-wrap').style('width').slice(0, -2);  // width of content area in center of screen
let header_height = +d3.select('header').style('height').slice(0, -2);  // height of header area
let projection_scale =  content_width * 1.2;  // scale to fill content area
let projection_width = width / 2;
let projection_height = header_height + projection_width / 2 - 50;  // place map below header

/**
 * @description D3 geoAlbersUsa projection object set to custom scale and translation offset
//  */
// let projection = d3.geoAlbersUsa()
//   .scale(width*1.1)
//   .translate([width / 2.4, height / 2]);
let projection = d3.geoAlbersUsa()
  .scale(projection_scale)
  .translate([projection_width, projection_height]);

/**
 * D3 geoPath object -- a geographic path generator based off of the `projection` geoAlbersUsa() object
 */
const path = d3.geoPath()
  .projection(projection)
  .pointRadius(2);

/**
 * @param {Object} ctx - HTML5 canvas context
 * @returns {d3.geoPath} geographic path generator for the supplied ctx 
 */
const get_path = function get_path(ctx) {
  return d3.geoPath()
    .projection(projection)
    .pointRadius(2)
    .context(ctx);
};

const spinner = document.getElementById('spinner');
const show_spinner = function show_spinner() {
  spinner.style.display = "block";
};
const hide_spinner = function hide_spinner() {
    spinner.style.display = "none";
  };

/**
 * Helper function for pipes and railroad
 * @param {Object} ctx - HTML5 canvas context
 * @param {Number} x - x axis
 * @param {Number} y - y axis
 * @param {Object} obj - Transport or Railroad object 
 * @param {boolean} dashed - true if line should be dashed, false if solid
 * @param {string} text - the text for the layer written to the legend
 * @param {string} inf - a flag to determine the corresponding infrastructure (pipelines or railroads) 
 * @returns {Number} y - updated y axis
 */
const draw_line = function draw_line(ctx, x, y, obj, dashed = false, text) {
  
  y += VERTICAL_INCREMENT;
  
  // TODO: Implement product pipelines. They will need a dashed line. 
  if (dashed) {
    ctx.setLineDash(dashed);
  }

  ctx.beginPath();
  ctx.moveTo(x - 7 * SCALE, y);
  ctx.lineTo(x + 7 * SCALE, y);
  ctx.strokeStyle = obj.stroke;
  ctx.stroke();

  y = advance_for_type(y, ctx, text, text_offset, x);
  return y;
}