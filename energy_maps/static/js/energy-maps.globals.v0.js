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

// alter the width variable below to change the scale of the map if you need to make UI adjustments

SCALE = 1;

/**
 * @type {number} 
 * @description Map width, set to some multiple of `SCALE`
 */
let width = 1200 * SCALE;

/**
 * @type {number} 
 * @description Map height, set to some fraction of `width`
 */
const height = width / 2;

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
  this.draw = draw || [{
      f: '',
      src: '',
      w: ''
  }];
}

// create projection and path objects with which to draw geo objects

/**
 * @description D3 geoAlbersUsa projection object set to custom scale and translation offset
 */
const projection = d3.geoAlbersUsa()
  .scale(width*1.1)
  .translate([width / 2.4, height / 2]);

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