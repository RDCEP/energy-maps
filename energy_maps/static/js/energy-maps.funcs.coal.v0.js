/**
 * @file Provides draw functions and any helpers for coal mines and railroads.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Coal
 */

 /**
  * A collection of coal mine properties used to draw mines to the map and legend.
 * @type {Object} 
 * @property {string} fill - rgba value for mine fill color
 * @property {string} stroke - rgba value for mine stroke color
 * @property {Number} width - sets the width of the mine, bound to global SCALE
 * @property {Number} scale - sets the relative scale of the mine, bound to global SCALE as a fraction of its width
  */
let mine_props = {
  fill: 'rgba(0, 0, 0, 0.5)',
  stroke: 'rgba(255, 255, 255, 1)',
  width: SCALE,
  scale: SCALE / 190
}

/**
 * Helper function for draw_mine() to Scale out the radius relative to the desired size
 * @param {Number} r - starting radius
 * @param {Number} scale - the desired scale value, bound to `viz` object value relative to category.
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
  r = setRadius(r, mine_props.scale);
  ctx.strokeStyle = mine_props.stroke;
  ctx.strokeWidth = mine_props.width;
  ctx.fillStyle = mine_props.fill;
  ctx.beginPath();
  draw_polygon(NUM_SIDES_MINE, ctx, r, xy)
  ctx.fill();
  // TODO: what happens if r <= 8? Is this to filter out points that are so small that they are insignificant?
  if (r > 8) {
    ctx.stroke();
  }
};

/**
 * Draw coal mines on the coal infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas coal-mine"
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_coal_mines = function draw_coal_mines(ctx, queued_data) {
  console.log('draw_coal_mines');
  // TODO: why tf is this wells? Is this a duplicate of something related to the wells?
  let wells = queued_data[0];

  // Sort in descending order so large mines don't
  // obscure small mines. Unary '+' operator used to return the numeric rather
  // than string values to tot_prod
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
    if (i === wells.length - 1) { 
      hide_spinner(); 
    }
  });

};

/**
 * Draw railroads on the coal infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas railroad"
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
