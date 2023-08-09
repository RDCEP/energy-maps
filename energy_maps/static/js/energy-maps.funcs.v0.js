/**
 * @file Provides global functions and any helpers for the more specialized
 * drawing functions contained in other *.funcs files.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

EnergyMaps = (function (EnergyMaps) {

  'use strict';

  /**
   * Apply transformation to a single layer. Used at the end of a zoom event.
   * @param ctx
   * @param transform
   */
  const transformLayer = function transformLayer
    (ctx, transform)
  {
    ctx.clearRect(0, 0, EnergyMaps.width, EnergyMaps.height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);
  }

  /**
   * Clip the region of a single layer to prevent each draw event from parsing extraneous data.
   * @param {Object} ctx
   */
  const clipRegion = function clipRegion
    (ctx)
  {
    let region = new Path2D();
    region.rect(0, 0, EnergyMaps.width, EnergyMaps.height);
    ctx.clip(region);
  }

  /**
   * Simplify a TopoJSON object based on the scale factor of the current
   * zoom event.
   * @param key
   * @param data
   * @returns {*}
   */
  const simplifyTopojson = function simplifyTopojson
    (key, data)
  {
    let outputGeojson;
    let presimplifiedData = topojson.presimplify(data[0]);
    outputGeojson = topojson.feature(
      topojson.simplify(presimplifiedData, .01 / EnergyMaps.transform.k**2),
      data[0].objects[key]);
    return outputGeojson;
  }

  /**
   * Draw the base map.
   * @param {Object} ctx - HTML5 canvas context.
   * @param {Object[]} queuedData - Dataset for the corresponding resource
   * @param {Object} transform - x, y, and k transform coefficients
   * @param {Object} borderOnly
   * @param {Boolean} simple
   */
  const drawLand = function drawLand
    (ctx, queuedData, transform, borderOnly, simple)
  {
    queuedData = queuedData[0]
    ctx.save()
    EnergyMaps.transformLayer(ctx, transform);
    ctx.clearRect(0,0, EnergyMaps.width, EnergyMaps.height);
    EnergyMaps.path.context(ctx);
    let outputGeojson;

    if (simple) {
      // If simple is True, we're looking only for a low res map so return
      // simpleMapBkgd. This is used for pan/zoom.
      outputGeojson = EnergyMaps.simpleMapBkgd;
    } else {
      let presimplifiedData = topojson.presimplify(queuedData);

      // Scale map detail based on zoom level
      outputGeojson = topojson.feature(
        topojson.simplify(presimplifiedData, .01 / transform.k**2),
        queuedData.objects.nation);

      // If no simpleMapBkgd object exists, make a low resolution
      // map to us as simpleMapBkgd
      if (!EnergyMaps.simpleMapBkgd) {
        EnergyMaps.simpleMapBkgd = topojson.feature(
          topojson.simplify(presimplifiedData,.2),
          queuedData.objects.nation);
      }
    }

    console.log(outputGeojson)

    if (!borderOnly) {

      // Land boundaries fill
      ctx.fillStyle = VIZ.map.fill;
      ctx.beginPath();
      EnergyMaps.path(outputGeojson.features);
      ctx.fill();
    } else {
      ctx.strokeStyle = VIZ.map.stroke;
      ctx.lineWidth = VIZ.map.width;
      ctx.beginPath();
      EnergyMaps.path(outputGeojson.features);
      ctx.stroke();
    }

    ctx.restore();

  };

  /// Primitives

  /**
   * Draw an 'x' to the desired canvas context
   * @param {Object} ctx - HTML5 canvas context.
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} d - ???
   */
  const drawX = function drawX
    (ctx, xy, d)
  {
    ctx.moveTo(xy[0] - d / 2, xy[1] - d / 2);
    ctx.lineTo(xy[0] + d / 2, xy[1] + d / 2);
    ctx.moveTo(xy[0] - d / 2, xy[1] + d / 2);
    ctx.lineTo(xy[0] + d / 2, xy[1] - d / 2);
  };

  /**
   * Draw a circle to the desired canvas context
   * @param {Object} ctx - HTML5 canvas context.
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} r - radius
   */
  const drawCircle = function drawCircle
    (ctx, xy, r)
  {
    ctx.arc(xy[0], xy[1], r, 0, Math.PI * 2, true);
  };

  /**
   * Draw a box to the desired canvas context
   * @param {Object} ctx - HTML5 canvas context.
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} d - ???
   */
  const drawBox = function drawBox
    (ctx, xy, d)
  {
    ctx.rect(xy[0] - d / 2, xy[1] - d / 2, d, d);
  };

  /**
   * Draw a triangle to the desired canvas context
   * @param {Object} ctx - HTML5 canvas context.
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} d - ???
   */
  const drawTriangle = function drawTriangle
    (ctx, xy, d)
  {
    let e = (d * Math.sqrt(3)) / 3;
    ctx.moveTo(xy[0], xy[1] - e * 2);
    ctx.lineTo(xy[0] + d, xy[1] + e);
    ctx.lineTo(xy[0] - d, xy[1] + e);
    ctx.lineTo(xy[0], xy[1] - e * 2);
  };

  /**
   * Draw a downward facing triangle to the desired canvas context
   * @param {Object} ctx - HTML5 canvas context.
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} d - ???
   */
  const drawTriangleDown = function drawTriangleDown
    (ctx, xy, d)
  {
    let e = (d * Math.sqrt(3)) / 3;
    ctx.moveTo(xy[0], xy[1] + e * 2);
    ctx.lineTo(xy[0] + d, xy[1] - e);
    ctx.lineTo(xy[0] - d, xy[1] - e);
    ctx.lineTo(xy[0], xy[1] + e * 2);
  };

  /**
   * Draw a cross to the desired canvas context
   * @param {Object} ctx - HTML5 canvas context.
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} d - ???
   */
  const drawCross = function drawCross
    (ctx, xy, d)
  {
    ctx.moveTo(xy[0], xy[1] - d / 2);
    ctx.lineTo(xy[0], xy[1] + d / 2);
    ctx.moveTo(xy[0] - d / 2, xy[1]);
    ctx.lineTo(xy[0] + d / 2, xy[1]);
  };

  /**
   * Draw a polygon to the desired canvas context with a variable number of sides
   * @param {Number} sides - number of sides of the polygon
   * @param {Object} ctx - HTML5 canvas context.
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} r - radius
   */
  const drawPolygon = function drawPolygon
    (sides, ctx, r, xy)
  {
    /** @type {Number}
     * @description 90 degrees in radians, to represent the top of a unit circle*/
    let startingAngle = Math.PI / 2;
    ctx.moveTo (xy[0] + r * Math.cos(startingAngle), xy[1] + r * Math.sin(startingAngle));
    for (let i = 1; i <= sides; ++i) {
      ctx.lineTo (xy[0] + r * Math.cos(startingAngle + i * 2 * Math.PI / sides),
        xy[1] + r * Math.sin(startingAngle + i * 2 * Math.PI / sides));
    }
  }

  /// Modal window with about, license, etc.

  d3.select('.site-links').on('click', () => {
    d3.select('.modal-screen').style('display', 'block');
    d3.select('.modal-window.about-window').style('display', 'block');
  });

  d3.select('.modal-close').on('click', function() {
    d3.select(this.parentNode).style('display', 'none');
    d3.select('.modal-screen').style('display', 'none');
  });

  EnergyMaps.transformLayer = transformLayer;
  EnergyMaps.clipRegion = clipRegion;
  EnergyMaps.simplify = simplifyTopojson;
  EnergyMaps.drawLand = drawLand;
  EnergyMaps.drawX = drawX;
  EnergyMaps.drawCircle = drawCircle;
  EnergyMaps.drawBox = drawBox;
  EnergyMaps.drawTriangle = drawTriangle;
  EnergyMaps.drawTriangleDown = drawTriangleDown;
  EnergyMaps.drawCross = drawCross;
  EnergyMaps.drawPolygon = drawPolygon;

  return EnergyMaps;

})(EnergyMaps || {});