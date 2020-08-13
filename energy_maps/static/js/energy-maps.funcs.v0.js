/**
 * @file Provides global functions and any helpers for the more specialized drawing functions contained in other *.funcs files.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

const transform_layer = function transform_layer(ctx) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.translate(transform.x, transform.y);
  ctx.scale(transform.k, transform.k) 
}

const simplify = function simplify(key, data) {
  let output_geojson;
  let presimplified_data = topojson.presimplify(data[0]);
  output_geojson = topojson.feature(
    topojson.simplify(presimplified_data, .01 / transform.k**2),
    data[0].objects[key]);
  return output_geojson;
}

/**
 * Draw the base map.
 * @param {Object} ctx - HTML5 canvas context.
 * @param {Object[]} queued_data - Dataset for the corresponding resource
 * @param {Object} border_only
 * @param {Boolean} simple
 */
const draw_land = function draw_land(ctx, queued_data,
                                     border_only,
                                     simple) {
  console.log('draw_land');

  transform_layer(ctx);

  path.context(ctx);
  let output_geojson;

  if (!simple) {
    let presimplified_data = topojson.presimplify(queued_data[0]);

    // Scale map detail based on zoom level
    output_geojson = topojson.feature(
      topojson.simplify(presimplified_data, .01 / transform.k**2),
      queued_data[0].objects.nation)

    // If no simple_map_bkgd object exists, make a low resolution
    // map to us as simple_map_bkgd
    if (!simple_map_bkgd) {
      simple_map_bkgd = topojson.feature(
        topojson.simplify(presimplified_data,.2),
        queued_data[0].objects.nation);
    }

  } else {

    // If simple is True, we're looking only for a low res map so return
    // simple_map_bkgd. This is used for pan/zoom.
    output_geojson = simple_map_bkgd;

  }

  if (!border_only) {

    // Land boundaries fill
    ctx.fillStyle = viz.map.fill;
    ctx.beginPath();
    path(output_geojson);
    ctx.fill();
  } else {
    ctx.strokeStyle = viz.map.stroke;
    ctx.lineWidth = viz.map.width;
    ctx.beginPath();
    path(output_geojson);
    ctx.stroke();
  }

  //;

};

/// Primitives

/**
 * Draw an 'x' to the desired canvas context 
 * @param {Object} ctx - HTML5 canvas context.
 * @param {Array} xy - Array of xy coordinates 
 * @param {Number} d - ??? 
 */
const draw_x = function draw_x(ctx, xy, d) {
  ctx.moveTo(xy[0] - d / 2, xy[1] - d / 2);
  ctx.lineTo(xy[0] + d / 2, xy[1] + d / 2);
  ctx.moveTo(xy[0] - d / 2, xy[1] + d / 2);
  ctx.lineTo(xy[0] + d / 2, xy[1] - d / 2);
};

/**
 * Draw a circle to the desired canvas context 
 * @param {Object} ctx - HTML5 canvas context.
 * @param {Array} xy - Array of xy coordinates 
 * @param {Number} r - radius 
 */
const draw_circle = function draw_circle(ctx, xy, r) {
  ctx.arc(xy[0], xy[1], r, 0, Math.PI * 2, true);
};

/**
 * Draw a box to the desired canvas context 
 * @param {Object} ctx - HTML5 canvas context.
 * @param {Array} xy - Array of xy coordinates 
 * @param {Number} d - ??? 
 */
const draw_box = function draw_box(ctx, xy, d) {
  ctx.rect(xy[0] - d / 2, xy[1] - d / 2, d, d);
};

/**
 * Draw a triangle to the desired canvas context 
 * @param {Object} ctx - HTML5 canvas context.
 * @param {Array} xy - Array of xy coordinates 
 * @param {Number} d - ??? 
 */
const draw_triangle = function draw_triangle(ctx, xy, d) {
  let e = (d * Math.sqrt(3)) / 3;
  ctx.moveTo(xy[0], xy[1] - e * 2);
  ctx.lineTo(xy[0] + d, xy[1] + e);
  ctx.lineTo(xy[0] - d, xy[1] + e);
  ctx.lineTo(xy[0], xy[1] - e * 2);
};

/**
 * Draw a downward facing triangle to the desired canvas context 
 * @param {Object} ctx - HTML5 canvas context.
 * @param {Array} xy - Array of xy coordinates 
 * @param {Number} d - ??? 
 */
const draw_triangle_down = function draw_triangle_down(ctx, xy, d) {
  let e = (d * Math.sqrt(3)) / 3;
  ctx.moveTo(xy[0], xy[1] + e * 2);
  ctx.lineTo(xy[0] + d, xy[1] - e);
  ctx.lineTo(xy[0] - d, xy[1] - e);
  ctx.lineTo(xy[0], xy[1] + e * 2);
};

/**
 * Draw a cross to the desired canvas context 
 * @param {Object} ctx - HTML5 canvas context.
 * @param {Array} xy - Array of xy coordinates 
 * @param {Number} d - ??? 
 */
const draw_cross = function draw_cross(ctx, xy, d) {
  ctx.moveTo(xy[0], xy[1] - d / 2);
  ctx.lineTo(xy[0], xy[1] + d / 2);
  ctx.moveTo(xy[0] - d / 2, xy[1]);
  ctx.lineTo(xy[0] + d / 2, xy[1]);
};

/**
 * Draw a polygon to the desired canvas context with a variable number of sides
 * @param {Number} sides - number of sides of the polygon
 * @param {Object} ctx - HTML5 canvas context.
 * @param {Array} xy - Array of xy coordinates 
 * @param {Number} r - radius
 */
const draw_polygon = function draw_polygon(sides, ctx, r, xy) {
  /** @type {Number} 
   * @description 90 degrees in radians, to represent the top of a unit circle*/
  let starting_angle = Math.PI / 2; 
  ctx.moveTo (xy[0] + r * Math.cos(starting_angle), xy[1] + r * Math.sin(starting_angle)); 
  for (let i = 1; i <= sides; ++i) { 
    ctx.lineTo (xy[0] + r * Math.cos(starting_angle + i * 2 * Math.PI / sides),
      xy[1] + r * Math.sin(starting_angle + i * 2 * Math.PI / sides));
  }
}

d3.select('.about-contact').on('click', () => {
  d3.select('.modal-screen').style('display', 'block');
  d3.select('.modal-window.about-window').style('display', 'block');
});
d3.select('.modal-close').on('click', function() {
  d3.select(this.parentNode).style('display', 'none');
  d3.select('.modal-screen').style('display', 'none');
});