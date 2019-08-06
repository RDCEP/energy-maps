(function() {
  'use strict';

  const fmap = '/static/json/us-geojson.json';
  const fmapfill = '/static/json/gz_2010_us_040_00_20m.json';

  const canvas = d3.select('.main.map.power.nff')
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', width + SCALE * 400)
    .attr('height', height);
  const ctx = canvas.node().getContext('2d');
  ctx.LineCap = 'round';

  function draw_base_map() {
    Promise.all([
      d3.json(fmap),
      d3.json(fmapfill)
    ]).then(function(files) {
      draw_land(ctx, files);
    })
  }

  function draw_nff() {
    Promise.all([d3.json('/static/json/PowerPlants_US_2014Aug_R.geojson')])
    .then(function(files) {
      draw_nff_plants(ctx, files);
    })
  }

  draw_base_map();
  draw_nff();

  // Promise.all([
  //   d3.json(fmap),
  //   d3.json(fmapfill)
  // ]).then(function(files) {
  //   draw_land(ctx, files);
  // }).then(function() {
  //   Promise.all([d3.json('/static/json/PowerPlants_US_2014Aug_R.geojson')])
  //     .then(function(files) {
  //       draw_nff_plants(ctx, files);
  //     }).then(function() {
  //       Promise.all([
  //         d3.json(fmap),
  //         d3.json(fmapfill)
  //       ]).then(function(files) {
  //         draw_land(ctx, files, true);
  //       });
  //     });
  // });
})();
