(function() {
  'use strict';

  const fmap = '../static/json/us-geojson.json';
  const fmapfill = '../static/json/gz_2010_us_040_00_20m.json';
  // const gridmap = '../static/json/Electric_Power_Transmission_Lines.geojson';
  const gridmap = '../static/json/Electric_Power_Transmission_Lines_011s.geojson';

  const canvas = d3.select('.main.map.grid')
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
      d3.json(gridmap),
    ]).then(function(files) {
      draw_grid(ctx, files);
      // draw_grid2(ctx, files);
    }).then(function() {
      Promise.all([
        d3.json(fmap),
        d3.json(fmapfill)
      ]).then(function(files) {
        draw_land(ctx, files, true);
      });
    });
  }).then(function() {
    grid_legend(ctx);
  });

})();
