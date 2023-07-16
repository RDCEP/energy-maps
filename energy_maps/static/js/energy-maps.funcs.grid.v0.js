/**
 * @file Provides draw functions and any helpers for the electric grid,
 * subdivided into separate classes.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Grid
 */

EnergyMaps = (function (energy_maps, InfrastructureSet) {

  'use strict';

  /**
   * Instantiates a new Grid object that contains properties used
   * to draw electric grid segments to the map and legend.
   * @class
   * @classdesc Used to create objects that represent electric grid
   * infrastructure.
   * @extends InfrastructureSet
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   * @param {String} heading - class heading in the data file
   * @param {String} color - rgba value
   * @param {Number} line_width - value used to scale the width of the grid
   * @param {Number} nominal_voltage - system voltage
   */
  let Grid = function Grid
    (name, text, value, column, draw_props,
     heading, color, line_width, nominal_voltage)
  {
      InfrastructureSet.call(this, name, text, value, column, draw_props);
      this.heading = heading || '';
      this.color = color || 'rgba(0, 0, 0, 0.5)';
      this.line_width = line_width || 0;
      this.nominal_voltage = nominal_voltage || 50;
      this.z_index = 0;
  }
  Grid.prototype = new InfrastructureSet;

  /**
   * Instantiates a new GridAcCollection object that contains properties used
   * to draw a collection of electric grid segments to the map and legend.
   * @class
   * @classdesc Used to create objects that represent several units of electric
   * grid infrastructure.
   * @param {String} name - canvas ID
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   */
  let GridAcCollection = function GridAcCollection
    (name, text, value, column, draw_props, legend_group)
  {
    this.name = name || '';
    this.text = text || '';
    this.value = value || 0;
    this.column = column || '';
    this.z_index = 0;
    this.draw_props = draw_props || [];
    this.draw_legend =  legend_group;
  }
  GridAcCollection.prototype = new Grid;

  /**
   * Get the features you want from your GeoJSON FeatureCollection.
   * @param {Object} infrastructure - readfile
   * @param {Number} c - `grid` object member to compare readfile against
   * @returns {Array} features - an array of features matching the
   * filtered class(es)
   */
  const _filter_features = function filter_features
    (infrastructure, c)
  {
    let features = infrastructure.features.filter(function(d) {
      return d.properties.original.class === c.heading;
    });
    return features;
  }

  /**
   * Format electric grid line width for the calling grid class object.
   * Create an exponential response curve between voltages and line widths
   * to ensure that the lines that represent large voltages aren't too
   * large visually.
   * @param {Number} value - the value to be scaled, bound to the line_width
   * property of the corresponding `grid` object
   * @param {Number} divisor - sets line inflection point to adjust the scale
   * of the line width as `value` grows. Must be at least half the size
   * of `value` to get a decent inflection point. Helps determine the mid point
   * of the curve.
   */
  const _set_line_width = function set_line_width
    (value, divisor)
  {
    // TODO: Set nominal voltage as a property of the grid object
    return SCALE * (1 + 3 / (1 + Math.exp(-3 * (value / divisor - 1)))) / TRANSFORM.k;
  }

  /**
   * Draw a grid class on the electric grid infrastructure map.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Array} queued_data - the readfile from '/json/elec_grid_split/'
   * @param {Object} obj - grid object
   * @param {String} key - lookup value from data
   */
  const _draw_grid_class = function draw_grid_class
    (ctx, queued_data, obj, key)
  {

    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let grid_data = queued_data[0];

    let tmp_grid = {type: 'FeatureCollection', features: []};

    ctx.lineCap = 'round';
    ctx.strokeStyle = obj.color;

    features = _filter_features(grid_data, obj);

    let feat_len = features.length;

    for (let i = 0; i < feat_len; ++i) {

        tmp_grid.features = [features[i]];

        // TODO: Add descriptive comment here to explain the args
        ctx.lineWidth = _set_line_width(
          features[i]['properties']['original']['voltage'], 500);

        ctx.beginPath();
        energy_maps.path(tmp_grid);
        ctx.stroke();

        if (i === feat_len - 1) {
          energy_maps.finish_loading_layer();
        }
      }
  };

  /**
   * Draw AC electric grid legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {Object} obj - Grid object instance
   * @returns {Number} y - updated y axis
   */
  const _draw_legend_ac = function _draw_legend_ac
    (ctx, x, y, obj)
  {
    y += VERTICAL_INCREMENT;
    ctx.strokeStyle = obj.color;
    // Draw the square icon as a fat line
    ctx.lineCap ='butt';
    ctx.lineWidth = 14 * SCALE;
    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.stroke();

    if (obj === ac_na) {
      // FIXME: This is a kludge for drawing a white swatch for unknown kV
      // draws a hollow grey rectangle to give the appearance of a border around the white rectangle
      ctx.strokeStyle = 'rgba(76, 76, 76)';
      ctx.lineWidth = 1 * SCALE;
      ctx.strokeRect(x - 7 * SCALE, y - 7, 14 * SCALE, 14 * SCALE);
    }

    y = energy_maps.advance_for_type(y, ctx, obj.text, TEXT_OFFSET, x);
    ctx.lineCap ='butt';
    return y;
  }

  /**
   * Draw grid class unknown and under 100 on the electric grid
   * infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * ".map.layer.canvas.AC-lines-under-100-kV"
   * @param {Array} queued_data - the readfile from
   * '/json/elec_grid_split/grid-unk_under_100.json'
   */
  const _draw_grid_class_ac_unk_and_under_100 = function draw_grid_class_ac_unk_and_under_100
    (ctx, queued_data)
  {
    _draw_grid_class(ctx, queued_data, ac_na, 'grid-unk_under_100');
    _draw_grid_class(ctx, queued_data, ac_under_100, 'grid-unk_under_100');
  };

  /**
   * Draw grid class 100-300 on the electric grid infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * ".map.layer.canvas.AC-lines-100-to-300-kV"
   * @param {Array} queued_data - the readfile from
   * '/json/elec_grid_split/grid-100_300.json'
   */
  const _draw_grid_class_ac_100_300 = function draw_grid_class_ac_100_300
    (ctx, queued_data)
  {
    _draw_grid_class(ctx, queued_data, ac_100_200, 'grid-100_300');
    _draw_grid_class(ctx, queued_data, ac_200_300, 'grid-100_300');
  };

  /**
   * Draw grid class 345-735 on the electric grid infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * ".map.layer.canvas.AC-lines-345-to-735-kV"
   * @param {Array} queued_data - the readfile from
   * '/json/elec_grid_split/grid-345_735.json'
   */
  const _draw_grid_class_ac_345_735 = function draw_grid_class_ac_345_735
    (ctx, queued_data)
  {
    _draw_grid_class(ctx, queued_data, ac_345, 'grid-345_735');
    _draw_grid_class(ctx, queued_data, ac_500, 'grid-345_735');
    _draw_grid_class(ctx, queued_data, ac_735_plus, 'grid-345_735');
  };

  /**
   * Draw grid class DC on the electric grid infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * ".map.layer.canvas.DC-lines"
   * @param {Array} queued_data - the readfile from
   * '/json/elec_grid_split/grid-dc'
   */
  const _draw_grid_class_dc = function draw_grid_class_dc
    (ctx, queued_data)
  {
    _draw_grid_class(ctx, queued_data, dc, 'grid-dc');
  }


  // TODO: The `name` property for ac_na isn't meaningful since it doesn't
  //  have its own canvas to connect to independently. This isn't a huge
  //  issue but it's not descriptive when you look at the object's prototype
  //  in the console. Consider a rewrite of the Grid constructor.
  // let ac_na_and_under_100 = new InfrastructureSet('AC-lines-under-100-kV', '', 102_000_000_000, 'electricity-transmission-and-distribution', [ {
  //   f: draw_grid_class_ac_unk_and_under_100,
  //   src: ['/static/json/elec_grid_split/grid-unk_under_100.json'],
  //   w: d3.json,
  // } ]);

  const ac_na = new Grid('AC-lines-under-100-kV', 'Unknown kV AC', null, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_unk_and_under_100,
    src: [`${API_URL_PREFIX}/electric_grid/under_100`],
    d3_fetch: d3.json,
  }], 'NOT AVAILABLE', 'rgba(255, 255, 255)', 0, 50);

  const ac_under_100 = new Grid('AC-lines-under-100-kV', 'Under 100 kV AC', null, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_unk_and_under_100,
    src: [`${API_URL_PREFIX}/electric_grid/under_100`],
    d3_fetch: d3.json,
  }], 'Under 100', 'rgba(255, 255, 170)', 1, 50);

  /**
   * Draw AC electric grid legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @returns {Number} y - updated y axis
   */
  const _draw_legend_ac_na_and_under_100 = function _draw_legend_ac_na_and_under_100
    (ctx, x, y)
  {
    y = _draw_legend_ac(ctx, x, y, ac_na);
    y = _draw_legend_ac(ctx, x, y, ac_under_100);
    return y;
  }

  const ac_na_and_under_100 = new GridAcCollection('AC-lines-under-100-kV', 'AC < 100 kV', {2012: 102_000_000_000, 2022: 102_000_000_000}, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_unk_and_under_100,
    src: [`/electric_grid/under_100`],
    d3_fetch: d3.json,
  }], _draw_legend_ac_na_and_under_100); //, [ac_na, ac_under_100]);

  // AC 100-300

  const ac_100_200 = new Grid('AC-lines-100-to-300-kV', '100–200 kV AC', null, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_100_300,
    src: [`/electric_grid/100_300_kV_AC`],
    d3_fetch: d3.json,
  }], '100-161', 'rgba(86, 180, 233)', 2, 100);

  const ac_200_300 = new Grid('AC-lines-100-to-300-kV', '200–300 kV AC', null, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_100_300,
    src: [`/electric_grid/100_300_kV_AC`],
    d3_fetch: d3.json,
  }], '220-287', 'rgba(55, 126, 184)', 3, 250);

  /**
   * Draw AC electric grid legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @returns {Number} y - updated y axis
   */
  const _draw_legend_ac_100_300 = function _draw_legend_ac_100_300
    (ctx, x, y)
  {
    y = _draw_legend_ac(ctx, x, y, ac_100_200);
    y = _draw_legend_ac(ctx, x, y, ac_200_300);
    return y;
  }

  const ac_100_300 = new GridAcCollection('AC-lines-100-to-300-kV', 'AC 100–300 kV', {2012: 167_000_000_000, 2022: 167_000_000_000}, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_100_300,
    src: [`/electric_grid/100_300_kV_AC`],
    d3_fetch: d3.json,
  }], _draw_legend_ac_100_300);

  // AC 345-735

  const ac_345 = new Grid('AC-lines-345-to-735-kV', '345 kV AC', null, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_345_735,
    src: [`/electric_grid/345_735_kV_AC`],
    d3_fetch: d3.json,
  }], '345', 'rgba(255, 149, 0)', 4, 350);

  const ac_500 = new Grid('AC-lines-345-to-735-kV', '500 kV AC', null, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_345_735,
    src: [`/electric_grid/345_735_kV_AC`],
    d3_fetch: d3.json,
  }], '500', 'rgba(213, 113, 45)', 5, 350);

  const ac_735_plus = new Grid('AC-lines-345-to-735-kV', '735 kV AC', null, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_345_735,
    src: [`/electric_grid/345_735_kV_AC`],
    d3_fetch: d3.json,
  }], '735 and Above', 'rgba(228, 53, 5)', 6, 750);

  /**
   * Draw AC electric grid legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @returns {Number} y - updated y axis
   */
  const _draw_legend_ac_345_735 = function _draw_legend_ac_345_735
    (ctx, x, y)
  {
    y = _draw_legend_ac(ctx, x, y, ac_345);
    y = _draw_legend_ac(ctx, x, y, ac_500);
    y = _draw_legend_ac(ctx, x, y, ac_735_plus);
    return y;
  }

  const ac_345_735 = new GridAcCollection('AC-lines-345-to-735-kV', 'AC 345–735 kV', {2012: 137_000_000_000, 2022: 137_000_000_000}, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_ac_345_735,
    src: [`/electric_grid/345_735_kV_AC`],
    d3_fetch: d3.json,
  }], _draw_legend_ac_345_735);

  const dc = new Grid('DC-lines', '500–1000 kV DC', {2012: 4_000_000_000, 2022: 4_000_000_000}, 'electricity-transmission-and-distribution', [{
    draw_layer: _draw_grid_class_dc,
    src: [`/electric_grid/dc`],
    d3_fetch: d3.json,
  }], 'DC', 'black', 7, 1000);

  dc.dashed = false;

  /**
   * Draw DC electric grid legend to its HTML5 canvas context.
   * All params passed to draw_line() as a helper.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {boolean} dashed - true if line should be dashed, false if solid
   * @returns {Number} y - updated y axis
   */
  dc.draw_legend = function _draw_grid_dc_legend
    (ctx, x, y, dashed)
  {
    ctx.lineWidth = LEGEND_FONT_SIZE;
    ctx.strokeStyle = this.color;
    ctx.Linecap = 'butt';
    y = energy_maps.draw_line(ctx, x, y, this, dashed, this.text);
    ctx.strokeLinecap = 'round';
    return y;
  };

  const distribution = { name: 'electricity-distribution',
    text: 'Electricity dist',
    value: {2012: 1_400_000_000_000, 2022: 1_400_000_000_000},
    draw_props: false,
    column: 'electricity-transmission-and-distribution',
  };

  energy_maps.ac_na_and_under_100 = ac_na_and_under_100;
  energy_maps.ac_100_300 = ac_100_300;
  energy_maps.ac_345_735 = ac_345_735;
  energy_maps.dc = dc;
  energy_maps.distribution = distribution;

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);