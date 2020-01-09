/**
 * @file Provides global functions and any helpers for the more specialized drawing functions contained in other *.funcs files.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

/**
 * Draw the base map.
 * @param {Object} ctx - HTML5 <canvas> element
 * @param {Object[]} queued_data - Dataset for the corresponding resource
 * @param {Object} border_only
 */
const draw_land = function draw_land(ctx, queued_data, border_only) {
  console.log("draw_land");

  let map_data = queued_data[0];
  let map_fill_data = queued_data[1];
  path.context(ctx);

  if (!border_only) {
    // Sphere
    ctx.fillStyle = viz.map.ocean;
    ctx.beginPath();
    path({ type: "Sphere" });
    ctx.fill();

    // Land boundaries fill
    ctx.fillStyle = viz.map.fill;
    ctx.beginPath();
    path(map_fill_data);
    ctx.fill();
  } else {
    ctx.strokeStyle = viz.map.stroke;
    ctx.lineWidth = viz.map.width;
    ctx.beginPath();
    path(map_data);
    ctx.stroke();
  }
};

/// Primitives

const draw_x = function draw_x(ctx, xy, d) {
  ctx.moveTo(xy[0] - d / 2, xy[1] - d / 2);
  ctx.lineTo(xy[0] + d / 2, xy[1] + d / 2);
  ctx.moveTo(xy[0] - d / 2, xy[1] + d / 2);
  ctx.lineTo(xy[0] + d / 2, xy[1] - d / 2);
};

const draw_circle = function draw_circle(ctx, xy, r) {
  ctx.arc(xy[0], xy[1], r, 0, Math.PI * 2, true);
};

const draw_box = function draw_box(ctx, xy, d) {
  ctx.rect(xy[0] - d / 2, xy[1] - d / 2, d, d);
};

const draw_triangle = function draw_triangle(ctx, xy, d) {
  let e = (d * Math.sqrt(3)) / 3;
  ctx.moveTo(xy[0], xy[1] - e * 2);
  ctx.lineTo(xy[0] + d, xy[1] + e);
  ctx.lineTo(xy[0] - d, xy[1] + e);
  ctx.lineTo(xy[0], xy[1] - e * 2);
};

const draw_triangle_down = function draw_triangle_down(ctx, xy, d) {
  let e = (d * Math.sqrt(3)) / 3;
  ctx.moveTo(xy[0], xy[1] + e * 2);
  ctx.lineTo(xy[0] + d, xy[1] - e);
  ctx.lineTo(xy[0] - d, xy[1] - e);
  ctx.lineTo(xy[0], xy[1] + e * 2);
};

const draw_cross = function draw_cross(ctx, xy, d) {
  ctx.moveTo(xy[0], xy[1] - d / 2);
  ctx.lineTo(xy[0], xy[1] + d / 2);
  ctx.moveTo(xy[0] - d / 2, xy[1]);
  ctx.lineTo(xy[0] + d / 2, xy[1]);
};

/**
 * Draw polygon
 * @param {Number} sides -- number of sides of the polygon
 * @param {Object} ctx 
 * @param {Object} xy
 * @param {Number} r 
 */
const draw_polygon = function draw_polygon(sides, ctx, r, xy) {
  /** @type {Number} 90 degrees in radians, to represent the top of a unit circle*/
  let starting_angle = Math.PI / 2; 
  ctx.moveTo (xy[0] + r * Math.cos(starting_angle), xy[1] + r * Math.sin(starting_angle)); 
  for (let i = 1; i <= sides; ++i) { 
    ctx.lineTo (xy[0] + r * Math.cos(starting_angle + i * 2 * Math.PI / sides),
      xy[1] + r * Math.sin(starting_angle + i * 2 * Math.PI / sides));
  }
}

// const toggle_layer = function toggle_layer(layer) {
//   // Select all check boxes
//   d3.selectAll(".checkbox");
//   // if check box value equal to @param layer,
//   // toggle layer on/off
// };

d3.select('.about-contact').on('click', () => {
  d3.select('.modal-screen').style('display', 'block');
  d3.select('.modal-window.about-window').style('display', 'block');
});
d3.select('.modal-close').on('click', function() {
  d3.select(this.parentNode).style('display', 'none');
  d3.select('.modal-screen').style('display', 'none');
});