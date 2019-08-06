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

// const toggle_layer = function toggle_layer(layer) {
//   // Select all check boxes
//   d3.selectAll(".checkbox");
//   // if check box value equal to @param layer,
//   // toggle layer on/off
// };
