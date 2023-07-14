/**
 * @file Provides draw functions and any helpers for coal mines and railroads.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Coal
 */

EnergyMaps = (function (energy_maps, InfrastructureSet) {

  'use strict';

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
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   * @param {String} stroke - rgba value to set the canvas stroke
   * @param {Number} width - width value set relative to SCALE
   */
  let Coal = function Coal(name, text, value, column, draw_props, stroke, width) { // TODO: Do we need this Coal base class? Probably not.
    InfrastructureSet.call(this, name, text, value, column, draw_props);
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
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   * @property {String} stroke - rgba value to set the canvas stroke
   * @property {Number} width - width value set relative to SCALE
   * @property {String} fill - rgba value to set the polygon fill color
   * @property {Number} scale - scale value applied to each polygon
   */
  let CoalMine = function CoalMine(name, text, value, column, draw_props) {
    Coal.call(this, name, text, value, column, draw_props);
    this.text = text;
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
      draw_mine(ctx, [x, y], false,
        1000000000 * energy_maps.oil_refinery.size, true);
      let text = this.text;
      y = energy_maps.advance_for_type(y, ctx, text, TEXT_OFFSET, x);
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
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   * @property {String} stroke - rgba value to set the canvas stroke
   * @property {Number} width - width value set relative to SCALE
   */
  let Railroad = function Railroad(name, text, value, column, draw_props) {
    Coal.call(this, name, text, value, column, draw_props);
    this.text = text;
    this.stroke = '#767676';
    this.width = SCALE;
    this.z_index = 0;
    /**
     * Draw railroad legend to its HTML5 canvas context. All params passed
     * to draw_line() as a helper.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x-axis
     * @param {Number} y - y-axis
     * @param {boolean} dashed - true if line should be dashed, false if solid
     * @returns {Number} y - updated y-axis
     */
    this.draw_legend = function draw_railroad_legend(ctx, x, y, dashed) {
      ctx.strokeStyle = energy_maps.railroad.stroke;
      ctx.lineWidth = energy_maps.railroad.width;
      let text = this.text;
      y = energy_maps.draw_line(ctx, x, y, this, dashed, text)
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
   * @returns {Number} y - updated y-axis
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
      r = setRadius(r, energy_maps.coal_mine.scale);
    } else {
      r = setRadius(r, energy_maps.coal_mine.scale / TRANSFORM.k);
    }
    ctx.strokeStyle = energy_maps.coal_mine.stroke;
    ctx.strokeWidth = energy_maps.coal_mine.width / TRANSFORM.k;
    ctx.fillStyle = energy_maps.coal_mine.fill;
    ctx.beginPath();
    energy_maps.draw_polygon(NUM_SIDES_MINE, ctx, r, xy);
    ctx.fill();

    // const draw_white_outline = function draw_white_outline() {
    //   let OUTLINE_THRESHOLD = 8 / TRANSFORM.k;
    //   if (r > OUTLINE_THRESHOLD) {
    //     ctx.stroke();
    //   }
    // }
  };

  /**
   * Draw coal mines on the coal infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * ".map.layer.canvas.coal-mine"
   * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
   */
   const draw_coal_mines = function draw_coal_mines(ctx, queued_data) {

    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let mines = queued_data[0].features;
    console.log(mines);

    // Sort in descending order so large mines don't
    // obscure small mines. Unary '+' operator used to return the numeric rather
    // than string values to tot_prod
    mines.sort(function(a, b) {
      return d3.descending(
        +a.properties.original.tot_prod,
        +b.properties.original.tot_prod
      )});

    mines.forEach(function(d, i) {
      // TODO: We have lon/lat props in the csv file, but none in the database from the JSON we used!
      let xy = energy_maps.projection(
        [+d.geometry.coordinates[0], +d.geometry.coordinates[1]]);
      if (xy === null) {
        //
      } else {
        draw_mine(ctx, xy, viz.black, +d.properties.original.tot_prod, false);
      }
      if (i === mines.length - 1) {
        energy_maps.finish_loading_layer();
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

    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let rr_data = queued_data[0];
    // const path = get_path(ctx);

    ctx.lineCap = 'round';
    ctx.strokeStyle = energy_maps.railroad.stroke;
    ctx.lineWidth = energy_maps.railroad.width / TRANSFORM.k;
    ctx.beginPath();
    energy_maps.path(rr_data);
    ctx.stroke();
    ctx.setLineDash([]);
    energy_maps.finish_loading_layer();
  };

  // let coal_mine = new CoalMine('coal-mines', 'Coal mines', 57_000_000_000, 'coal', [{
  //   draw_layer: draw_coal_mines,
  //   src: [ `${API_URL_PREFIX}/${data_year}/mines/coal` ],
  //   d3_fetch: d3.json
  // }]);
  energy_maps.coal_mine = new CoalMine(
    'coal-mines', 'Coal mines', {2012: 41_474_000_000, 2022: null},
    'coal', [{
      draw_layer: draw_coal_mines,
      src: [ `/mines/coal` ],
      d3_fetch: d3.json
  }]);

  // TODO: Why aren't 2022 railroads working?
  energy_maps.railroad = new Railroad(
    'railroads', 'Railroads', {2012: 137_000_000_000, 2022: 137_000_000_000},
    'coal', [{
      draw_layer: draw_railroads,
      // The API/db will have "nominal_year" and "actual_year" as object properties for a "year" object
      // So this should look something like:
      // src: [ `${API_URL_PREFIX}/${data_year}/railroads` ],
      src: [ `/railroads` ],
      d3_fetch: d3.json
  }]);

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);