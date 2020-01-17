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
 * @description Global page width, set to some multiple of `SCALE`
 */
let width = 1200 * SCALE;

/**
 * @type {number} 
 * @description Global page height, set to some fraction of `width`
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
  gas: 'rgba(0, 191, 255)',
  oil: 'rgba(34, 139, 34)',
  coal: 'rgba(0, 0, 0)',
  wells: {
    gas: 'rgba(0, 191, 255, .5)',
    oil: 'rgba(34, 139, 34, .5)',
    off: 'rgba(34, 139, 34)',
    width: SCALE / 6,
    cross: 5 * SCALE,
    diameter: SCALE / 2,
    stroke: SCALE,
  },
  process: {
    oil_refinery: {
      fill: 'rgba(60, 179, 113, .7)',
      size: .006 * SCALE 
      // vvv Old scale vvv
      // size: .015 * SCALE
    },
    gas_storage: {
      fill: 'rgb(45, 45, 45, .9)',
      size: 5 * SCALE
    },
    gas_process: {
      fill: 'rgba(0, 0, 139, .5)',
      size: 1.5 * SCALE
      // vvv Old scale vvv
      // size: 4 * SCALE
    },
    stroke: {
      light: 'rgba(255, 255, 255, 1)',
      width: SCALE * .75
    }
  },
  transport: {
    gas: {
      stroke: 'rgba(0, 191, 255, .5)',
      width: 1.8 * SCALE
    },
    oil: {
      stroke: '#3CB371',
      width: 1.5 * SCALE
    },
    oil_product: {
      stroke: '#3CB371',
      width: 2 * SCALE,
      dash: 2.5 * SCALE
    },
  },
  map: {
    fill: '#dddddd',
    stroke: '#767676',
    ocean: '#ffffff',
    width: SCALE
  }

};

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