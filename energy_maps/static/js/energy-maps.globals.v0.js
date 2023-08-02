/**
 * @file Provides global variables for the application.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

/**
 * @type {number}
 * @description Originally used for scaling static print-based maps.
 * Currently unused.
 */
const SCALE = 1;

const VIZ = {
  white: 'rgba(255, 255, 255, 1)',
  black: 'rgba(0, 0, 0, 1)',
  coal: 'rgba(0, 0, 0)',
  map: {
    fill: '#dddddd',
    stroke: '#767676',
    ocean: '#ffffff',
    width: SCALE
  }
};

let DATA_YEAR = 2012;
let API_URL_PREFIX = `http://127.0.0.1:5000/api/v0.1.0/infrastructure/${DATA_YEAR}`

let LAYERS = null;
let ACTIVE_LAYERS = [];

const TEXT_OFFSET = 30 * SCALE;
const LEGEND_FONT_SIZE = 14 * SCALE;
const LEGEND_FONT = `bold ${LEGEND_FONT_SIZE}px Inter`;
const VERTICAL_INCREMENT = 15 * SCALE;
const VERTICAL_TYPE_INCREMENT = 5 * SCALE;

EnergyMaps = (function (EnergyMaps) {

  'use strict';

  const fill_screen = false;

  /**
   * @type {number}
   * @description The year value to determine data loaded by the application.
   */
  // DATA_YEAR = 2012;
  // energy_maps.get_data_year = function get_data_year(data_year) {
  //   return data_year;
  // }

  const asteriskNote = document.getElementsByClassName('asterisk-note')

  // energy_maps.API_URL_PREFIX = `http://127.0.0.1:5000/api/v0.1.0/infrastructure/${DATA_YEAR}`

  /**
   * @type {number}
   * @description Device pixel ratio, used to scale our canvas with
   * clarity relative to the user's device.
   */
  const _dpi = window.devicePixelRatio;

  /**
   * @type {number}
   * @description Map width, set to some multiple of `SCALE`
   */
  // energy_maps.width = window.innerWidth * SCALE;

  /**
   * @type {number}
   * @description Map height, set to some fraction of `width`
   */
  // energy_maps.height = window.innerHeight;

  /**
   * @type {Object}
   * @description Global page padding
   */
  const _padding = {top: 10, right: 10, bottom: 50, left: 50};

  /**
   * @type {number}
   * @description Global canvas width, set to some multiple of the sum of `width` and `scale`
   */
  const _canvasWidth = EnergyMaps.width + SCALE * 400;

  /**
   * Instantiates a new generic object that contains properties used to draw
   * infrastructure data to the map and legend.
   * @class
   * @classdesc Base class that allows derived classes to create objects that
   * represent data sets for specific types of infrastructure.
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} drawProps - properties used to parse the data and render
   * the visualization
   */
  const InfrastructureSet = function InfrastructureSet
    (name, text, value, column, drawProps)
  {
    this.name = name || '';
    this.text = text || '';
    this.value = value || 0;
    this.column = column || '';
    this.zIndex = 0;
    this.drawProps = drawProps || [{
      drawLayer: '',
      src: '',
      d3Fetch: ''
    }] || {
      drawLayer: '',
      src: '',
      d3Fetch: ''
    }
  };

  /**
   * Get the current width of the browser window
   * @function
   * @return {Number} - width in pixels of the browser window
   * the visualization
   */
  const getWidth = function setWidth
    ()
  {
    return window.innerWidth * SCALE;
  };

  /**
   * Get the current height of the browser window
   * @function
   * @return {Number} - height in pixels of the browser window
   * the visualization
   */
  const getHeight = function setHeight
    ()
  {
    return window.innerHeight * SCALE;
  };

  const width = getWidth();
  const height = getHeight();

  // create projection and path objects with which to draw geo objects
  // Kludge for pan/zoom. Can't make JSON call during pan/zoom.
  let simpleMapBkgd = null;

  /**
   * @description Width of content area in center of screen stored
   * as a `number`.
   */
  const _contentWidth = d3.select('.main-wrap')
    .node().offsetWidth;

  /**
   * @description Height of site header area stored as a `number`.
   */
  const _headerHeight = d3.select('header').node().offsetHeight;

  /**
   * @description Map projection scale to fill content area.
   */
  const projectionScale = _contentWidth * 1.2;

  // Possible option -- Looks good on small laptop but terrible on monitors:
  // let projection_scale =  content_width * 0.7;
  const projectionWidth = width / 2;
  const projectionHeight = projectionWidth / 2
    + _headerHeight

  /**
   * @description D3 geoAlbersUsa projection object set to custom scale
   * and translation offset
  **/
  const projection = d3.geoAlbersUsa()
    .scale(projectionScale)
    .translate([
      projectionWidth,
      // Half the width is the height, half of that gets us to the center, and
      // add the height of the header so that maps sits below it.
      // Then subtract a random and pointless amount because we've been
      // told to and are bone-fucking-tired.
      projectionScale / 4 + _headerHeight - 30
    ]);

  const _path2D = new Path2D();

  /**
   * D3 geoPath object -- a geographic path generator based off
   * of the `projection` geoAlbersUsa() object
   */
  const path = d3.geoPath()
    .projection(projection)
    .pointRadius(2)
    .context(_path2D);

  /**
   * @type {HTMLElement}
   * @description Spinner element that appears while layers are loading.
   */
  const _spinner = document.getElementById('spinner');

  /**
   * @param {Object} ctx - HTML5 canvas context
   * @returns {d3.geoPath} geographic path generator for the supplied ctx
   */
  const getPath = function getPath
    (ctx)
  {
    return d3.geoPath()
      .projection(projection)
      .pointRadius(2)
      .context(ctx);
  };

  const showSpinner = function showSpinner
    ()
  {
    _spinner.style.display = 'block';
  };

  const hideSpinner = function hideSpinner
    ()
  {
    _spinner.style.display = 'none';
  };

  let _processingLayers = 0;

  /**
   * @description Show the spinner and queue the layer for processing
   */
  const startLoadingLayer = function startLoadingLayer
    ()
  {
    EnergyMaps.showSpinner();
    _processingLayers++;
  };

  const finishLoadingLayer = function finishLoadingLayer
    ()
  {
    _processingLayers--;
    if (_processingLayers <= 0) {
      _processingLayers = 0;
      EnergyMaps.hideSpinner();
    }
  };

  /**
   * Helper function for pipeline and railroad legend symbols
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {Object} obj - Transport or Railroad object
   * @param {boolean} dashed - true if line should be dashed, false if solid
   * @param {string} text - the text for the layer written to the legend
   * @param {Number} vpx - vertical typography increment in pixels
   * @returns {Number} y - updated y axis
   */
  const drawLine = function drawLine
    (ctx, x, y, obj, dashed = false,
     text, vpx)
  {

    y += VERTICAL_INCREMENT;

    // TODO: Implement product pipelines. They will need a dashed line.
    if (dashed) {
      ctx.setLineDash(dashed);
    }

    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.strokeStyle = obj.stroke;
    ctx.stroke();

    y = EnergyMaps.advanceForType(y, ctx, text, TEXT_OFFSET, x, 1);
    return y;

  };

  /**
   * @description For tracking the value of transform.k to improve
   * performance of simplification algorithms.
   */
  EnergyMaps.kChanged = false;
  EnergyMaps.asteriskNote = asteriskNote;
  EnergyMaps.SCALE = SCALE;
  EnergyMaps.width = width;
  EnergyMaps.height = height;
  EnergyMaps.transform = {x:0, y:0, k:1};
  EnergyMaps.simpleMapBkgd = simpleMapBkgd;
  EnergyMaps.projectionScale = projectionScale;
  EnergyMaps.projectionWidth = projectionWidth;
  EnergyMaps.projectionHeight = projectionHeight;
  EnergyMaps.projection = projection;
  EnergyMaps.path = path;
  EnergyMaps.getWidth = getWidth;
  EnergyMaps.getHeight = getHeight;
  EnergyMaps.getPath = getPath;
  EnergyMaps.showSpinner = showSpinner;
  EnergyMaps.hideSpinner = hideSpinner;
  EnergyMaps.startLoadingLayer = startLoadingLayer;
  EnergyMaps.finishLoadingLayer = finishLoadingLayer;
  EnergyMaps.drawLine = drawLine;
  EnergyMaps.InfrastructureSet = InfrastructureSet;

  return EnergyMaps;

})(EnergyMaps || {});