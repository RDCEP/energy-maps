/**
 * @file Provides global variables for the application.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

const fill_screen = false;

const API_URL_PREFIX = 'http://127.0.0.1:5000/api/v0.1.0/infrastructure'

/**
 * @type {number}
 * @description Originally used for scaling static print-based maps.
 * Currently unused.
 */
SCALE = 1;

/**
 * @type {number}
 * @description The year value to determine data loaded by the application.
 */
let data_year = 2012;

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

/**
 * @type {number} 
 * @description Map height, set to some fraction of `width`
 */
let height = window.innerHeight;

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

/**
 * @type {number}
 * @description Distance to inset text from the left edge of the legend.
 * Carves out room for legend symbols, while keeping text aligned.
 */
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
 * Instantiates a new generic object that contains properties used to draw
 * infrastructure data to the map and legend.
 * @class
 * @classdesc Base class that allows derived classes to create objects that
 * represent data sets for specific types of infrastructure.
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw_props - properties used to parse the data and render
 * the visualization
 */
function InfrastructureSet(name, text, value, column, draw_props) {
  this.name = name || '';
  this.text = text || '';
  this.value = value || 0;
  this.column = column || '';
  this.z_index = 0;
  this.draw_props = draw_props || [{
    draw_layer:'',
    src: '',
    d3_fetch:''
  }] || {
    draw_layer:'',
    src: '',
    d3_fetch:''
  }
}

/** 
 * Instantiates a user interface object that allows you to create a new map.
 * @class
 * @classdesc Base class that allows derived classes to create objects that
 * represent data sets for specific types of infrastructure.
 * @param {Object} map - a map projection on a canvas object? that's
 * probably what this should return... TBD
 * @param {Number} columns - Number of columns rendered to the menu... TBD
 * @param {Object} toggle - checkboxes or something... TBD
 */
//TODO: Actually make this a real thing
function MapBuilderUI(map, columns, toggle) {
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
// Kludge for pan/zoom. Can't make JSON call during pan/zoom.
let simple_map_bkgd = null;

/**
 * @description A JavaScript object with `number` values that represent transform properties. Pan/zoom kludge. TODO: Track transform globally. 
 */
let transform = {x:0, y:0, k:1};

/**
 * @description Width of content area in center of screen stored as a `number`.
 */
let content_width = d3.select('main .content-wrap').node().offsetWidth;

/**
 * @description Height of site header area stored as a `number`.
 */
let header_height = d3.select('header').node().offsetHeight;

/**
 * @description Map projection scale to fill content area.
 */
let projection_scale =  content_width * 1.2;

// Possible option -- Looks good on small laptop but terrible on monitors: let projection_scale =  content_width * 0.7;
let projection_width = width / 2;
let projection_height = projection_width / 2 + header_height

/**
 * @description For tracking the value of transform.k to improve performance of simplification algorithms.
 */
let k_changed = false;

/**
 * @description D3 geoAlbersUsa projection object set to custom scale
 * and translation offset
**/
let projection = d3.geoAlbersUsa()
  .scale(projection_scale)
  .translate([
    projection_width,
    // Half the width is the height, half of that gets us to the center, and
    // add the height of the header so that maps sits below it.
    // Then subtract a random and pointless amount because we've been
    // told to and are bone-fucking-tired.
    projection_scale / 4 + header_height - 30
  ]);

path2D = new Path2D();

/**
 * D3 geoPath object -- a geographic path generator based off of the `projection` geoAlbersUsa() object
 */
const path = d3.geoPath()
  .projection(projection)
  .pointRadius(2)
  .context(path2D);

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

/**
 * @type {HTMLElement}
 * @description Spinner element that appears while layers are loading.
 */
const spinner = document.getElementById('spinner');
const show_spinner = function show_spinner() {
  spinner.style.display = 'block';
};
const hide_spinner = function hide_spinner() {
  spinner.style.display = 'none';
};
let processing_layers = 0;
/**
 * @description Show the spinner and queue the layer for processing
 */
const start_loading_layer = function start_loading_layer() {
  show_spinner();
  processing_layers++;
};
const finish_loading_layer = function finish_loading_layer() {
  processing_layers--;
  if (processing_layers <= 0) {
    processing_layers = 0;
    hide_spinner();
  }
};

let active_layers = [];
let legend = document.getElementsByClassName('legend window main menu')[0];

/**
 * Helper function for pipeline and railroad legend symbols
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
