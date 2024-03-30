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
  };

  const _zooming = function _zoomed
    ()
  {
    EnergyMaps.drawLand(EnergyMaps.baseCtx, [EnergyMaps.simpleMapBkgd],
      d3.event.transform, false, true);
  };

  const _zoomEnd = function _zoomEnd
    ()
  {
    EnergyMaps.transform = d3.event.transform
    EnergyMaps.kChanged = EnergyMaps.transform.k !== previousK;
    EnergyMaps.drawBaseMap(EnergyMaps.transform);
    EnergyMaps.drawActiveLayers(EnergyMaps.transform);
  }

  _.debounce(_zoomEnd, 500, false);

  const _zoom = d3.zoom()
    .scaleExtent([1, 15])
    .on('start', _zoomStart)
    .on('zoom', _zooming)
    .on('end', _zoomEnd);

  _targetCanvas.call(_zoom);

  d3.select('.zoom-in').on('click', function() {
    let that = _targetCanvas
      .call(_zoom.scaleBy, Math.sqrt(2));
  });

  d3.select('.zoom-out').on('click', function() {
    let that = _targetCanvas
      .call(_zoom.scaleBy, Math.sqrt(2) / 2);
  });

  const _windowResize = _.debounce(function(e) {
    EnergyMaps.width = window.outerWidth * SCALE;
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