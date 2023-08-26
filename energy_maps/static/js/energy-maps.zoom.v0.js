EnergyMaps = (function (EnergyMaps) {

  'use strict';

  const _targetCanvas = d3.select('.map.layer.zoom-target');

  let previousK = EnergyMaps.transform.k;

  const _zoomStart = function _zoomStart
    ()
  {
    previousK = EnergyMaps.transform.k;
    LAYERS = LAYERS.map(layer => {
        layer.context.clearRect(0, 0, EnergyMaps.width, EnergyMaps.height);
        return layer;
      }
    );
    EnergyMaps.transform = d3.event.transform;
  };

  const _zooming = function _zoomed
    ()
  {
    EnergyMaps.transform = d3.event.transform;
    EnergyMaps.drawLand(EnergyMaps.baseCtx, [EnergyMaps.simpleMapBkgd], EnergyMaps.transform, false, true);
  };

  const _zoomEnd = _.debounce(function(e) {
    EnergyMaps.kChanged = EnergyMaps.transform.k !== previousK;
    EnergyMaps.drawBaseMap(EnergyMaps.transform);
    EnergyMaps.drawActiveLayers(EnergyMaps.transform);
  }, 500, false);

  const _zoom = d3.zoom()
    .scaleExtent([0, 50])
    .on('start', _zoomStart)
    .on('zoom', _zooming)
    .on('end', _zoomEnd);

  _targetCanvas.call(_zoom);

  d3.select('.zoom-in').on('click', function() {
    let increment = .1;
    let k = EnergyMaps.transform.k + increment;
    let x = (
      EnergyMaps.transform.x + EnergyMaps.projectionWidth * (EnergyMaps.transform.k - k) / 2) / k;
    let y = (
      EnergyMaps.transform.y + EnergyMaps.projectionHeight * (EnergyMaps.transform.k - k) / 2) / k;
    let initial_transform = d3.zoomIdentity
      .scale(k)
      .translate(x, y);
    _targetCanvas.call(_zoom.transform, initial_transform);
    EnergyMaps.transform = {x: x, y: y, k: k};
    EnergyMaps.setCookieTransform();
  });

  d3.select('.zoom-out').on('click', function() {
    let increment = .1;
    let k = EnergyMaps.transform.k - increment;
    let x = (
      EnergyMaps.transform.x + EnergyMaps.projectionWidth * (EnergyMaps.transform.k - k) / 2)
      / k + EnergyMaps.transform.x;
    let y = (
      EnergyMaps.transform.y + EnergyMaps.projectionHeight * (EnergyMaps.transform.k - k) / 2)
      / k + EnergyMaps.transform.y;
    let initial_transform = d3.zoomIdentity
      .scale(k)
      .translate(x - EnergyMaps.transform.x, y - EnergyMaps.transform.y);
    _targetCanvas.call(_zoom.transform, initial_transform);
    EnergyMaps.transform = {x: x, y: y, k: k};
    EnergyMaps.setCookieTransform();
  });

  const _windowResize = _.debounce(function(e) {
    EnergyMaps.width = window.innerWidth * SCALE;
    EnergyMaps.height = window.outerHeight * SCALE;
    EnergyMaps.baseCanvas
      .attr('width', EnergyMaps.width)
      .attr('height', EnergyMaps.height);
    LAYERS = LAYERS.map(x => {
      x.canvas
        .attr('width', EnergyMaps.width)
        .attr('height', EnergyMaps.height);
      x.context.clearRect(0, 0, EnergyMaps.width, EnergyMaps.height);
      return x;
    });
    EnergyMaps.drawBaseMap(EnergyMaps.transform);
    EnergyMaps.drawActiveLayers(EnergyMaps.transform);
  }, 500, false);

  d3.select(window).on('resize', _windowResize);

  return EnergyMaps;

})(EnergyMaps || {});