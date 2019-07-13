(function() {
  'use strict';

  const fmap = '../static/json/us-geojson.json';
  const fmapfill = '../static/json/gz_2010_us_040_00_20m.json';

  const canvas = d3.select('.main.map.power')
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', width + SCALE * 400)
    .attr('height', height);
  const ctx = canvas.node().getContext('2d');
  ctx.LineCap = 'round';

  Promise.all([
    d3.json(fmap),
    d3.json(fmapfill)
  ]).then(function(files) {
    draw_land(ctx, files);
  }).then(function() {
    Promise.all([
      // d3.json('../static/json/CrudeOil_Pipelines_US_Nov2014.geojson'),
      // d3.json('../static/json/PetroleumProduct_Pipelines_US_Nov2014.geojson'),
      // d3.json('../static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson')
    ]).then(function(files) {
      // draw_pipes(files);
    }).then(function() {
      // Promise.all([d3.csv('../static/csv/powerplants.csv')])
      Promise.all([d3.json('../static/json/PowerPlants_US_2014Aug_R.geojson')])
        .then(function(files) {
          draw_power_plants(ctx, files);
        }).then(function() {
          Promise.all([
            d3.json(fmap),
            d3.json(fmapfill)
          ]).then(function(files) {
            draw_land(ctx, files, true);
          });
        });
    });
  });
})();
