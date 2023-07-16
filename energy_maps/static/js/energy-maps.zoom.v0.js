EnergyMaps = (function (energy_maps, InfrastructureSet) {

  'use strict';

  const _target_canvas = d3.select('.map.layer.zoom-target');

  let prev_k = TRANSFORM.k;

  const _zoom_start = function _zoom_start
    ()
  {
    console.log('zoom start');
    prev_k = TRANSFORM.k;
    LAYERS = LAYERS.map(layer => {
        layer.context.clearRect(0, 0, WIDTH, HEIGHT);
        return layer;
      }
    );
    TRANSFORM = d3.event.transform;
  };

  const _zoomed = function _zoomed
    ()
  {
    TRANSFORM = d3.event.transform;
    energy_maps.draw_land(energy_maps.base_ctx, [energy_maps.simple_map_bkgd], TRANSFORM, false, true);
  };

  const _zoom_end = _.debounce(function(e) {
    energy_maps.k_changed = TRANSFORM.k !== prev_k;
    energy_maps.draw_base_map(TRANSFORM);
    energy_maps.draw_active_layers(TRANSFORM);
  }, 500, false);

  const _zoom = d3.zoom()
    .scaleExtent([0, 50])
    .on('start', _zoom_start)
    .on('zoom', _zoomed)
    .on('end', _zoom_end);

  _target_canvas.call(_zoom);

  d3.select('.zoom-in').on('click', function() {
    let increment = .1;
    let k = TRANSFORM.k + increment;
    let x = (
      TRANSFORM.x + energy_maps.projection_width * (TRANSFORM.k - k) / 2) / k;
    let y = (
      TRANSFORM.y + energy_maps.projection_height * (TRANSFORM.k - k) / 2) / k;
    let initial_transform = d3.zoomIdentity
      .scale(k)
      .translate(x, y);
    _target_canvas.call(_zoom.transform, initial_transform);
  });

  d3.select('.zoom-out').on('click', function() {
    let increment = .1;
    let k = TRANSFORM.k - increment;
    let x = (
      TRANSFORM.x + energy_maps.projection_width * (TRANSFORM.k - k) / 2)
      / k + TRANSFORM.x;
    let y = (
      TRANSFORM.y + energy_maps.projection_height * (TRANSFORM.k - k) / 2)
      / k + TRANSFORM.y;
    let initial_transform = d3.zoomIdentity
      .scale(k)
      .translate(x - TRANSFORM.x, y - TRANSFORM.y);
    _target_canvas.call(_zoom.transform, initial_transform);
  });

  const _window_resize = _.debounce(function(e) {
    WIDTH = window.innerWidth * SCALE;
    HEIGHT = window.innerHeight * SCALE;
    console.log('resize', WIDTH, HEIGHT)
    energy_maps.base_canvas
      .attr('width', WIDTH)
      .attr('height', HEIGHT);
    LAYERS = LAYERS.map(x => {
      x.canvas
        .attr('width', WIDTH)
        .attr('height', HEIGHT);
      x.context.clearRect(0, 0, WIDTH, HEIGHT);
      return x;
    });
    energy_maps.draw_base_map(TRANSFORM);
    energy_maps.draw_active_layers(TRANSFORM);
  }, 500, false);

  d3.select(window).on('resize', _window_resize);

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);