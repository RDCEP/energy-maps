(function() {
  "use strict";

  // Write all data files to local storage
  

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
  /** @description Sets the path for the oil product pipelines */
  const oil_product_pipelines =
    "/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson";
  /** @description Sets the path for the inter-intrastate natural gas pipelines */
  const natural_gas_pipelines =
    "/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson";
  /** @description Sets the path for the petroleum refineries */
  const petroleum_refineries =
    "/static/json/Petroleum_Refineries_US_2015.geojson";
  /** @description Sets the path for the gas processing facilities */
  const gas_processing_path = 
  "/static/csv/nproc.csv";

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

  // // Loading
  // let spinner = document.getElementById("spinner");
  // const sleep = milliseconds => {
  //   return new Promise(resolve => setTimeout(resolve, milliseconds));
  // };
  // /** @description display the loading spinner for user set time in milliseconds */
  // const load = async time => {
  //   // show the spinner
  //   spinner.style.display = "block";
  //   await sleep(time);
  //   // hide the spinner
  //   spinner.style.display = "none";
  // };

  /** @description An array of keys for canvases{}.  */
  let layers = [
    "gas-well",
    "oil-well",
    "gas-pipeline",
    "oil-pipeline",
    "gas-processing",
    "oil-refinery",
    "railroad",
    "coal-mine",
    "non-fossil-fuel-plant",
    "fossil-fuel-plant",
    "complete-electrical-grid",
    "unavailable-kv",
    "ac-lines"
  ];

  let unimplemented_layers = [
    "oil-product-pipeline",
    "off-shore-well",
    "gas-storage",
    "natural-gas-plant",
    "petroleum-plant",
    "coal-plant",
    "solar-plant",
    "wind-plant",
    "hydro-plant",
    "nuclear-plant",
    "geothermal-plant"
  ];

  let gas_well_val = 1_059_000_000_000; // 1.06B || 1,059 B -- US only
  let oil_well_val = 654_000_000_000; // 654 B
  let gas_pipeline_val = 940_000_000_000; // 940 B
  let oil_pipeline_val = 170_000_000_000; // 170 B
  let oil_prod_pipeline_val = 0; // -- not specified separately - this is part of oil pipeline
  let gas_processing_val = 45_000_000_000; // 45 B
  let oil_refinery_val = 373_000_000_000; // 373 B
  let railroad_val = 137_000_000_000; // `137 B *` Needs an asterisk because this is 1/3 of the value of the freight railway shown
  let coalmine_val = 57_000_000_000; // 57 B
  let nff_val = 1_156_000_000_000; // 1.16T || 1,156 B -- (Break this into nuclear, hydro, wind, solar , etc. when we have layers separate)
  let ff_val = 1_645_000_000_000; // 1.65T || 1,645B (Break this into coal, oil, and gas when we have layers separate)
  let electrical_grid_val = 2_946_000_000_000; // 2.95T || 2,946 B
  let unavailable_kv_val = 0; // TBD
  let ac_lines_val = 0; // TBD

  let asset_values = [
    gas_well_val, // gas well
    oil_well_val, // oil well
    gas_pipeline_val, // gas pipeline
    oil_pipeline_val, // oil pipeline
    oil_prod_pipeline_val, // oil prod pipeline
    gas_processing_val, // gas processing
    oil_refinery_val, // oil refinery
    railroad_val, // railroad
    coalmine_val, // coal mine
    nff_val, // non fossil fuel plant
    ff_val, // fossil fuel plant
    electrical_grid_val, // electrical grid
    unavailable_kv_val, // electrical grid class unavailable kv
    ac_lines_val // electrical grid class ac lines
  ];

  /** @description An object of layers mapped to canvas nodes. Used to dynamically generate map layer divs and attach their canvases. */
  let canvases = {};
  /** @description An object of canvas drawing contexts for each map layer's canvas element. */
  let contexts = {};
  let checkboxes = {};

  let lay = layers.length;
  for (let i = 0; i < lay; i++) {
    canvases[layers[i]] = d3
      .select(".map.wrapper")
      // .select(".main.map.builder")
      .append("div")
      .attr("class", `map layer ${layers[i]}`)
      .append("canvas")
      .attr("class", `map layer canvas ${layers[i]}`)
      .attr("width", width + SCALE * 400)
      .attr("height", height);
    console.log(`<div map layer ${layers[i]}> created!`);

    contexts[layers[i]] = canvases[layers[i]].node().getContext("2d");
    console.log(contexts[i]); // currently displaying 'undefined'

    let label_format = layers[i];
    if (label_format.substring(label_format.length - 4) == 'well') {
      label_format = `${label_format.replace(/-/g, ' ')}s`;
    }
    else if (label_format.substring(label_format.length - 8) == 'pipeline') {
      label_format = `${label_format.replace(/-/g, ' ')}s`
    }
    else if (label_format.substring(label_format.length - 5) == 'plant') {
      label_format = `${label_format.replace(/-/g, ' ')}s`
      if (label_format.substring(0,3) == 'non') {
        label_format = `${label_format.replace(/non /, 'non-')}`
      }
    }
    else if (label_format.substring(label_format.length - 4) == 'mine') {
      label_format = `${label_format.replace(/-/g, ' ')}s`
    }
    else if (label_format.substring(label_format.length - 4) == 'road') {
      label_format = `${label_format.replace(/-/g, ' ')}s`
    }
    else if (label_format.substring(label_format.length -1) == 'y') {
      label_format = `${label_format.replace(/-/g, ' ')}`;
      label_format = `${label_format.replace(/y/, 'ies')}`;
    }
    else if (label_format.substring(label_format.length - 10) == 'processing') {
      label_format = `${label_format.replace(/-/g, ' ')} plants`;
    }
    else {
      label_format = `${label_format.replace(/-/g, ' ')}`
    }

    checkboxes[layers[i]] = d3
      .select(".options")
      .insert("span")
      .append("label")
      .text(`${label_format.replace(/ /g, '\u00A0').replace(/-/g, '\u2011')}\u00A0`)
      .append("input")
      .attr("type", "checkbox")
      .attr("class", `checkbox ${layers[i]}`)
      .attr("data-assetvalue", asset_values[i]);
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
   * Draw the base map.
   */
  function draw_base_map() {
    Promise.all([d3.json(fmap), d3.json(fmapfill)]).then(function(files) {
      draw_land(ctx, files);
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

  // Held in case we separate the oil pipelines and oil product pipelines again.
  /** @description A canvas element for the oil product pipelines, attached to div "map layer canvas oil-pipeline" */
  // let oil_prod_pipeline = d3.select(".map.layer.canvas.oil-product-pipeline");
  // let ctx_oil_prod_pipeline = oil_prod_pipeline.node().getContext("2d");
  // ctx_oil_prod_pipeline.LineCap = "round";

  /** @description A canvas element for the gas processing, attached to div "map layer canvas gas-processing" */
  let gas_processing = d3.select(".map.layer.canvas.gas-processing");
  let ctx_gas_processing = gas_processing.node().getContext("2d");
  ctx_gas_processing.LineCap = "round";

  /** @description A canvas element for the gas storage, attached to div "map layer canvas gas-storage" */
  // let gas_storage = d3.select(".map.layer.canvas.gas-storage");
  // let ctx_gas_storage = gas_storage.node().getContext("2d");
  // ctx_gas_storage.LineCap = "round";

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

  /** @description A canvas element for the electrical grid, attached to div "map layer canvas complete-electrical-grid" */
  let grid = d3.select(".map.layer.canvas.complete-electrical-grid");
  let ctx_grid = grid.node().getContext("2d");
  ctx_grid.LineCap = "round";

  /** @description A canvas element for the unavailable kv layer of the electrical grid, attached to div "map layer canvas unavailable-kv" */
  let unavailable_kv = d3.select(".map.layer.canvas.unavailable-kv");
  let ctx_unavailable_kv = unavailable_kv.node().getContext("2d");
  ctx_unavailable_kv.LineCap = "round";

  /** @description A canvas element for the ac lines layer of the electrical grid, attached to div "map layer canvas ac-lines" */
  let ac_lines = d3.select(".map.layer.canvas.ac-lines");
  let ctx_ac_lines = ac_lines.node().getContext("2d");
  ctx_ac_lines.LineCap = "round";

  /**
   * Create the gas well layer.
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
      decrement_asset_total(gas_well_val);
    } else {
      if (gas_well_counter > 1) {
        gas_well = d3.select(".map.layer.canvas.gas-well");
        ctx_gas_well = gas_well.node().getContext("2d");
        ctx_gas_well.LineCap = "round";
      }
      console.log(`gas well counter is odd, value of ${gas_well_counter}`);
      layer_gas_well();
      load(2000);
      console.log(gas_well_val);
      increment_asset_total(gas_well_val);
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
      decrement_asset_total(oil_well_val);
    } else {
      if (oil_well_counter > 1) {
        oil_well = d3.select(".map.layer.canvas.oil-well");
        ctx_oil_well = oil_well.node().getContext("2d");
        ctx_oil_well.LineCap = "round";
      }
      console.log(`oil well counter is odd, value of ${oil_well_counter}`);
      layer_oil_well();
      load(2000);
      console.log(oil_well_val);
      increment_asset_total(oil_well_val);
    }
  });

  /**
   * Create the gas pipeline layer.
   */
  const gas_pipeline_check = d3.select(".checkbox.gas-pipeline");
  let gas_pipeline_counter = 0;
  gas_pipeline_check.on("change", function() {
    gas_pipeline_counter++;
    if (gas_pipeline_counter % 2 == 0) {
      gas_pipeline.remove();
      console.log(
        `gas-pipeline counter is even, value of ${gas_pipeline_counter}`
      );
      d3.select(".map.layer.gas-pipeline")
        .append("canvas")
        .attr("class", "map layer canvas gas-pipeline")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(gas_pipeline_val);
    } else {
      if (gas_pipeline_counter > 1) {
        gas_pipeline = d3.select(".map.layer.canvas.gas-pipeline");
        ctx_gas_pipeline = gas_pipeline.node().getContext("2d");
        ctx_gas_pipeline.LineCap = "round";
      }
      console.log(
        `gas pipeline counter is odd, value of ${gas_pipeline_counter}`
      );
      draw_json_layer(natural_gas_pipelines, draw_gas_pipes, ctx_gas_pipeline)
      // why no params for draw pipes method?
      load(1000);
      console.log(gas_pipeline_val);
      increment_asset_total(gas_pipeline_val);
    }
  });

  /** Create the oil pipeline and oil product pipeline layers
   * TODO: Consolidate with product pipeline
   */
  const oil_pipeline_check = d3.select(".checkbox.oil-pipeline");
  let oil_pipeline_counter = 0;
  oil_pipeline_check.on("change", function() {
    oil_pipeline_counter++;
    if (oil_pipeline_counter % 2 == 0) {
      oil_pipeline.remove();
      console.log(
        `oil-pipeline counter is even, value of ${oil_pipeline_counter}`
      );
      d3.select(".map.layer.oil-pipeline")
        .append("canvas")
        .attr("class", "map layer canvas oil-pipeline")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(oil_pipeline_val)
    } else {
      if (oil_pipeline_counter > 1) {
        oil_pipeline = d3.select(".map.layer.canvas.oil-pipeline");
        ctx_oil_pipeline = oil_pipeline.node().getContext("2d");
        ctx_oil_pipeline.LineCap = "round";
      }
      console.log(
        `oil pipeline counter is odd, value of ${oil_pipeline_counter}`
      );
      draw_json_layer(crude_oil_pipelines, draw_oil_pipes, ctx_oil_pipeline);
      draw_json_layer(oil_product_pipelines, draw_oil_pipes, ctx_oil_pipeline);
      console.log(oil_pipeline_val);
      increment_asset_total(oil_pipeline_val);
    }
  });

  // Held in case we disaggregate the oil pipeline from the oil product pipeline
  /**
   * Create the oil product pipeline layer.
   */
  // const oil_prod_pipeline_check = d3.select(".checkbox.oil-product-pipeline");
  // let oil_prod_pipeline_counter = 0;
  // oil_prod_pipeline_check.on("change", function() {
  //   oil_prod_pipeline_counter++;
  //   if (oil_prod_pipeline_counter % 2 == 0) {
  //     oil_prod_pipeline.remove();
  //     console.log(
  //       `oil-prod-pipeline counter is even, value of ${oil_prod_pipeline_counter}`
  //     );
  //     d3.select(".map.layer.oil-product-pipeline")
  //       .append("canvas")
  //       .attr("class", "map layer canvas oil-prod-pipeline")
  //       .attr("width", width + SCALE * 400)
  //       .attr("height", height);
  //     decrement_asset_total(oil_prod_pipeline_val);
  //   } else {
  //     if (oil_prod_pipeline_counter > 1) {
  //       oil_prod_pipeline = d3.select(".map.layer.canvas.oil-prod-pipeline");
  //       ctx_oil_prod_pipeline = oil_prod_pipeline.node().getContext("2d");
  //       ctx_oil_prod_pipeline.LineCap = "round";
  //     }
  //     console.log(
  //       `oil product pipeline counter is odd, value of ${oil_prod_pipeline_counter}`
  //     );
  //     draw_json_layer(oil_product_pipelines, draw_pipes, ctx_oil_prod_pipeline);
  //     console.log(oil_prod_pipeline_val);
  //     increment_asset_total(oil_prod_pipeline_val);
  //   }
  // });

  /**
   * Create the gas processing layer.
   */
  const gas_processing_check = d3.select(".checkbox.gas-processing");
  let gas_processing_counter = 0;
  gas_processing_check.on("change", function() {
    gas_processing_counter++;
    if (gas_processing_counter % 2 == 0) {
      gas_processing.remove();
      console.log(
        `gas-processing counter is even, value of ${gas_processing_counter}`
      );
      d3.select(".map.layer.gas-processing")
        .append("canvas")
        .attr("class", "map layer canvas gas-processing")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(gas_processing_val);
    } else {
      if (gas_processing_counter > 1) {
        gas_processing = d3.select(".map.layer.canvas.gas-processing");
        ctx_gas_processing = gas_processing.node().getContext("2d");
        ctx_gas_processing.LineCap = "round";
      }
      console.log(
        `gas processing counter is odd, value of ${gas_processing_counter}`
      );
      draw_csv_layer(gas_processing_path, draw_processing, ctx_gas_processing);
      console.log(gas_processing_val);
      increment_asset_total(gas_processing_val);
    }
  });

  /**
   * Create the gas storage layer.
   */

  // function layer_storage() {
  //   Promise.all([
  //     d3.csv("/static/csv/nstor.csv")
  //   ]).then(function(files) {
  //     draw_gas_storage(ctx_gas_storage, files);
  //   });
  // }

  // const gas_storage_check = d3.select(".checkbox.gas-storage");
  // let gas_storage_counter = 0;
  // gas_storage_check.on("change", function() {
  //   gas_storage_counter++;
  //   if (gas_storage_counter % 2 == 0) {
  //     gas_storage.remove();
  //     console.log(`gas-storage counter is even, value of ${gas_storage_counter}`);
  //     d3.select(".map.layer.gas-storage")
  //       .append("canvas")
  //       .attr("class", "map layer canvas gas-storage")
  //       .attr("width", width + SCALE * 400)
  //       .attr("height", height);
  //   } else {
  //       if (gas_storage_counter > 1) {
  //         gas_storage = d3.select(".map.layer.canvas.gas-storage");
  //         ctx_gas_storage = gas_storage.node().getContext("2d");
  //         ctx_gas_storage.LineCap = "round";
  //       }
  //       console.log(`gas storage counter is odd, value of ${gas_storage_counter}`);
  //       layer_storage();
  //   }
  // });

  /**
   * Create the oil refinery layer.
   */
  const oil_refinery_check = d3.select(".checkbox.oil-refinery");
  let oil_refinery_counter = 0;
  oil_refinery_check.on("change", function() {
    oil_refinery_counter++;
    if (oil_refinery_counter % 2 == 0) {
      oil_refinery.remove();
      console.log(
        `oil-refinery counter is even, value of ${oil_refinery_counter}`
      );
      d3.select(".map.layer.oil-refinery")
        .append("canvas")
        .attr("class", "map layer canvas oil-refinery")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(oil_refinery_val)
    } else {
      if (oil_refinery_counter > 1) {
        oil_refinery = d3.select(".map.layer.canvas.oil-refinery");
        ctx_oil_refinery = oil_refinery.node().getContext("2d");
        ctx_oil_refinery.LineCap = "round";
      }
      console.log(
        `oil refinery counter is odd, value of ${oil_refinery_counter}`
      );
      draw_json_layer(petroleum_refineries, draw_refining, ctx_oil_refinery);
      console.log(oil_refinery_val);
      increment_asset_total(oil_refinery_val);
    }
  });

  /**
   * Create the coal mine layer.
   */
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
      decrement_asset_total(coalmine_val);
    } else {
      if (coal_counter > 1) {
        coalmines = d3.select(".map.layer.canvas.coal-mine");
        ctx_coalmines = coalmines.node().getContext("2d");
        ctx_coalmines.LineCap = "round";
      }
      console.log(`coal counter is odd, value of ${coal_counter}`);
      draw_csv_layer(mines, draw_coal_mines, ctx_coalmines);
      console.log(coalmine_val);
      increment_asset_total(coalmine_val);
    }
  });

  /**
   * Create the railroad map layer.
   */
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
      decrement_asset_total(railroad_val);
    } else {
      if (rrmap_counter > 1) {
        railroad = d3.select(".map.layer.canvas.railroad");
        ctx_railroad = railroad.node().getContext("2d");
        ctx_railroad.LineCap = "round";
      }
      console.log(`railroad counter is odd, value of ${rrmap_counter}`);
      draw_json_layer(rrmap, draw_railroads, ctx_railroad);
      load(2000);
      console.log(railroad_val);
      increment_asset_total(railroad_val);
    }
  });

  /**
   * Create the non-fossil-fuel plant layer.
   */
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
        decrement_asset_total(nff_val)
    } else {
      if (nff_counter > 1) {
        nffplant = d3.select(".map.layer.canvas.non-fossil-fuel-plant");
        ctx_nffplant = nffplant.node().getContext("2d");
        ctx_nffplant.LineCap = "round";
      }
      console.log(`nff counter is odd, value of ${nff_counter}`);
      draw_json_layer(power_plants, draw_nff_plants, ctx_nffplant);
      load(300);
      console.log(nff_val);
      increment_asset_total(nff_val);
    }
  });

  /**
   * Create the fossil-fuel plant layer.
   */
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
        decrement_asset_total(ff_val);
    } else {
      if (ff_counter > 1) {
        ffplant = d3.select(".map.layer.canvas.fossil-fuel-plant");
        ctx_ffplant = ffplant.node().getContext("2d");
        ctx_ffplant.LineCap = "round";
      }
      console.log(`ff counter is odd, value of ${ff_counter}`);
      draw_json_layer(power_plants, draw_ff_plants, ctx_ffplant);
      load(300);
      console.log(ff_val);
      increment_asset_total(ff_val);
    }
  });

  /**
   * Create the electrical grid layer.
   */
  const grid_check = d3.select(".checkbox.complete-electrical-grid");
  let grid_counter = 0;
  grid_check.on("change", function() {
    grid_counter++;
    if (grid_counter % 2 == 0) {
      console.log(`grid counter is even, value of ${grid_counter}`);
      grid.remove();
      d3.select(".map.layer.complete-electrical-grid")
        .append("canvas")
        .attr("class", "map layer canvas complete-electrical-grid")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(electrical_grid_val)
    } else {
      if (grid_counter > 1) {
        grid = d3.select(".map.layer.canvas.complete-electrical-grid");
        ctx_grid = grid.node().getContext("2d");
        ctx_grid.LineCap = "round";
      }
      console.log(`grid counter is odd, value of ${grid_counter}`);
      draw_json_layer(gridmap, draw_grid, ctx_grid);
      // draw_json_layer(gridmap, draw_grid_class_unavailable, ctx_grid);
      load(5000);
      console.log(electrical_grid_val);
      increment_asset_total(electrical_grid_val);
    }
  });

  /**
   * Create the electrical grid class unavailable kv layer.
   */
  const unavailable_kv_label = "unavailable-kv";
  // const draw_json_unavailable_kv = draw_json_layer(gridmap, draw_grid_class_unavailable, ctx_unavailable_kv);
  let unavailable_kv_arg_obj = {
    path: gridmap,
    f: draw_grid_class_unavailable,
    ctx: ctx_unavailable_kv
  }
  
  const unavailable_kv_load_time = 2000;

  create_layer(unavailable_kv_label, unavailable_kv, unavailable_kv_val, ctx_unavailable_kv, draw_json_layer, unavailable_kv_arg_obj);
  // const unavailable_kv_check = d3.select(".checkbox.unavailable-kv");
  // let unavailable_kv_counter = 0;
  // unavailable_kv_check.on("change", function() {
  //   unavailable_kv_counter++;
  //   if (unavailable_kv_counter % 2 == 0) {
  //     console.log(`unavailable kv counter is even, value of ${unavailable_kv_counter}`);
  //     unavailable_kv.remove();
  //     d3.select(".map.layer.unavailable-kv")
  //       .append("canvas")
  //       .attr("class", "map layer canvas unavailable-kv")
  //       .attr("width", width + SCALE * 400)
  //       .attr("height", height);
  //     decrement_asset_total(unavailable_kv_val)
  //   } else {
  //     if (unavailable_kv_counter > 1) {
  //       unavailable_kv = d3.select(".map.layer.canvas.unavailable-kv");
  //       ctx_unavailable_kv = unavailable_kv.node().getContext("2d");
  //       ctx_unavailable_kv.LineCap = "round";
  //     }
  //     console.log(`unavailable kv counter is odd, value of ${unavailable_kv_counter}`);
  //     draw_json_layer(gridmap, draw_grid_class_unavailable, ctx_unavailable_kv);
  //     load(2000);
  //     console.log(unavailable_kv_val);
  //     increment_asset_total(unavailable_kv_val);
  //   }
  // });

  /**
   * Create the electrical grid class ac lines layer.
   */
  const ac_lines_check = d3.select(".checkbox.ac-lines");
  let ac_lines_counter = 0;
  ac_lines_check.on("change", function() {
    ac_lines_counter++;
    if (ac_lines_counter % 2 == 0) {
      console.log(`ac lines counter is even, value of ${ac_lines_counter}`);
      ac_lines.remove();
      d3.select(".map.layer.ac-lines")
        .append("canvas")
        .attr("class", "map layer canvas ac-lines")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_val)
    } else {
      if (ac_lines_counter > 1) {
        ac_lines = d3.select(".map.layer.canvas.ac-lines");
        ctx_ac_lines = ac_lines.node().getContext("2d");
        ctx_ac_lines.LineCap = "round";
      }
      console.log(`ac lines counter is odd, value of ${ac_lines_counter}`);
      draw_json_layer(gridmap, draw_grid_class_ac, ctx_ac_lines);
      load(2000);
      console.log(ac_lines_val);
      increment_asset_total(ac_lines_val);
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
