/**
 * @file Provides draw functions and any helpers for coal mines and railroads.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Coal
 */

EnergyMaps = (function (EnergyMaps) {

  'use strict';

  /**
   * Instantiates a new CoalMine object that contains properties used
   * to draw coal mines to the map and legend.
   * @class
   * @classdesc Used to create objects that represent coal mines.
   * @extends InfrastructureSet
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} drawProps - properties used to parse the data and render
   * the visualization
   * @param {Number} size - size for scaling on the map
   * @property {String} stroke - rgba value to set the canvas stroke
   * @property {Number} width - width value set relative to SCALE
   * @property {String} fill - rgba value to set the polygon fill color
   * @property {Number} scale - scale value applied to each polygon
   * @property {Number} size - size for scaling on the map
   */
  let CoalMine = function CoalMine
    (name, text, value, column, drawProps, size)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.stroke = 'rgba(255, 255, 255, 1)';
    this.size = size;
    this.width = SCALE;
    this.fill = 'rgba(0, 0, 0, 0.5)';
    this.scale = SCALE / 190;
    this.zIndex = 0;
    /**
     * Draw coal mine legend to its HTML5 canvas context.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - current coordinate along the x-axis of the legend canvas
     * @param {Number} y - current coordinate along the y-axis of the legend canvas
     * @returns {Number} y - updated coordinate on the y-axis
     */
    this.drawLegend = function drawCoalmineLegend
      (ctx, x, y)
    {
      y += VERTICAL_INCREMENT;
      let legendIconScalingFactor = 1000000000;
      _drawMine(ctx, [x, y], false,
         legendIconScalingFactor * this.size, true);
      let text = this.text;
      y = EnergyMaps.advanceForType(y, ctx, text, TEXT_OFFSET, x);
      return y;
    };
  }
  CoalMine.prototype = new EnergyMaps.InfrastructureSet;

  /**
   * Instantiates a new Railroad object that contains properties used
   * to draw railroad lines to the map and legend.
   * @class
   * @classdesc Used to create objects that represent railroads.
   * @extends InfrastructureSet
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} drawProps - properties used to parse the data and render
   * the visualization
   * @property {String} stroke - rgba value to set the canvas stroke
   * @property {Number} width - width value set relative to SCALE
   */
  const Railroad = function Railroad
    (name, text, value, column, drawProps)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.stroke = '#767676';
    this.width = SCALE;
    this.zIndex = 0;
    /**
     * Draw railroad legend to its HTML5 canvas context. All params passed
     * to draw_line() as a helper.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x-axis
     * @param {Number} y - y-axis
     * @param {boolean} dashed - true if line should be dashed, false if solid
     * @returns {Number} y - updated y-axis
     */
    this.drawLegend = function drawRailroadLegend
      (ctx, x, y, dashed)
    {
      ctx.strokeStyle = EnergyMaps.railroad.stroke;
      ctx.lineWidth = EnergyMaps.railroad.width;
      let text = this.text;
      y = EnergyMaps.drawLine(ctx, x, y, this, dashed, text)
      return y;
    };
  }
  Railroad.prototype = new EnergyMaps.InfrastructureSet;

  /**
   * Helper function for draw_mine() to Scale out the radius relative
   * to the desired size
   * @param {Number} radius - starting radius
   * @param {Number} scale - the desired scale value, bound to `VIZ` object
   * value relative to category.
   * @returns {Number} y - updated y-axis
   */
  const _setRadius = function _setRadius
    (radius, scale)
  {
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
   * @param {Boolean} isLegend - Flag to determine whether the mine
   * is being drawn to the legend.
   */
  const _drawMine = function _drawMine
    (ctx, xy, color, r, isLegend)
  {
    const NUM_SIDES_MINE = 5;
    // Without this condition, the mine scales on the legend too.
    if (isLegend) {
      r = _setRadius(r, EnergyMaps.coalMine.scale);
    } else {
      r = _setRadius(r, EnergyMaps.coalMine.scale / EnergyMaps.transform.k);
    }
    ctx.strokeStyle = EnergyMaps.coalMine.stroke;
    ctx.strokeWidth = EnergyMaps.coalMine.width / EnergyMaps.transform.k;
    ctx.fillStyle = EnergyMaps.coalMine.fill;
    ctx.beginPath();
    EnergyMaps.drawPolygon(NUM_SIDES_MINE, ctx, r, xy);
    ctx.fill();

  };

  /**
   * @description Draw coal mines on the coal infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * ".map.layer.canvas.coal-mine"
   * @param {coalMine[]} queuedData - Dataset for the corresponding resource
   */
   const _drawCoalMines = function _drawCoalMines
    (ctx, queuedData)
  {
    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    let mines = queuedData[0].features;
    console.log(mines);

    // Sort in descending order so large mines don't
    // obscure small mines. Unary '+' operator used to return the numeric rather
    // than string values to totProd
    mines.sort(function(a, b) {
      return d3.descending(
        +a.properties.original.totProd,
        +b.properties.original.totProd
      )});

    mines.forEach(function(d, i) {
      // NOTE: We have lon/lat props in the csv file, but none in the
      //  database from the JSON we used!
      let xy = EnergyMaps.projection(
        [+d.geometry.coordinates[0], +d.geometry.coordinates[1]]);
      if (xy === null) {
        //
      } else {
        // _drawMine(ctx, xy, VIZ.black, +d.properties.original.totalProd, false);
        _drawMine(ctx, xy, VIZ.black, +d.properties.original.tot_prod, false);
      }
      if (i === mines.length - 1) {
        EnergyMaps.finishLoadingLayer();
      }
    });
  };

  /**
   * Draw railroads on the coal infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * ".map.layer.canvas.railroad"
   * @param {coalMine[]} queuedData - Dataset for the corresponding resource
   */
  const _drawRailroads = function _drawRailroads
    (ctx, queuedData)
  {

    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    let rrData = queuedData[0];
    // const path = get_path(ctx);

    ctx.lineCap = 'round';
    ctx.strokeStyle = EnergyMaps.railroad.stroke;
    ctx.lineWidth = EnergyMaps.railroad.width / EnergyMaps.transform.k;
    ctx.beginPath();
    EnergyMaps.path(rrData);
    ctx.stroke();
    ctx.setLineDash([]);
    EnergyMaps.finishLoadingLayer();
  };

  const coalMine = new CoalMine(
    'coal-mines', 'Coal mines', {2012: 41_474_000_000, 2022: null},
    'coal', [{
      drawLayer: _drawCoalMines,
      src: [ `/mines/coal` ],
      d3Fetch: d3.json
    }], .006 * SCALE);

  // NOTE: Why aren't 2022 railroads working?
  const railroad = new Railroad(
    'railroads', 'Railroads', {2012: 137_000_000_000, 2022: 137_000_000_000},
    'coal', [{
      drawLayer: _drawRailroads,
      // The API/db will have "nominal_year" and "actual_year" as object properties for a "year" object
      // So this should look something like:
      // src: [ `${API_URL_PREFIX}/${data_year}/railroads` ],
      src: [ `/railroads` ],
      d3Fetch: d3.json
    }]);

  EnergyMaps.coalMine = coalMine;
  EnergyMaps.railroad = railroad;

  return EnergyMaps;

})(EnergyMaps || {});