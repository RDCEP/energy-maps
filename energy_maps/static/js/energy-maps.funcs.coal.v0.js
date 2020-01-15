/**
 * @file Provides draw functions and any helpers for coal mines and railroads.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Coal
 */

/**
 * Scale out the radius relative to the desired size
 * @param {Number} r - radius
 */
function setRadius(radius, scale) {
  radius = Math.sqrt(radius / Math.PI) * scale;
  return radius;
}


/**
 * Helper function for draw_coal_mines to draw the pentagon representing the mine.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} xy - Array of xy coordinates 
 * @param {Object} color
 * @param {Number} r - Radius. 
 */
const draw_mine = function draw_mine(ctx, xy, color, r) {
  const NUM_SIDES_MINE = 5;
  r = setRadius(r, viz.mines.scale);
  ctx.strokeStyle = viz.mines.coal.stroke;
  ctx.strokeWidth = viz.mines.coal.width;
  ctx.fillStyle = viz.mines.coal.fill;
  ctx.beginPath();
  draw_polygon(NUM_SIDES_MINE, ctx, r, xy)
  ctx.fill();
  if (r > 8) {
    ctx.stroke();
  }
};

/**
 * Draw coal mines on the coal infrastructure map.
 * @param {Object} ctx - HTML5 canvas context.
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_coal_mines = function draw_coal_mines(ctx, queued_data) {
  console.log('draw_coal_mines');
  // TODO: why tf is this wells? Is this a duplicate of something related to the wells?
  let wells = queued_data[0];

  // Sort in descending order so large mines don't
  // obscure small mines.
  wells.sort(function(a, b) {
    return d3.descending(+a.tot_prod, +b.tot_prod);
  });

  wells.forEach(function(d, i) {
    let xy = projection([+d.lon, +d.lat]);
    if (xy === null) {
      //
    } else {
      // console.log(d.tot_prod);
      draw_mine(ctx, xy, viz.black, +d.tot_prod);
    }
    if (i === wells.length - 1) { hide_spinner(); }
  });

};

/**
 * Draw railroads on the coal infrastructure map.
 * @param {Object} ctx - HTML5 canvas context..
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_railroads = function draw_railroads(ctx, queued_data) {
  console.log('draw_railroads');

  let railroad = queued_data[0];

  const path = get_path(ctx);
  // Gas pipeline
  ctx.strokeStyle = viz.transport.rail.stroke;
  ctx.lineWidth = viz.transport.rail.width;
  ctx.beginPath();
  path(railroad);
  ctx.stroke();
  hide_spinner();

};
