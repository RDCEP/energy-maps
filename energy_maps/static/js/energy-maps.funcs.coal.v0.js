/**
 * @file Provides draw functions and any helpers for coal mines and railroads.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Coal
 */

/** 
 * Instantiates a new Coal object that contains properties used to draw
 * coal infrastructure to the map and legend.
 * @class
 * @classdesc Used to create objects that represent coal-based infrastructure.
 * @extends InfrastructureSet
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render
 * the visualization
 * @param {String} stroke - rgba value to set the canvas stroke
 * @param {Number} width - width value set relative to SCALE
 */
function Coal(name, text, value, column, draw, stroke, width) { // TODO: Do we need this Coal base class? Probably not.
  InfrastructureSet.call(this, name, text, value, column, draw);
  this.stroke = stroke;
  this.width = width || 0;
  this.z_index = 0;
}
Coal.prototype = new InfrastructureSet;

/** 
 * Instantiates a new CoalMine object that contains properties used
 * to draw coal mines to the map and legend.
 * @class
 * @classdesc Used to create objects that represent coal mines.
 * @extends Coal
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render
 * the visualization
 * @property {String} stroke - rgba value to set the canvas stroke
 * @property {Number} width - width value set relative to SCALE
 * @property {String} fill - rgba value to set the polygon fill color
 * @property {Number} scale - scale value applied to each polygon 
 */
function CoalMine(name, text, value, column, draw) {
  Coal.call(this, name, text, value, column, draw);
  this.text = this.text;
  this.stroke = 'rgba(255, 255, 255, 1)';
  this.width = SCALE;
  this.fill = 'rgba(0, 0, 0, 0.5)';
  this.scale = SCALE / 190;
  this.z_index = 0;
  /**
   * Draw coal mine legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @returns {Number} y - updated y axis
   */
  this.draw_legend = function draw_coalmine_legend(ctx, x, y) {
    y += VERTICAL_INCREMENT;
    // TODO: decouple this func invocation from oil
    // TODO: Document or extract these magic numbers
    draw_mine(ctx, [x, y], false, 1000000000*oil_refinery.size, true);
    let text = this.text;
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };
}
CoalMine.prototype = new Coal;

/** 
 * Instantiates a new Railroad object that contains properties used
 * to draw railroad lines to the map and legend.
 * @class
 * @classdesc Used to create objects that represent railroads.
 * @extends Coal
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render
 * the visualization
 * @property {String} stroke - rgba value to set the canvas stroke
 * @property {Number} width - width value set relative to SCALE
 */
function Railroad(name, text, value, column, draw) {
  Coal.call(this, name, text, value, column, draw);
  this.text = this.text;
  this.stroke = '#767676';
  this.width = SCALE;
  this.z_index = 0;
  /**
   * Draw railroad legend to its HTML5 canvas context. All params passed
   * to draw_line() as a helper.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {boolean} dashed - true if line should be dashed, false if solid
   * @returns {Number} y - updated y axis
   */
  this.draw_legend = function draw_railroad_legend(ctx, x, y, dashed) {
    ctx.strokeStyle = railroad.stroke;
    ctx.lineWidth = railroad.width;
    let text = this.text;
    y = draw_line(ctx, x, y, this, dashed, text)
    return y;
  };
}
Railroad.prototype = new Coal;

/**
 * Helper function for draw_mine() to Scale out the radius relative
 * to the desired size
 * @param {Number} r - starting radius
 * @param {Number} scale - the desired scale value, bound to `viz` object
 * value relative to category.
 * @returns {Number} y - updated y axis
 */
function setRadius(radius, scale) {
  radius = Math.sqrt(radius / Math.PI) * scale;
  return radius;
}

/**
 * Helper function for draw_coal_mines to draw the pentagon representing
 * the mine.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} xy - Array of xy coordinates 
 * @param {Object} color
 * @param {Number} r - Radius. 
 * @param {Boolean} is_legend - Flag to determine whether the mine
 * is being drawn to the legend.
 */
const draw_mine = function draw_mine(ctx, xy, color, r, is_legend) {
  const NUM_SIDES_MINE = 5;
  // Without this condition, the mine scales on the legend too.
  if (is_legend) {
    r = setRadius(r, coal_mine.scale)  
  } else {
    r = setRadius(r, coal_mine.scale / transform.k);
  }
  ctx.strokeStyle = coal_mine.stroke;
  ctx.strokeWidth = coal_mine.width / transform.k;
  ctx.fillStyle = coal_mine.fill;
  ctx.beginPath();
  draw_polygon(NUM_SIDES_MINE, ctx, r, xy)
  ctx.fill();

  const draw_white_outline = function draw_white_outline() {
    let OUTLINE_THRESHOLD = 8 / transform.k;
    if (r > OUTLINE_THRESHOLD) {
      ctx.stroke();
    }
  }
};

/**
 * Draw coal mines on the coal infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas
 * ".map.layer.canvas.coal-mine"
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_coal_mines = function draw_coal_mines(ctx, queued_data) {
  console.log('draw_coal_mines');

  path.context(ctx);
  let region = new Path2D();
  region.rect(-transform.x, -transform.y, width, height);
  ctx.clip(region);

  let mines = queued_data[0];

  // Sort in descending order so large mines don't
  // obscure small mines. Unary '+' operator used to return the numeric rather
  // than string values to tot_prod
  mines.sort(function(a, b) {
    return d3.descending(+a.tot_prod, +b.tot_prod);
  });

  mines.forEach(function(d, i) {
    let xy = projection([+d.lon, +d.lat]);
    if (xy === null) {
      //
    } else {
      draw_mine(ctx, xy, viz.black, +d.tot_prod, false);
    }
    if (i === mines.length - 1) { 
      finish_loading_layer();
    }
  });
};

/**
 * Draw railroads on the coal infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas
 * ".map.layer.canvas.railroad"
 * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
 */
const draw_railroads = function draw_railroads(ctx, queued_data) {
  console.log('draw_railroads');

  path.context(ctx);
  let region = new Path2D();
  region.rect(-transform.x, -transform.y, width, height);
  ctx.clip(region);

  let output_geojson = simplify("railrdl020", queued_data);

  ctx.strokeStyle = railroad.stroke;
  ctx.lineWidth = railroad.width / transform.k;
  ctx.beginPath();
  path(output_geojson);
  ctx.stroke();
  finish_loading_layer();
};

let coal_mine = new CoalMine('coal-mines', 'Coal mines', 57_000_000_000, 'coal', [ {
  draw_layer: draw_coal_mines,
  src: [ '/static/csv/coal.csv' ],
  w: d3.csv
} ]);

let railroad = new Railroad('railroads', 'Railroads', 137_000_000_000, 'coal', [ {
  draw_layer: draw_railroads,
  src: [ '/static/json/railrdl020.json' ],
  w: d3.json
} ]);
