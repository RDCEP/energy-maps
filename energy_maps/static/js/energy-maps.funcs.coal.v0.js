
/**
 * @typedef {Object} coal_mine
 * @property {String} tot_prod - Total annual production in short tons.
 * @property {String} lat - Latitude
 * @property {String} lon - Longitude
 */

/**
 * Draw railroads on the coal infrastructure map.
 * @param {Object} ctx - HTML5 <canvas> element.
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

};

/**
 * Draw coal mines on the coal infrastructure map.
 * @param {Object} ctx - HTML5 <canvas> element.
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_coal_mines = function draw_coal_mines(ctx, queued_data) {
  console.log('draw_coal_mines');

  let wells = queued_data[0];

  // Sort in descending order so large mines don't
  // obscure small mines.
  wells.sort(function(a, b) {
    return d3.descending(+a.tot_prod, +b.tot_prod);
  });

  wells.forEach(function(d) {
    let xy = projection([+d.lon, +d.lat]);
    if (xy === null) {
      //
    } else {
      // console.log(d.tot_prod);
      draw_mine(ctx, xy, viz.black, +d.tot_prod);
    }
  });

};

/**
 * Helper function for draw_coal_mines to draw the pentagon representing the mine.
 * @param {Object} ctx - HTML5 <canvas> element.
 * @param {Number} xy
 * @param {Object} color
 * @param {Number} r - Radius. 
 */
const draw_mine = function draw_mine(ctx, xy, color, r) {
  r = Math.sqrt(r / Math.PI) * viz.mines.scale;
  ctx.strokeStyle = viz.mines.coal.stroke;
  ctx.strokeWidth = viz.mines.coal.width;
  ctx.fillStyle = viz.mines.coal.fill;

  ctx.beginPath();

  let a = Math.PI / 2;
  let n = 5;
  ctx.moveTo (xy[0] + r * Math.cos(a), xy[1] + r * Math.sin(a));
  for (let i = 1; i <= n; ++i) {
    ctx.lineTo (xy[0] + r * Math.cos(a + i * 2 * Math.PI / n),
      xy[1] + r * Math.sin(a + i * 2 * Math.PI / n));
  }

  ctx.fill();
  if (r > 500000) {
    ctx.stroke();
  }

};

