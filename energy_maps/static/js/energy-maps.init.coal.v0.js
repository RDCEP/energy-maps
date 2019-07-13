(function() {
  'use strict';

  const fmap = '../static/json/us-geojson.json';
  const fmapfill = '../static/json/gz_2010_us_040_00_20m.json';
  const rrmap = '../static/json/railrdl020.geojson';
  // const mines = '../static/json/CoalMines_US_2013.geojson';
  const mines = '../static/csv/coal.csv';

  const canvas = d3.select('.main.map.coal')
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
      d3.json(rrmap),
    ]).then(function(files) {
      draw_railroads(ctx, files);
    }).then(function() {
      Promise.all([d3.csv(mines)]).then(function(files) {
        draw_coal_mines(ctx, files);
      });
    }).then(function() {
      Promise.all([
        d3.json(fmap),
        d3.json(fmapfill)
      ]).then(function(files) {
        draw_land(ctx, files, true);
      });
    });
  }).then(function() {
    coal_legend(ctx);
  });

})();
