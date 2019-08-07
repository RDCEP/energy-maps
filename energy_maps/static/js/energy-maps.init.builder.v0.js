(function() {
  "use strict";

  // ######## Path Variables ######## //

  // Path Group: Base map

  /** @type {string} */
  /** @description Sets the path for the base map */
  const fmap = "../static/json/us-geojson.json";
  /** @type {string} */
  /** @description Sets the fill for the base map */
  const fmapfill = "../static/json/gz_2010_us_040_00_20m.json";

  // Path Group: US gas & oil

  // Wells
  /** @type {string} */
  /** @description Sets the path for the first group of gas wells */
  const wells_gas1 = "/static/csv/wells_gas1.csv";
  /** @type {string} */
  /** @description Sets the path for the second group of gas wells */
  const wells_gas2 = "/static/csv/wells_gas2.csv";
  /** @type {string} */
  /** @description Sets the path for the first group of oil wells */
  const wells_oil1 = "/static/csv/wells_oil1.csv";
  /** @type {string} */
  /** @description Sets the path for the second group of oil wells */
  const wells_oil2 = "/static/csv/wells_oil2.csv";
  /** @type {string} */
  /** @description Sets the path for the first mixed group of wells */
  const wells1 = "/static/csv/Wells1.csv";
  /** @type {string} */
  /** @description Sets the path for the second mixed group of wells */
  const wells2 = "/static/csv/Wells2.csv";
  /** @type {string} */
  /** @description Sets the path for the third mixed group of wells */
  const wells3 = "/static/csv/Wells3.csv";
  /** @type {string} */
  /** @description Sets the path for the fourth mixed group of wells */
  const wells4 = "/static/csv/Wells4.csv";

  // Pipelines
  /** @description Sets the path for the crude oil pipelines */
  const crude_oil_pipelines =
    "/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson";
  /** @description Sets the path for the petroleum product pipelines */
  const petroleum_product_pipelines =
    "/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson";
  /** @description Sets the path for the inter-intrastate natural gas pipelines */
  const natural_gas_pipelines =
    "/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson";
  /** @description Sets the path for the petroleum refineries */
  const petroleum_refineries =
    "/static/json/Petroleum_Refineries_US_2015.geojson";

  // Path Group: Coal

  /** @type {string} */
  /** @description Sets the path for the rail road map */
  const rrmap = "../static/json/railrdl020.geojson";
  // const mines = '../static/json/CoalMines_US_2013.geojson';
  /** @type {string} */
  /** @description Sets the path for the mine locations */
  const mines = "../static/csv/coal.csv";

  // Path Group: US power plants, fossil fuel & non-fossil fuel

  /** @description Sets the path for the power plants */
  const power_plants = "/static/json/PowerPlants_US_2014Aug_R.geojson";

  const gridmap =
    "../static/json/Electric_Power_Transmission_Lines_011s.geojson";

  // ######## Canvas Map Layers ######## //

  /** @description An array of keys for canvases{}.  */
  let layers = [
    "gas-well",
    "oil-well",
    "off-shore-well",
    "gas-pipeline",
    "oil-pipeline",
    "oil-product-pipeline",
    "gas-processing",
    "gas-storage",
    "oil-refinery",
    "railroad",
    "coal-mine",
    "natural-gas-plant",
    "petroleum-plant",
    "coal-plant",
    "non-fossil-fuel-plant",
    "solar-plant",
    "wind-plant",
    "hydro-plant",
    "nuclear-plant",
    "geothermal-plant",
    "fossil-fuel-plant",
    "electrical-grid"
  ];

  /** @description An object of layers mapped to canvas nodes. Used to dynamically generate map layer divs and attach their canvases. */
  let canvases = {};
  /** @description An object of canvas drawing contexts for each map layer's canvas element. */
  let contexts = {};
  let checkboxes = {};

  for (let i = 0; i < layers.length; i++) {
    canvases[layers[i]] = d3
      .select(".map.wrapper")
      .append("div")
      .attr("class", `map layer ${layers[i]}`)
      .append("canvas")
      .attr("class", `map layer canvas ${layers[i]}`)
      .attr("width", width + SCALE * 400)
      .attr("height", height);
    console.log(`<div map layer ${layers[i]}> created!`);

    contexts[layers[i]] = canvases[layers[i]].node().getContext("2d");
    console.log(contexts[i]); // currently displaying 'undefined'

    checkboxes[layers[i]] = d3
      .select(".options")
      .append("label")
      .text(`${layers[i]}`)
      .append("input")
      .attr("type", "checkbox")
      .attr("class", `checkbox ${layers[i]}`);
  }

  console.log(
    canvases,
    `canvases{} length: ${Object.keys(canvases).length}`,
    contexts
  );

  // Set base map canvas
  /** @description A canvas element for the base map, attached to div "main map builder" with id="mapcanvas" */
  const base_canvas = d3
    .select(".main.map.builder")
    .append("canvas")
    .attr("id", "mapcanvas")
    .attr("width", width + SCALE * 400)
    .attr("height", height);
  const ctx = base_canvas.node().getContext("2d");
  ctx.LineCap = "round";

  // ######## Init Functions ######## //

  /** TODO: Move draw_base_map() to .builder.funcs.js and see
   * if you can get it to reach this file. Didn't work last time.  */
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
    console.log("draw base map");
  }

  /**
   * Functions for drawing individual layers go here:
   * ####################################################
   */

  /** @description A canvas element for the gas wells, attached to div "map layer canvas gas-well" */
  let gas_well = d3.select(".map.layer.canvas.gas-well");
  let ctx_gas_well = gas_well.node().getContext("2d");
  ctx_gas_well.LineCap = "round";

  /** @description A canvas element for the oil wells, attached to div "map layer canvas oil-well" */
  let oil_well = d3.select(".map.layer.canvas.oil-well");
  let ctx_oil_well = oil_well.node().getContext("2d");
  ctx_oil_well.LineCap = "round";

  /** @description A canvas element for the gas pipelines, attached to div "map layer canvas gas-pipeline" */
  let gas_pipeline = d3.select(".map.layer.canvas.gas-pipeline");
  let ctx_gas_pipeline = gas_pipeline.node().getContext("2d");
  ctx_gas_pipeline.LineCap = "round";

   /** @description A canvas element for the oil pipelines, attached to div "map layer canvas oil-pipeline" */
  let oil_pipeline = d3.select(".map.layer.canvas.oil-pipeline");
  let ctx_oil_pipeline = oil_pipeline.node().getContext("2d");
  ctx_oil_pipeline.LineCap = "round";

  /** @description A canvas element for the oil product pipelines, attached to div "map layer canvas oil-pipeline" */
  let oil_prod_pipeline = d3.select(".map.layer.canvas.oil-product-pipeline");
  let ctx_oil_prod_pipeline = oil_prod_pipeline.node().getContext("2d");
  ctx_oil_prod_pipeline.LineCap = "round";

  /** @description A canvas element for the oil refineries, attached to div "map layer canvas oil-refinery" */
  let oil_refinery = d3.select(".map.layer.canvas.oil-refinery");
  let ctx_oil_refinery = oil_refinery.node().getContext("2d");
  ctx_oil_refinery.LineCap = "round";

  /** @description A canvas element for the coal mines, attached to div "map layer canvas coal-mine" */
  let coalmines = d3.select(".map.layer.canvas.coal-mine");
  let ctx_coalmines = coalmines.node().getContext("2d");
  ctx_coalmines.LineCap = "round";

  /** @description A canvas element for the railroad map, attached to div "map layer canvas railroad" */
  let railroad = d3.select(".map.layer.canvas.railroad");
  let ctx_railroad = railroad.node().getContext("2d");
  ctx_railroad.LineCap = "round";

  /** @description A canvas element for the non-fossil-fuel plants, attached to div "map layer canvas non-fossil-fuel-plant" */
  let nffplant = d3.select(".map.layer.canvas.non-fossil-fuel-plant");
  /** @description A drawing context for the non-fossil-fuel plants, attached to canvas "map layer non-fossil-fuel-plant" */
  let ctx_nffplant = nffplant.node().getContext("2d");
  ctx_nffplant.LineCap = "round";

  /** @description A canvas element for the fossil-fuel plants, attached to div "map layer canvas fossil-fuel-plant" */
  let ffplant = d3.select(".map.layer.canvas.fossil-fuel-plant");
  let ctx_ffplant = ffplant.node().getContext("2d");
  ctx_ffplant.LineCap = "round";

  /** @description A canvas element for the electrical grid, attached to div "map layer canvas electrical-grid" */
  let grid = d3.select(".map.layer.canvas.electrical-grid");
  let ctx_grid = grid.node().getContext("2d");
  ctx_grid.LineCap = "round";

  /**
   * Create the gas well layer.
   * TODO: solve foreach console error in draw_gas_wells() under funcs.wells..js
   */
  function layer_gas_well() {
    Promise.all([d3.csv(wells_gas1)])
      .then(function(files) {
        draw_all_wells(ctx_gas_well, files);
      })
      .then(function() {
        Promise.all([d3.csv(wells_gas2)]).then(function(files) {
          draw_all_wells(ctx_gas_well, files);
        });
      });
  }

  const gas_well_check = d3.select(".checkbox.gas-well");
  let gas_well_counter = 0;
  gas_well_check.on("change", function() {
    gas_well_counter++;
    if (gas_well_counter % 2 == 0) {
      gas_well.remove();
      console.log(`gas-well counter is even, value of ${gas_well_counter}`);
      d3.select(".map.layer.gas-well")
        .append("canvas")
        .attr("class", "map layer canvas gas-well")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (gas_well_counter > 1) {
          gas_well = d3.select(".map.layer.canvas.gas-well");
          ctx_gas_well = gas_well.node().getContext("2d");
          ctx_gas_well.LineCap = "round";
        }
        console.log(`gas well counter is odd, value of ${gas_well_counter}`);
        layer_gas_well();
    }
  });

  /**
   * Create the oil well layer.
   */
  function layer_oil_well() {
    Promise.all([d3.csv(wells_oil1)])
      .then(function(files) {
        draw_all_wells(ctx_oil_well, files);
      })
      .then(function() {
        Promise.all([d3.csv(wells_oil2)]).then(function(files) {
          draw_all_wells(ctx_oil_well, files);
        });
      });
  }

  const oil_well_check = d3.select(".checkbox.oil-well");
  let oil_well_counter = 0;
  oil_well_check.on("change", function() {
    oil_well_counter++;
    if (oil_well_counter % 2 == 0) {
      oil_well.remove();
      console.log(`oil-well counter is even, value of ${oil_well_counter}`);
      d3.select(".map.layer.oil-well")
        .append("canvas")
        .attr("class", "map layer canvas oil-well")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (oil_well_counter > 1) {
          oil_well = d3.select(".map.layer.canvas.oil-well");
          ctx_oil_well = oil_well.node().getContext("2d");
          ctx_oil_well.LineCap = "round";
        }
        console.log(`oil well counter is odd, value of ${oil_well_counter}`);
        layer_oil_well();
    }
  });

  /**
   * Create the gas pipeline layer.
   */
  function layer_gas_pipeline() {
    Promise.all([
      d3.json('/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson')
    ]).then(function(files) {
      draw_pipes(ctx_gas_pipeline, files);
    })
  }

  const gas_pipeline_check = d3.select(".checkbox.gas-pipeline");
  let gas_pipeline_counter = 0;
  gas_pipeline_check.on("change", function() {
    gas_pipeline_counter++;
    if (gas_pipeline_counter % 2 == 0) {
      gas_pipeline.remove();
      console.log(`gas-pipeline counter is even, value of ${gas_pipeline_counter}`);
      d3.select(".map.layer.gas-pipeline")
        .append("canvas")
        .attr("class", "map layer canvas gas-pipeline")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (gas_pipeline_counter > 1) {
          gas_pipeline = d3.select(".map.layer.canvas.gas-pipeline");
          ctx_gas_pipeline = gas_pipeline.node().getContext("2d");
          ctx_gas_pipeline.LineCap = "round";
        }
        console.log(`gas pipeline counter is odd, value of ${gas_pipeline_counter}`);
        layer_gas_pipeline();
    }
  });

  /**
   * Create the oil pipeline layer.
   */
  function layer_oil_pipeline() {
    Promise.all([
      d3.json('/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson')
    ]).then(function(files) {
      draw_pipes(ctx_oil_pipeline, files);
    })
  }

  const oil_pipeline_check = d3.select(".checkbox.oil-pipeline");
  let oil_pipeline_counter = 0;
  oil_pipeline_check.on("change", function() {
    oil_pipeline_counter++;
    if (oil_pipeline_counter % 2 == 0) {
      oil_pipeline.remove();
      console.log(`oil-pipeline counter is even, value of ${oil_pipeline_counter}`);
      d3.select(".map.layer.oil-pipeline")
        .append("canvas")
        .attr("class", "map layer canvas oil-pipeline")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (oil_pipeline_counter > 1) {
          oil_pipeline = d3.select(".map.layer.canvas.oil-pipeline");
          ctx_oil_pipeline = oil_pipeline.node().getContext("2d");
          ctx_oil_pipeline.LineCap = "round";
        }
        console.log(`oil pipeline counter is odd, value of ${oil_pipeline_counter}`);
        layer_oil_pipeline();
    }
  });

  /**
   * Create the oil product pipeline layer.
   */
  function layer_oil_prod_pipeline() {
    Promise.all([
      d3.json('/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson')
    ]).then(function(files) {
      draw_pipes(ctx_oil_prod_pipeline, files);
    })
  }

  const oil_prod_pipeline_check = d3.select(".checkbox.oil-product-pipeline");
  let oil_prod_pipeline_counter = 0;
  oil_prod_pipeline_check.on("change", function() {
    oil_prod_pipeline_counter++;
    if (oil_prod_pipeline_counter % 2 == 0) {
      oil_prod_pipeline.remove();
      console.log(`oil-prod-pipeline counter is even, value of ${oil_prod_pipeline_counter}`);
      d3.select(".map.layer.oil-product-pipeline")
        .append("canvas")
        .attr("class", "map layer canvas oil-prod-pipeline")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (oil_prod_pipeline_counter > 1) {
          oil_prod_pipeline = d3.select(".map.layer.canvas.oil-prod-pipeline");
          ctx_oil_prod_pipeline = oil_prod_pipeline.node().getContext("2d");
          ctx_oil_prod_pipeline.LineCap = "round";
        }
        console.log(`oil product pipeline counter is odd, value of ${oil_prod_pipeline_counter}`);
        layer_oil_prod_pipeline();
    }
  });

  /**
   * Create the oil product pipeline layer.
   */

  function layer_oil_refinery() {
    Promise.all([d3.json('/static/json/Petroleum_Refineries_US_2015.geojson')
      ]).then(function(files) {
        draw_refining(ctx_oil_refinery, files);
    });
  }

  const oil_refinery_check = d3.select(".checkbox.oil-refinery");
  let oil_refinery_counter = 0;
  oil_refinery_check.on("change", function() {
    oil_refinery_counter++;
    if (oil_refinery_counter % 2 == 0) {
      oil_refinery.remove();
      console.log(`oil-refinery counter is even, value of ${oil_refinery_counter}`);
      d3.select(".map.layer.oil-refinery")
        .append("canvas")
        .attr("class", "map layer canvas oil-refinery")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (oil_refinery_counter > 1) {
          oil_refinery = d3.select(".map.layer.canvas.oil-refinery");
          ctx_oil_refinery= oil_refinery.node().getContext("2d");
          ctx_oil_refinery.LineCap = "round";
        }
        console.log(`oil refinery counter is odd, value of ${oil_refinery_counter}`);
        layer_oil_refinery();
    }
  });

  /**
   * Create the coal mine layer.
   * TODO: Ensure that the railroads always appear below the mines
   */
  function layer_coalmines() {
    Promise.all([d3.csv(mines)]).then(function(files) {
      draw_coal_mines(ctx_coalmines, files).then(function() {
        coal_legend(ctx);
      });
    });
    console.log("layer coal mines");
  }

  // TODO: Generalize this into a function
  const coal_check = d3.select(".checkbox.coal-mine");
  let coal_counter = 0;
  coal_check.on("change", function() {
    coal_counter++;
    if (coal_counter % 2 == 0) {
      console.log(`coal counter is even, value of ${coal_counter}`);
      coalmines.remove();
      d3.select(".map.layer.coal-mine")
        .append("canvas")
        .attr("class", "map layer canvas coal-mine")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (coal_counter > 1) {
          coalmines = d3.select(".map.layer.canvas.coal-mine");
          ctx_coalmines = coalmines.node().getContext("2d");
          ctx_coalmines.LineCap = "round";
        }
        console.log(`coal counter is odd, value of ${coal_counter}`);
        layer_coalmines();
    }
  });

  /**
   * Create the railroad map layer.
   * TODO: Ensure that the railroads always appear below the mines
   */
  function layer_rrmap() {
    Promise.all([d3.json(rrmap)]).then(function(files) {
      draw_railroads(ctx_railroad, files);
    });
    console.log("Layer rrmap");
  }

  const rrmap_check = d3.select(".checkbox.railroad");
  let rrmap_counter = 0;
  rrmap_check.on("change", function() {
    rrmap_counter++;
    if (rrmap_counter % 2 == 0) {
      console.log(`rrmap counter is even, value of ${rrmap_counter}`);
      railroad.remove();
      d3.select(".map.layer.railroad")
        .append("canvas")
        .attr("class", "map layer canvas railroad")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (rrmap_counter > 1) {
          railroad = d3.select(".map.layer.canvas.railroad");
          ctx_railroad = railroad.node().getContext("2d");
          ctx_railroad.LineCap = "round";
        }
        console.log(`railroad counter is odd, value of ${rrmap_counter}`);
        layer_rrmap();
    }
  });

  /**
   * Create the non-fossil-fuel plant layer.
   */
  function layer_nff() {
    Promise.all([d3.json('/static/json/PowerPlants_US_2014Aug_R.geojson')])
    .then(function(files) {
      draw_nff_plants(ctx_nffplant, files);
    })
  }

  const nff_check = d3.select(".checkbox.non-fossil-fuel-plant");
  let nff_counter = 0;
  nff_check.on("change", function() {
    nff_counter++;
    if (nff_counter % 2 == 0) {
      console.log(`nff counter is even, value of ${nff_counter}`);
      nffplant.remove();
      d3.select(".map.layer.non-fossil-fuel-plant")
        .append("canvas")
        .attr("class", "map layer canvas non-fossil-fuel-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (nff_counter > 1) {
          nffplant = d3.select(".map.layer.canvas.non-fossil-fuel-plant");
          ctx_nffplant = nffplant.node().getContext("2d");
          ctx_nffplant.LineCap = "round";
        }
        console.log(`nff counter is odd, value of ${nff_counter}`);
        layer_nff();
    }
  });
  
  /**
   * Create the fossil-fuel plant layer.
   */
  function layer_ff() {
    Promise.all([
      d3.json("/static/json/PowerPlants_US_2014Aug_R.geojson")
    ]).then(function(files) {
      draw_ff_plants(ctx_ffplant, files);
    });
  }

  const ff_check = d3.select(".checkbox.fossil-fuel-plant");
  let ff_counter = 0;
  ff_check.on("change", function() {
    ff_counter++;
    if (ff_counter % 2 == 0) {
      console.log(`ff counter is even, value of ${ff_counter}`);
      ffplant.remove();
      d3.select(".map.layer.fossil-fuel-plant")
        .append("canvas")
        .attr("class", "map layer canvas fossil-fuel-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (ff_counter > 1) {
          ffplant = d3.select(".map.layer.canvas.fossil-fuel-plant");
          ctx_ffplant = ffplant.node().getContext("2d");
          ctx_ffplant.LineCap = "round";
        }
        console.log(`ff counter is odd, value of ${ff_counter}`);
        layer_ff();
    }
  });

  /**
   * Create the electrical grid layer.
   */
  function layer_grid() {
    Promise.all([d3.json(gridmap)]).then(function(files) {
      draw_grid(ctx_grid, files).then(function() {
        grid_legend(ctx);
      });
    });
  }

  const grid_check = d3.select(".checkbox.electrical-grid");
  let grid_counter = 0;
  grid_check.on("change", function() {
    grid_counter++;
    if (grid_counter % 2 == 0) {
      console.log(`grid counter is even, value of ${grid_counter}`);
      grid.remove();
      d3.select(".map.layer.electrical-grid")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (grid_counter > 1) {
          grid = d3.select(".map.layer.canvas.electrical-grid");
          ctx_grid = grid.node().getContext("2d");
          ctx_grid.LineCap = "round";
        }
        console.log(`grid counter is odd, value of ${grid_counter}`);
        layer_grid();
    }
  });

  // Toggle function
  /**
   * Draw a layer to or remove a layer from the map.
   * @param {Object} layer - the layer to be drawn to or removed from the map.
   */
  function toggle_layer(layer) {
    /* take layers created above as an argument,
     * which will create each relevant DOM node
     * and on user action, remove element from the DOM
     */
    //  const l = d3.select(`.checkbox.${layer}`)
  }

  // ######## Initializing Behavior ######## //

  draw_base_map();
})();
