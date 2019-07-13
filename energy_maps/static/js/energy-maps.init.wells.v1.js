(function() {
  'use strict';

  const fmap = '/static/json/us-geojson.json';
  const fmapfill = '/static/json/gz_2010_us_040_00_20m.json';
  const wells1 = '/static/csv/Wells1.csv';
  const wells2 = '/static/csv/Wells2.csv';
  const wells3 = '/static/csv/Wells3.csv';
  const wells4 = '/static/csv/Wells4.csv';

  const canvas = d3.select('.main.map.gas_oil')
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', width + SCALE * 100)
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
      d3.json('/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson'),
      d3.json('/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson'),
      d3.json('/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson')
    ]).then(function(files) {
      draw_pipes(ctx, files);
    }).then(function() {
      Promise.all([d3.json('/static/json/Petroleum_Refineries_US_2015.geojson')
      ]).then(function(files) {
        draw_refining(ctx, files);
        Promise.all([d3.csv(wells1)]).then(function(files) {
          draw_all_wells(ctx, files);
        }).then(function() {
          Promise.all([d3.csv(wells2)]).then(function(files) {
            draw_all_wells(ctx, files);
          }).then(function() {
            Promise.all([d3.csv(wells3)]).then(function(files) {
              draw_all_wells(ctx, files);
            }).then(function() {
              Promise.all([d3.csv(wells4)]).then(function(files) {
                draw_all_wells(ctx, files);
              }).then(function() {
                Promise.all([
                  d3.csv('/static/csv/nproc.csv'),
                  d3.csv('/static/csv/nstor.csv'),
                  //// d3.json('../static/json/Petroleum_Refineries_US_2015.geojson')
                ]).then(function(files) {
                  draw_processing(ctx, files);
                });
              }).then(function() {
                Promise.all([
                  d3.json(fmap),
                  d3.json(fmapfill)
                ]).then(function(files) {
                  draw_land(ctx, files, true);
                });
              });
            });
          })
        })
      });
    });
  }).then(function() {
    wells_legend(ctx);
  });

})();
