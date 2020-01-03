(function() {
  "use strict";

  // Set the path for the map, railroad lines, and mines
  /** @type {string} */
  /** @description Sets the path for the map */
  const fmap = "../static/json/us-geojson.json";

  /** @type {string} */
  /** @description Sets the fill for the map */
  const fmapfill = "../static/json/gz_2010_us_040_00_20m.json";

  /** @type {string} */
  /** @description Sets the path for the rail road map */
  const rrmap = "../static/json/railrdl020.geojson";
  // const mines = '../static/json/CoalMines_US_2013.geojson';

  /** @type {string} */
  /** @description Sets the path for the mine locations */
  const mines = "../static/csv/coal.csv";

  // Set the map canvas element/create a drawing context
  // by selecting the div with the classes main, map, and coal
  // from the index page
  const canvas = d3
    .select(".main.map.coal")
    .append("canvas")
    .attr("id", "mapcanvas")
    .attr("width", canvas_width)
    .attr("height", height);
  const ctx = canvas.node().getContext("2d");
  ctx.LineCap = "round";

  /**
   * Fetch the JSON files for each map componenet
   * and then call global functions and coal-specific functions
   * to draw the base map, the railroad lines, the coal mines,
   * and the coal legend.
   *
   * TODO: Only allow a layer to be drawn if it is not
   * currently toggled
   *
   * TODO: Create a loader or some other heuristic signifier
   */

  draw_base_map();

  /**
   * Draw the base map and legend
   */
  function draw_base_map() {
    Promise.all([d3.json(fmap), d3.json(fmapfill)])
      .then(function(files) {
        draw_land(ctx, files);
      })
      .then(function() {
        coal_legend(ctx);
      });
  }

  /**
   * Create the railroad map layer.
   * TODO: Ensure that the railroads always appear below the mines
   */
  function layer_rrmap() {
    Promise.all([d3.json(rrmap)]).then(function(files) {
      draw_railroads(ctx, files);
    });
    console.log("Layer rrmap");
  }

  const rrmap_check = d3.select("#cb-rrmap");
  rrmap_check.on("change", function() {
    layer_rrmap();
  });

  /**
   * Create the coal mine layer.
   * TODO: Ensure that the railroads always appear below the mines
   */
  function layer_coalmines() {
    Promise.all([d3.csv(mines)]).then(function(files) {
      draw_coal_mines(ctx, files);
    });
    console.log("layer coal mines");
  }

  const coal_check = d3.select("#cb-coal");
  coal_check.on("change", function() {
    layer_coalmines();
  });

  // Redraw the base map and uncheck any checkboxes to present a
  // "blank slate" to the user.
  const clear = d3.select("#clear");
  clear.on("click", function() {
    draw_base_map();
    d3.selectAll(".checkbox").property("checked", false);
  });

  // untainted original map drawing code below held as reference

  // Promise.all([
  //   d3.json(fmap),
  //   d3.json(fmapfill)
  // ]).then(function(files) {
  //   draw_land(ctx, files);
  // }).then(function() {
  //   Promise.all([
  //     d3.json(rrmap),
  //   ]).then(function(files) {
  //     draw_railroads(ctx, files);
  //   }).then(function() {
  //     Promise.all([d3.csv(mines)]).then(function(files) {
  //       draw_coal_mines(ctx, files);
  //     });
  //   }).then(function() { // What's going on here? Looks redundant but I'm not sure.
  //     Promise.all([
  //       d3.json(fmap),
  //       d3.json(fmapfill)
  //     ]).then(function(files) {
  //       draw_land(ctx, files, true);
  //     });
  //   });
  // }).then(function() {
  //   coal_legend(ctx);
  // });

  // function cb_toggle_test() {
  //   console.log("checkbox clicked")
  // }
})();
(function() {
  "use strict";

  // Set the path for the map, railroad lines, and mines
  /** @type {string} */
  /** @description Sets the path for the map */
  const fmap = "../static/json/us-geojson.json";

  /** @type {string} */
  /** @description Sets the fill for the map */
  const fmapfill = "../static/json/gz_2010_us_040_00_20m.json";

  /** @type {string} */
  /** @description Sets the path for the rail road map */
  const rrmap = "../static/json/railrdl020.geojson";
  // const mines = '../static/json/CoalMines_US_2013.geojson';

  /** @type {string} */
  /** @description Sets the path for the mine locations */
  const mines = "../static/csv/coal.csv";

  // Set the map canvas element/create a drawing context
  // by selecting the div with the classes main, map, and coal
  // from the index page
  const canvas = d3
    .select(".main.map.coal")
    .append("canvas")
    .attr("id", "mapcanvas")
    .attr("width", canvas_width)
    .attr("height", height);
  const ctx = canvas.node().getContext("2d");
  ctx.LineCap = "round";

  /**
   * Fetch the JSON files for each map componenet
   * and then call global functions and coal-specific functions
   * to draw the base map, the railroad lines, the coal mines,
   * and the coal legend.
   *
   * TODO: Only allow a layer to be drawn if it is not
   * currently toggled
   *
   * TODO: Create a loader or some other heuristic signifier
   */

  draw_base_map();

  /**
   * Draw the base map and legend
   */
  function draw_base_map() {
    Promise.all([d3.json(fmap), d3.json(fmapfill)])
      .then(function(files) {
        draw_land(ctx, files);
      })
      .then(function() {
        coal_legend(ctx);
      });
  }

  /**
   * Create the railroad map layer.
   * TODO: Ensure that the railroads always appear below the mines
   */
  function layer_rrmap() {
    Promise.all([d3.json(rrmap)]).then(function(files) {
      draw_railroads(ctx, files);
    });
    console.log("Layer rrmap");
  }

  const rrmap_check = d3.select("#cb-rrmap");
  rrmap_check.on("change", function() {
    layer_rrmap();
  });

  /**
   * Create the coal mine layer.
   * TODO: Ensure that the railroads always appear below the mines
   */
  function layer_coalmines() {
    Promise.all([d3.csv(mines)]).then(function(files) {
      draw_coal_mines(ctx, files);
    });
    console.log("layer coal mines");
  }

  const coal_check = d3.select("#cb-coal");
  coal_check.on("change", function() {
    layer_coalmines();
  });

  // Redraw the base map and uncheck any checkboxes to present a
  // "blank slate" to the user.
  const clear = d3.select("#clear");
  clear.on("click", function() {
    draw_base_map();
    d3.selectAll(".checkbox").property("checked", false);
  });

  // untainted original map drawing code below held as reference

  // Promise.all([
  //   d3.json(fmap),
  //   d3.json(fmapfill)
  // ]).then(function(files) {
  //   draw_land(ctx, files);
  // }).then(function() {
  //   Promise.all([
  //     d3.json(rrmap),
  //   ]).then(function(files) {
  //     draw_railroads(ctx, files);
  //   }).then(function() {
  //     Promise.all([d3.csv(mines)]).then(function(files) {
  //       draw_coal_mines(ctx, files);
  //     });
  //   }).then(function() { // What's going on here? Looks redundant but I'm not sure.
  //     Promise.all([
  //       d3.json(fmap),
  //       d3.json(fmapfill)
  //     ]).then(function(files) {
  //       draw_land(ctx, files, true);
  //     });
  //   });
  // }).then(function() {
  //   coal_legend(ctx);
  // });

  // function cb_toggle_test() {
  //   console.log("checkbox clicked")
  // }
})();
