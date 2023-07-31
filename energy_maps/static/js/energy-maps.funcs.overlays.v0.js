/**
 * @file Provides draw functions and any helpers for additional
 * miscellaneous overlays.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Overlays
 */

EnergyMaps = (function (EnergyMaps) {

  'use strict';

  /**
   * Instatiates a new StateBoundary object that contains properties used
   * to draw state boundary lines to the map.
   * @class
   * @classdesc Used to create objects that represent state boundaries.
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
  let StateBoundary = function StateBoundary
    (name, text, value, column, drawProps, stroke, width)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.stroke = stroke;
    this.width = width;
    this.z_index = 0;
  }
  StateBoundary.prototype = new EnergyMaps.InfrastructureSet;

  /**
   * Instatiates a new WindMap object that contains properties used to draw
   * wind capacity contours to the map.
   * @class
   * @classdesc Used to create objects that represent a wind capacity map.
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
  let WindMap = function WindMap
    (name, text, value, column, drawProps, stroke, width)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.stroke = stroke;
    this.width = width;
    this.z_index = 0;
  }
  WindMap.prototype = new EnergyMaps.InfrastructureSet;

  /**
   * Draw state boundaries on the infrastructure map.
   * @param {Object} ctx - HTML5 canvas context
   * @param {coal_mine[]} queued_data - Dataset for the corresponding resource
   */
  const _drawStateBoundaries = function _drawStateBoundaries
    (ctx, queued_data)
  {
    EnergyMaps.path.context(ctx);
    let output_geojson = EnergyMaps.simplify("states-no-overlap", queued_data);

    // ctx.strokeStyle = state_boundaries.stroke;
    ctx.strokeStyle = '#c4c4c4';
    ctx.lineWidth = EnergyMaps.stateBoundaries.width / EnergyMaps.transform.k;
    // ctx.setLineDash([
    //   0,
    //   state_boundaries.width / transform.k * 2
    // ]);
    ctx.beginPath();
    EnergyMaps.path(output_geojson);
    ctx.stroke();
    // ctx.setLineDash([]);
    EnergyMaps.finishLoadingLayer();
  };

  let presimplifiedData = null;
  let windMapColors = [
    '#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'];
  let bands = ['<7m/s', '7-8m/s', '8-9m/s', '9-10m/s', '>10m/s'];
  let bandsLength = bands.length; // instantiated here for loop performance in several code blocks
  let outputGeojson = Array(bandsLength);

  /**
   * Draw wind map contours on the infrastructure map.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Object} queued_data - Dataset for the corresponding resource
   */
  const _drawWindMap = function _drawWindMap
    (ctx, queued_data)
  {
    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    if (presimplifiedData == null) {
      presimplifiedData = topojson.presimplify(queued_data[0]);
    }
    ctx.lineWidth = 0;

    for (let i = 0; i < bandsLength; ++i) {
      // Filter level of detail based on value of k
      // We can track k, and compare current val vs. previous val
      //  consider global called 'kChanged'
      // If current k diff from prev k, say kChanged
      // declare output_geojson as a null global, then only run the following block if
      // value of k has changed or if output_geojson is null
      if (outputGeojson[i] === undefined || EnergyMaps.k_changed) {
        outputGeojson[i] = topojson.feature(
          topojson.simplify(presimplifiedData, .01 / EnergyMaps.transform.k**2),
          queued_data[0].objects[bands[i]]
        );
      }
      ctx.fillStyle = windMapColors[i];
      console.log(`current band: ${bands[i]}`);
      console.log(windMapColors);
      ctx.beginPath();
      EnergyMaps.path(outputGeojson[i]);
      ctx.fill();
    }
    EnergyMaps.finishLoadingLayer();
  };

  /** Draw wind capacity map legend **/
  const _drawWindMapLegend = function _drawWindMapLegend
    (ctx, x, y, dashed)
  {
    y += VERTICAL_INCREMENT * 1.5;
    //TODO: This is ugly. It duplicates colors and labels from `draw_wind_map()`
    let windMapColors = [
      '#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'];
    let bands = ['<7m/s', '7-8m/s', '8-9m/s', '9-10m/s', '>10m/s'];
    ctx.lineCap ='butt';
    ctx.lineWidth = 14 * SCALE;
    //TODO: More ugliness. If everything in the legend is going to overhang by
    // by 7 pixels, the marhigins should just be adjusted.
    x -= 7;
    for (let i = 0; i < bandsLength; ++i) {
      ctx.strokeStyle = windMapColors[i];
      ctx.beginPath();
      ctx.moveTo(x * SCALE, y);
      ctx.lineTo(x + 50 * SCALE, y);
      ctx.stroke();
      x += 50;
      ctx.fill();
    }
    //TODO: Below is messy but the windmap legend is so different from
    // everything else it's not easy to see another way.
    y += VERTICAL_TYPE_INCREMENT * 4;
    ctx.fillStyle = VIZ.black;
    ctx.font = LEGEND_FONT;
    ctx.textAlign = 'right';
    ctx.fillText(`${bands[bandsLength-1]}`, x, y);
    x = (x + TEXT_OFFSET) / 2;
    ctx.textAlign = 'center';
    ctx.fillText('Avg. wind speed', x, y);
    x = 0;
    ctx.textAlign = 'left';
    ctx.fillText(`${bands[0]}`, TEXT_OFFSET + x, y);
    ctx.linecap = 'round';
    return y;
  };

  const stateBoundaries = new StateBoundary(
    'state-boundaries',
    'State boundaries',
    {2012: 0, 2020: 0},
    'layers',
    [{
      drawLayer: _drawStateBoundaries,
      src: ['/static/json/states-10m.json'],
      d3Fetch: d3.json
    }],
    'rgba(54, 54, 54, 1)',
    1.5
  );

  const windMap = new WindMap(
    'wind-capacity',
    'Wind capacity',
    null,
    'layers',
    [{
      drawLayer: _drawWindMap,
      src: ['/static/json/wind-map/ws-clipped-merged-simplify20.json'],
      d3Fetch: d3.json
    }],
  );
  windMap.drawLegend = _drawWindMapLegend;

  EnergyMaps.stateBoundaries = stateBoundaries;
  EnergyMaps.windMap = windMap;

  return EnergyMaps;

})(EnergyMaps || {});