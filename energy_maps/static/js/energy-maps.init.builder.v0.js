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
    // "non-fossil-fuel-plant",
    // "fossil-fuel-plant",
    "coal-plant",
    "geothermal-plant",
    "hydro-plant",
    "natural-gas-plant",
    "nuclear-plant",
    "petroleum-plant",
    "solar-plant",
    "wind-farms",
    // "complete-electrical-grid",
    // "electrical-grid-unavailable-kv",
    "electrical-grid-ac-lines-under-100-kv",
    "electrical-grid-ac-lines-100-to-300-kV",
    // "electrical-grid-ac-lines-100-to-200-kV",
    // "electrical-grid-ac-lines-200-to-300-kV",
    "electrical-grid-ac-lines-345-to-735-kV",
    // "electrical-grid-ac-lines-345-kV",
    // "electrical-grid-ac-lines-500-kV",
    // "electrical-grid-ac-lines-735-kV",
    "electrical-grid-dc-lines"
  ];

  let unimplemented_layers = [
    "gas-storage",
    "oil-product-pipeline", // Don't add until we have sufficient financial data
    "off-shore-well" // Must determine which dataset contains offshore wells
  ];

  let gas_well_val = 1_059_000_000_000; // 1.06B || 1,059 B -- US only
  let oil_well_val = 654_000_000_000; // 654 B
  let gas_pipeline_val = 940_000_000_000; // 940 B
  let oil_pipeline_val = 170_000_000_000; // 170 B
  let oil_prod_pipeline_val = 0; // -- not specified separately - this is part of oil pipeline
  let gas_processing_val = 45_000_000_000; // 45 B
  let gas_storage_val = 0; // TBA
  let oil_refinery_val = 373_000_000_000; // 373 B
  let railroad_val = 137_000_000_000; // `137 B *` Needs an asterisk because this is 1/3 of the value of the freight railway shown
  let coalmine_val = 57_000_000_000; // 57 B
  let nff_val = 1_156_000_000_000; // 1.16T || 1,156 B -- (Break this into nuclear, hydro, wind, solar , etc. when we have layers separate)
  let ff_val = 1_645_000_000_000; // 1.65T || 1,645B (Break this into coal, oil, and gas when we have layers separate)
  let coal_plant_val = 1_092_000_000_000; // $1092 B ($1100 B) -- currently displays as 1T, and only updates if something increases it by over 1B
  let geo_plant_val = 22_000_000_000; // $22 B
  let hydro_plant_val = 597_000_000_000; // 597 B
  let ng_plant_val = 488_000_000_000 // $488 B ($490 B);
  let nuclear_plant_val = 597_000_000_000 // $597 B ($600 B);
  let pet_plant_val = 64_000_000_000// $64 B;
  let solar_plant_val = 14_000_000_000; // $14 B
  let wind_farm_val = 132_000_000_000; // $132 B ($130 B);
  let electrical_grid_val = 2_946_000_000_000; // 2.95T || 2,946 B
  // let unavailable_kv_val = 0; // TBD
  let ac_lines_val = 2_238_000_000_000; // $2238 B ($2240 B); also includes substations
  let ac_lines_under_100_val = 102_000_000_000; // $102 B
  let ac_lines_100_300_val = 167_000_000_000; // $167 B
  // let ac_lines_100_200_val = 0; // TBA
  // let ac_lines_200_300_val = 0; // TBA
  let ac_lines_345_735_val = 137_000_000_000; // $137 B
  // let ac_lines_345_val = 0; // TBA
  // let ac_lines_500_val = 0; // TBA
  // let ac_lines_735_val = 0; // TBA
  let dc_lines_val = 4_000_000_000; // $3.9 B ($4 B);

  let asset_values = [
    gas_well_val,
    oil_well_val,
    gas_pipeline_val,
    oil_pipeline_val,
    oil_prod_pipeline_val,
    gas_processing_val,
    gas_storage_val,
    oil_refinery_val,
    railroad_val,
    coalmine_val,
    nff_val,
    ff_val,
    coal_plant_val,
    geo_plant_val,
    hydro_plant_val,
    ng_plant_val,
    pet_plant_val, 
    nuclear_plant_val,
    solar_plant_val,
    wind_farm_val,
    electrical_grid_val, 
    // unavailable_kv_val,
    ac_lines_val,
    ac_lines_under_100_val,
    ac_lines_100_300_val,
    // ac_lines_100_200_val,
    // ac_lines_200_300_val,
    ac_lines_345_735_val,
    // ac_lines_345_val,
    // ac_lines_500_val,
    // ac_lines_735_val,
    dc_lines_val
  ];

  /** @description An object of layers mapped to canvas nodes. Used to dynamically generate map layer divs and attach their canvases. */
  let canvases = {};
  /** @description An object of canvas drawing contexts for each map layer's canvas element. */
  let contexts = {};
  let checkboxes = {};

  // Array for storing active layers
  let active_layers = [];

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

    active_layers.push([layers[i], false]);
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

  // Set legend canvas
  let legend_canvas = d3
    .select(".map.legend")
    .append("canvas")
    .attr("id", "legendcanvas")
    .attr("width", width + SCALE * 400)
    .attr("height", height);
  let legend_ctx = legend_canvas.node().getContext("2d");
  ctx.LineCap = "round";

  const update_active_layers = function update_active_layers(layer, add) {
    legend_ctx.clearRect(0, 0, width, height);
    if (add) {
      active_layers.filter(function(d) {
        return d[0] === layer;
      })[0][1] = true;
    } else {
      active_layers.filter(function(d) {
        return d[0] === layer;
      })[0][1] = false;
    }
  };

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

  // /** @description A canvas element for the non-fossil-fuel plants, attached to div "map layer canvas non-fossil-fuel-plant" */
  // let nffplant = d3.select(".map.layer.canvas.non-fossil-fuel-plant");
  // /** @description A drawing context for the non-fossil-fuel plants, attached to canvas "map layer non-fossil-fuel-plant" */
  // let ctx_nffplant = nffplant.node().getContext("2d");
  // ctx_nffplant.LineCap = "round";

  // /** @description A canvas element for the fossil-fuel plants, attached to div "map layer canvas fossil-fuel-plant" */
  // let ffplant = d3.select(".map.layer.canvas.fossil-fuel-plant");
  // let ctx_ffplant = ffplant.node().getContext("2d");
  // ctx_ffplant.LineCap = "round";

  /** @description A canvas element for the coal plants, attached to div "map layer canvas coal-plant" */
  let coalplant = d3.select(".map.layer.canvas.coal-plant");
  let ctx_coal_plant = coalplant.node().getContext("2d");
  ctx_coal_plant.LineCap = "round";

  /** @description A canvas element for the geothermal plants, attached to div "map layer canvas geothermal-plant" */
  let geoplant = d3.select(".map.layer.canvas.geothermal-plant");
  let ctx_geo_plant = geoplant.node().getContext("2d");
  ctx_geo_plant.LineCap = "round";

  /** @description A canvas element for the hydro plants, attached to div "map layer canvas hydro-plant" */
  let hydroplant = d3.select(".map.layer.canvas.hydro-plant");
  let ctx_hydro_plant = hydroplant.node().getContext("2d");
  ctx_hydro_plant.LineCap = "round";

  /** @description A canvas element for the natural gas plants, attached to div "map layer canvas natural-gas-plant" */
  let ngplant = d3.select(".map.layer.canvas.natural-gas-plant");
  let ctx_ng_plant = ngplant.node().getContext("2d");
  ctx_ng_plant.LineCap = "round";

  /** @description A canvas element for the nuclear plants, attached to div "map layer canvas nuclear-plant" */
  let nuclearplant = d3.select(".map.layer.canvas.nuclear-plant");
  let ctx_nuclear_plant = nuclearplant.node().getContext("2d");
  ctx_nuclear_plant.LineCap = "round";
  
  /** @description A canvas element for the petroluem plants, attached to div "map layer canvas petroleum-plant" */
  let petplant = d3.select(".map.layer.canvas.petroleum-plant");
  let ctx_pet_plant = petplant.node().getContext("2d");
  ctx_pet_plant.LineCap = "round";

  /** @description A canvas element for the solar plants, attached to div "map layer canvas solar-plant" */
  let solarplant = d3.select(".map.layer.canvas.solar-plant");
  let ctx_solar_plant = solarplant.node().getContext("2d");
  ctx_solar_plant.LineCap = "round";

  /** @description A canvas element for the wind farms, attached to div "map layer canvas wind-farms" */
  let windfarms = d3.select(".map.layer.canvas.wind-farms");
  let ctx_wind_farms = windfarms.node().getContext("2d");
  ctx_wind_farms.LineCap = "round";

  /** @description A canvas element for the electrical grid, attached to div "map layer canvas complete-electrical-grid" */
  // let grid = d3.select(".map.layer.canvas.complete-electrical-grid");
  // let ctx_grid = grid.node().getContext("2d");
  // ctx_grid.LineCap = "round";

  /** @description A canvas element for the unavailable kv layer of the electrical grid, attached to div "map layer canvas electrical-grid-unavailable-kv" */
  // let unavailable_kv = d3.select(".map.layer.canvas.electrical-grid-unavailable-kv");
  // let ctx_unavailable_kv = unavailable_kv.node().getContext("2d");
  // ctx_unavailable_kv.LineCap = "round";

  /** @description A canvas element for the ac lines under 100 kv layer of the electrical grid, attached to div "map layer canvas
  electrical-grid-ac-lines-under-100-kv" */
  let ac_lines_under_100 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-under-100-kv");
  let ctx_ac_lines_under_100 = ac_lines_under_100.node().getContext("2d");
  ctx_ac_lines_under_100.LineCap = "round";

  /** @description A canvas element for the ac lines 100-300 kv layer of the electrical grid, attached to div "map layer canvas
  electrical-grid-ac-lines-100-to-300-kv" */
  let ac_lines_100_300 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-100-to-300-kV");
  let ctx_ac_lines_100_300 = ac_lines_100_300.node().getContext("2d");
  ctx_ac_lines_100_300.LineCap = "round";

  // /** @description A canvas element for the ac lines 100-200 kv layer of the electrical grid, attached to div "map layer canvas
  // electrical-grid-ac-lines-100-to-200-kv" */
  // let ac_lines_100_200 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-100-to-200-kV");
  // let ctx_ac_lines_100_200 = ac_lines_100_200.node().getContext("2d");
  // ctx_ac_lines_100_200.LineCap = "round";

  // /** @description A canvas element for the ac lines 200-300 kv layer of the electrical grid, attached to div "map layer canvas
  // electrical-grid-ac-lines-200-to-300-kv" */
  // let ac_lines_200_300 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-200-to-300-kV");
  // let ctx_ac_lines_200_300 = ac_lines_200_300.node().getContext("2d");
  // ctx_ac_lines_200_300.LineCap = "round";

  /** @description A canvas element for the ac lines 345-to-735 kv layer of the electrical grid, attached to div "map layer canvas
  electrical-grid-ac-lines-345-to-735-kv" */
  let ac_lines_345_735 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-345-to-735-kV");
  let ctx_ac_lines_345_735 = ac_lines_345_735.node().getContext("2d");
  ctx_ac_lines_345_735.LineCap = "round";

  // /** @description A canvas element for the ac lines 345 kv layer of the electrical grid, attached to div "map layer canvas
  // electrical-grid-ac-lines-345-kv" */
  // let ac_lines_345 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-345-kV");
  // let ctx_ac_lines_345 = ac_lines_345.node().getContext("2d");
  // ctx_ac_lines_345.LineCap = "round";

  // /** @description A canvas element for the ac lines 500 kv layer of the electrical grid, attached to div "map layer canvas
  // electrical-grid-ac-lines-500-kv" */
  // let ac_lines_500 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-500-kV");
  // let ctx_ac_lines_500 = ac_lines_500.node().getContext("2d");
  // ctx_ac_lines_500.LineCap = "round";

  // /** @description A canvas element for the ac lines 735 kv layer of the electrical grid, attached to div "map layer canvas
  // electrical-grid-ac-lines-735-kv" */
  // let ac_lines_735 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-735-kV");
  // let ctx_ac_lines_735 = ac_lines_735.node().getContext("2d");
  // ctx_ac_lines_735.LineCap = "round";

  /** @description A canvas element for the dc lines layer of the electrical grid, attached to div "map layer canvas electrical-grid-dc-lines" */
  let dc_lines = d3.select(".map.layer.canvas.electrical-grid-dc-lines");
  let ctx_dc_lines = dc_lines.node().getContext("2d");
  ctx_dc_lines.LineCap = "round";

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
      update_active_layers('gas-well', false);
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
      update_active_layers('gas-well', true);
      console.log(gas_well_val);
      increment_asset_total(gas_well_val);
    }
    update_legend(legend_ctx, active_layers);
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
      update_active_layers('oil-well', false);
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
      update_active_layers('oil-well', true);
      console.log(oil_well_val);
      increment_asset_total(oil_well_val);
    }
    update_legend(legend_ctx, active_layers);
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
      update_active_layers('gas-pipeline', false);
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
      update_active_layers('gas-pipeline', true);
      console.log(gas_pipeline_val);
      increment_asset_total(gas_pipeline_val);
    }
    update_legend(legend_ctx, active_layers);
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
      update_active_layers('oil-pipeline', false);
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
      update_active_layers('oil-pipeline', true);
      console.log(oil_pipeline_val);
      increment_asset_total(oil_pipeline_val);
    }
    update_legend(legend_ctx, active_layers);
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
      update_active_layers('gas-processing', false);
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
      update_active_layers('gas-processing', true);
      console.log(gas_processing_val);
      increment_asset_total(gas_processing_val);
    }
    update_legend(legend_ctx, active_layers);
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
  //       decrement_asset_total(gas_storage_val);
  //   } else {
  //       if (gas_storage_counter > 1) {
  //         gas_storage = d3.select(".map.layer.canvas.gas-storage");
  //         ctx_gas_storage = gas_storage.node().getContext("2d");
  //         ctx_gas_storage.LineCap = "round";
  //       }
  //       console.log(`gas storage counter is odd, value of ${gas_storage_counter}`);
  //       draw_csv_layer(gas_storage, draw_gas_storage, ctx_gas_storage);
  //       console.log(gas_storage_val);
  //       increment_asset_total(gas_storage_val);
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
      update_active_layers('oil-refinery', false);
      console.log(
        `oil-refinery counter is even, value of ${oil_refinery_counter}`
      );
      d3.select(".map.layer.oil-refinery")
        .append("canvas")
        .attr("class", "map layer canvas oil-refinery")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(oil_refinery_val);
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
      update_active_layers('oil-refinery', true);
      console.log(oil_refinery_val);
      increment_asset_total(oil_refinery_val);
    }
    update_legend(legend_ctx, active_layers);
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
      update_active_layers('coal-mine', false);
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
      update_active_layers('coal-mine', true);
      console.log(coalmine_val);
      increment_asset_total(coalmine_val);
    }
    update_legend(legend_ctx, active_layers);
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
      update_active_layers('railroad', false);
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
      update_active_layers('railroad', true);
      console.log(railroad_val);
      increment_asset_total(railroad_val);
    }
    update_legend(legend_ctx, active_layers);
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
   * Create the coal plant layer.
   */
  const coal_plant_check = d3.select(".checkbox.coal-plant");
  let coal_plant_counter = 0;
  coal_plant_check.on("change", function() {
    coal_plant_counter++;
    if (coal_plant_counter % 2 == 0) {
      console.log(`coal plant counter is even, value of ${coal_plant_counter}`);
      coalplant.remove();
      update_active_layers('coal-plant', false);
      d3.select(".map.layer.coal-plant")
        .append("canvas")
        .attr("class", "map layer canvas coal-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
        decrement_asset_total(coal_plant_val);
    } else {
      if (coal_plant_counter > 1) {
        coalplant = d3.select(".map.layer.canvas.coal-plant");
        ctx_coal_plant = coalplant.node().getContext("2d");
        ctx_coal_plant.LineCap = "round";
      }
      console.log(`coal plant counter is odd, value of ${coal_plant_counter}`);
      let fuel = 'COAL';
      draw_plant_json_layer(power_plants, draw_single_plant, fuel, ctx_coal_plant);
      load(300);
      update_active_layers('coal-plant', true);
      console.log(coal_plant_val);
      increment_asset_total(coal_plant_val);
    }
    update_legend(legend_ctx, active_layers);
  });

  /**
   * Create the geothermal plant layer.
   */
  const geo_plant_check = d3.select(".checkbox.geothermal-plant");
  let geo_plant_counter = 0;
  geo_plant_check.on("change", function() {
    geo_plant_counter++;
    if (geo_plant_counter % 2 == 0) {
      console.log(`geo plant counter is even, value of ${geo_plant_counter}`);
      geoplant.remove();
      update_active_layers('geothermal-plant', false);
      d3.select(".map.layer.geothermal-plant")
        .append("canvas")
        .attr("class", "map layer canvas geothermal-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
        decrement_asset_total(geo_plant_val);
    } else {
      if (geo_plant_counter > 1) {
        geoplant = d3.select(".map.layer.canvas.geothermal-plant");
        ctx_geo_plant = geoplant.node().getContext("2d");
        ctx_geo_plant.LineCap = "round";
      }
      console.log(`geo plant counter is odd, value of ${geo_plant_counter}`);
      let fuel = 'GEO';
      draw_plant_json_layer(power_plants, draw_single_plant, fuel, ctx_geo_plant);
      load(300);
      update_active_layers('geothermal-plant', true);
      console.log(geo_plant_val);
      increment_asset_total(geo_plant_val);
    }
    update_legend(legend_ctx, active_layers);
  });

  /**
   * Create the hydro plant layer.
   */
  const hyrdo_plant_check = d3.select(".checkbox.hydro-plant");
  let hydro_plant_counter = 0;
  hyrdo_plant_check.on("change", function() {
    hydro_plant_counter++;
    if (hydro_plant_counter % 2 == 0) {
      console.log(`hydro plant counter is even, value of ${hydro_plant_counter}`);
      hydroplant.remove();
      update_active_layers('hydro-plant', false);
      d3.select(".map.layer.hydro-plant")
        .append("canvas")
        .attr("class", "map layer canvas hydro-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
        decrement_asset_total(hydro_plant_val);
    } else {
      if (hydro_plant_counter > 1) {
        hydroplant = d3.select(".map.layer.canvas.hydro-plant");
        ctx_hydro_plant = hydroplant.node().getContext("2d");
        ctx_hydro_plant.LineCap = "round";
      }
      console.log(`hydro plant counter is odd, value of ${hydro_plant_counter}`);
      let fuel = 'HYC';
      draw_plant_json_layer(power_plants, draw_single_plant, fuel, ctx_hydro_plant);
      load(300);
      update_active_layers('hydro-plant', true);
      console.log(hydro_plant_val);
      increment_asset_total(hydro_plant_val);
    }
    update_legend(legend_ctx, active_layers);
  });

  /**
   * Create the natural gas plant layer.
   */
  const ng_plant_check = d3.select(".checkbox.natural-gas-plant");
  let ng_plant_counter = 0;
  ng_plant_check.on("change", function() {
    ng_plant_counter++;
    if (ng_plant_counter % 2 == 0) {
      console.log(`natural gas plant counter is even, value of ${ng_plant_counter}`);
      ngplant.remove();
      update_active_layers('natural-gas-plant', false);
      d3.select(".map.layer.natural-gas-plant")
        .append("canvas")
        .attr("class", "map layer canvas natural-gas-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
        decrement_asset_total(ng_plant_val);
    } else {
      if (ng_plant_counter > 1) {
        ngplant = d3.select(".map.layer.canvas.natural-gas-plant");
        ctx_ng_plant = ngplant.node().getContext("2d");
        ctx_ng_plant.LineCap = "round";
      }
      console.log(`natural gas plant counter is odd, value of ${ng_plant_counter}`);
      let fuel = 'NG';
      draw_plant_json_layer(power_plants, draw_single_plant, fuel, ctx_ng_plant);
      load(300);
      update_active_layers('natural-gas-plant', true);
      console.log(ng_plant_val);
      increment_asset_total(ng_plant_val);
    }
    update_legend(legend_ctx, active_layers);
  });

  /**
   * Create the nuclear plant layer.
   */
  const nuclear_plant_check = d3.select(".checkbox.nuclear-plant");
  let nuclear_plant_counter = 0;
  nuclear_plant_check.on("change", function() {
    nuclear_plant_counter++;
    if (nuclear_plant_counter % 2 == 0) {
      console.log(`nuclear plant counter is even, value of ${nuclear_plant_counter}`);
      nuclearplant.remove();
      update_active_layers('nuclear-plant', false);
      d3.select(".map.layer.nuclear-plant")
        .append("canvas")
        .attr("class", "map layer canvas nuclear-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
        decrement_asset_total(nuclear_plant_val);
    } else {
      if (nuclear_plant_counter > 1) {
        nuclearplant = d3.select(".map.layer.canvas.nuclear-plant");
        ctx_nuclear_plant = nuclearplant.node().getContext("2d");
        ctx_nuclear_plant.LineCap = "round";
      }
      console.log(`nuclear plant counter is odd, value of ${nuclear_plant_counter}`);
      let fuel = 'NUC';
      draw_plant_json_layer(power_plants, draw_single_plant, fuel, ctx_nuclear_plant);
      load(300);
      update_active_layers('nuclear-plant', true);
      console.log(nuclear_plant_val);
      increment_asset_total(nuclear_plant_val);
    }
    update_legend(legend_ctx, active_layers);
  });

  /**
   * Create the petroleum plant layer.
   */
  const pet_plant_check = d3.select(".checkbox.petroleum-plant");
  let pet_plant_counter = 0;
  pet_plant_check.on("change", function() {
    pet_plant_counter++;
    if (pet_plant_counter % 2 == 0) {
      console.log(`pet plant counter is even, value of ${pet_plant_counter}`);
      petplant.remove();
      update_active_layers('petroleum-plant', false);
      d3.select(".map.layer.petroleum-plant")
        .append("canvas")
        .attr("class", "map layer canvas petroleum-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
        decrement_asset_total(pet_plant_val);
    } else {
      if (pet_plant_counter > 1) {
        petplant = d3.select(".map.layer.canvas.petroleum-plant");
        ctx_pet_plant = petplant.node().getContext("2d");
        ctx_pet_plant.LineCap = "round";
      }
      console.log(`pet plant counter is odd, value of ${pet_plant_counter}`);
      // draw_json_layer(power_plants, draw_petroleum_plants, ctx_pet_plant);
      let fuel = 'PET';
      draw_plant_json_layer(power_plants, draw_single_plant, fuel, ctx_pet_plant);
      load(300);
      update_active_layers('petroleum-plant', true);
      console.log(pet_plant_val);
      increment_asset_total(pet_plant_val);
    }
    update_legend(legend_ctx, active_layers);
  });

  /**
   * Create the solar plant layer.
   */
  const solar_plant_check = d3.select(".checkbox.solar-plant");
  let solar_plant_counter = 0;
  solar_plant_check.on("change", function() {
    solar_plant_counter++;
    if (solar_plant_counter % 2 == 0) {
      console.log(`solar plant counter is even, value of ${solar_plant_counter}`);
      solarplant.remove();
      update_active_layers('solar-plant', false);
      d3.select(".map.layer.solar-plant")
        .append("canvas")
        .attr("class", "map layer canvas solar-plant")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
        decrement_asset_total(solar_plant_val);
    } else {
      if (solar_plant_counter > 1) {
        solarplant = d3.select(".map.layer.canvas.solar-plant");
        ctx_solar_plant = solarplant.node().getContext("2d");
        ctx_solar_plant.LineCap = "round";
      }
      console.log(`solar plant counter is odd, value of ${solar_plant_counter}`);
      // draw_json_layer(power_plants, draw_solar_plants, ctx_pet_plant);
      let fuel = 'SUN';
      draw_plant_json_layer(power_plants, draw_single_plant, fuel, ctx_solar_plant);
      load(300);
      update_active_layers('solar-plant', true);
      console.log(solar_plant_val);
      increment_asset_total(solar_plant_val);
    }
    update_legend(legend_ctx, active_layers);
  });

  /**
   * Create the wind farms layer.
   */
  const wind_farms_check = d3.select(".checkbox.wind-farms");
  let wind_farms_counter = 0;
  wind_farms_check.on("change", function() {
    wind_farms_counter++;
    if (wind_farms_counter % 2 == 0) {
      console.log(`wind farms counter is even, value of ${wind_farms_counter}`);
      windfarms.remove();
      update_active_layers('wind-farms', false);
      d3.select(".map.layer.wind-farms")
        .append("canvas")
        .attr("class", "map layer canvas wind-farms")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
        decrement_asset_total(wind_farm_val);
    } else {
      if (wind_farms_counter > 1) {
        windfarms = d3.select(".map.layer.canvas.wind-farms");
        ctx_wind_farms = windfarms.node().getContext("2d");
        ctx_wind_farms.LineCap = "round";
      }
      console.log(`wind farms counter is odd, value of ${wind_farms_counter}`);
      let fuel = 'WND';
      draw_plant_json_layer(power_plants, draw_single_plant, fuel, ctx_wind_farms);
      load(300);
      update_active_layers('wind-farms', true);
      console.log(wind_farm_val);
      increment_asset_total(wind_farm_val);
    }
    update_legend(legend_ctx, active_layers);
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
  // const unavailable_kv_label = "electrical-grid-unavailable-kv";
  // // const draw_json_unavailable_kv = draw_json_layer(gridmap, draw_grid_class_unavailable, ctx_unavailable_kv);
  // let unavailable_kv_arg_obj = {
  //   path: gridmap,
  //   f: draw_grid_class_unavailable,
  //   ctx: ctx_unavailable_kv
  // }
  
  // const unavailable_kv_load_time = 2000;

  // create_layer(unavailable_kv_label, unavailable_kv, unavailable_kv_val, ctx_unavailable_kv, draw_json_layer, unavailable_kv_arg_obj);
  // const unavailable_kv_check = d3.select(".checkbox.electrical-grid-unavailable-kv");
  // let unavailable_kv_counter = 0;
  // unavailable_kv_check.on("change", function() {
  //   unavailable_kv_counter++;
  //   if (unavailable_kv_counter % 2 == 0) {
  //     console.log(`unavailable kv counter is even, value of ${unavailable_kv_counter}`);
  //     unavailable_kv.remove();
  //     d3.select(".map.layer.electrical-grid-unavailable-kv")
  //       .append("canvas")
  //       .attr("class", "map layer canvas electrical-grid-unavailable-kv")
  //       .attr("width", width + SCALE * 400)
  //       .attr("height", height);
  //     decrement_asset_total(unavailable_kv_val)
  //   } else {
  //     if (unavailable_kv_counter > 1) {
  //       unavailable_kv = d3.select(".map.layer.canvas.electrical-grid-unavailable-kv");
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
   * Create the electrical grid class ac lines under 100 layer.
   */
  const ac_lines_under_100_check = d3.select(".checkbox.electrical-grid-ac-lines-under-100-kv");
  let ac_lines_under_100_counter = 0;
  ac_lines_under_100_check.on("change", function() {
    ac_lines_under_100_counter++;
    if (ac_lines_under_100_counter % 2 == 0) {
      console.log(`ac under 100 counter is even, value of ${ac_lines_under_100_counter}`);
      ac_lines_under_100.remove();
      d3.select(".map.layer.electrical-grid-ac-lines-under-100-kv")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-ac-lines-under-100-kv")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_under_100_val)
    } else {
      if (ac_lines_under_100_counter > 1) {
        ac_lines_under_100 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-under-100-kv");
        ctx_ac_lines_under_100 = ac_lines_under_100.node().getContext("2d");
        ctx_ac_lines_under_100.LineCap = "round";
      }
      console.log(`ac under 100 counter is odd, value of ${ac_lines_under_100_counter}`);
      draw_json_layer(gridmap, draw_grid_class_unavailable, ctx_ac_lines_under_100);
      draw_json_layer(gridmap, draw_grid_class_ac_under_100, ctx_ac_lines_under_100);
      load(2000);
      console.log(ac_lines_under_100_val);
      increment_asset_total(ac_lines_under_100_val);
    }
  });

  /**
   * Create the electrical grid class ac lines 100 to 300 layer.
   */
  const ac_lines_100_300_check = d3.select(".checkbox.electrical-grid-ac-lines-100-to-300-kV");
  let ac_lines_100_300_counter = 0;
  ac_lines_100_300_check.on("change", function() {
    ac_lines_100_300_counter++;
    if (ac_lines_100_300_counter % 2 == 0) {
      console.log(`ac 100-300 counter is even, value of ${ac_lines_100_300_counter}`);
      ac_lines_100_300.remove();
      d3.select(".map.layer.electrical-grid-ac-lines-100-to-300-kV")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-ac-lines-100-to-300-kV")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_100_300_val)
    } else {
      if (ac_lines_100_300_counter > 1) {
        ac_lines_100_300 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-100-to-300-kV");
        ctx_ac_lines_100_300 = ac_lines_100_300.node().getContext("2d");
        ctx_ac_lines_100_300.LineCap = "round";
      }
      console.log(`ac 100-300 counter is odd, value of ${ac_lines_100_300_counter}`);
      draw_json_layer(gridmap, draw_grid_class_ac_100_200, ctx_ac_lines_100_300);
      draw_json_layer(gridmap, draw_grid_class_ac_200_300, ctx_ac_lines_100_300);
      load(2000);
      console.log(ac_lines_100_300_val);
      increment_asset_total(ac_lines_100_300_val);
    }
  });

  /**
   * Create the electrical grid class ac lines 100 to 200 layer.
   */
  const ac_lines_100_200_check = d3.select(".checkbox.electrical-grid-ac-lines-100-to-200-kV");
  let ac_lines_100_200_counter = 0;
  ac_lines_100_200_check.on("change", function() {
    ac_lines_100_200_counter++;
    if (ac_lines_100_200_counter % 2 == 0) {
      console.log(`ac 100-200 counter is even, value of ${ac_lines_100_200_counter}`);
      ac_lines_100_200.remove();
      update_active_layers('electrical-grid-ac-lines-100-to-200-kV', false);
      d3.select(".map.layer.electrical-grid-ac-lines-100-to-200-kV")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-ac-lines-100-to-200-kV")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_100_200_val)
    } else {
      if (ac_lines_100_200_counter > 1) {
        ac_lines_100_200 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-100-to-200-kV");
        ctx_ac_lines_100_200 = ac_lines_100_200.node().getContext("2d");
        ctx_ac_lines_100_200.LineCap = "round";
      }
      console.log(`ac 100-200 counter is odd, value of ${ac_lines_100_200_counter}`);
      draw_json_layer(gridmap, draw_grid_class_ac_100_200, ctx_ac_lines_100_200);
      draw_json_layer(gridmap, draw_grid_class_ac_200_300, ctx_ac_lines_200_300);
      load(2000);
      update_active_layers('electrical-grid-ac-lines-100-to-200-kV', true);
      console.log(ac_lines_100_200_val);
      increment_asset_total(ac_lines_100_200_val);
    }
    update_legend(legend_ctx, active_layers);
  });

  /**
   * Create the electrical grid class ac lines 200-300 layer.
   */
  const ac_lines_200_300_check = d3.select(".checkbox.electrical-grid-ac-lines-200-to-300-kV");
  let ac_lines_200_300_counter = 0;
  ac_lines_200_300_check.on("change", function() {
    ac_lines_200_300_counter++;
    if (ac_lines_200_300_counter % 2 == 0) {
      console.log(`ac 200-300 counter is even, value of ${ac_lines_200_300_counter}`);
      ac_lines_200_300.remove();
      d3.select(".map.layer.electrical-grid-ac-lines-200-to-300-kV")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-ac-lines-200-to-300-kV")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_200_300_val)
    } else {
      if (ac_lines_200_300_counter > 1) {
        ac_lines_200_300 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-200-to-300-kV");
        ctx_ac_lines_200_300 = ac_lines_200_300.node().getContext("2d");
        ctx_ac_lines_200_300.LineCap = "round";
      }
      console.log(`ac 200-300 counter is odd, value of ${ac_lines_200_300_counter}`);
      draw_json_layer(gridmap, draw_grid_class_ac_200_300, ctx_ac_lines_200_300);
      load(2000);
      console.log(ac_lines_200_300_val);
      increment_asset_total(ac_lines_200_300_val);
    }
  });

  /**
   * Create the electrical grid class ac lines 345-735 layer.
   */

  const ac_lines_345_735_check = d3.select(".checkbox.electrical-grid-ac-lines-345-to-735-kV");
  let ac_lines_345_735_counter = 0;
  ac_lines_345_735_check.on("change", function() {
    ac_lines_345_735_counter++;
    if (ac_lines_345_735_counter % 2 == 0) {
      console.log(`ac 345 to 735 counter is even, value of ${ac_lines_345_735_counter}`);
      ac_lines_345_735.remove();
      d3.select(".map.layer.electrical-grid-ac-lines-345-to-735-kV")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-ac-lines-345-to-735-kV")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_345_735_val)
    } else {
      if (ac_lines_345_735_counter > 1) {
        ac_lines_345_735 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-345-to-735-kV");
        ctx_ac_lines_345_735 = ac_lines_345_735.node().getContext("2d");
        ctx_ac_lines_345_735.LineCap = "round";
      }
      console.log(`ac 345 to 735 counter is odd, value of ${ac_lines_345_735_counter}`);
      draw_json_layer(gridmap, draw_grid_class_ac_345, ctx_ac_lines_345_735);
      draw_json_layer(gridmap, draw_grid_class_ac_500, ctx_ac_lines_345_735);
      draw_json_layer(gridmap, draw_grid_class_ac_735, ctx_ac_lines_345_735);
      load(2000);
      console.log(ac_lines_345_735_val);
      increment_asset_total(ac_lines_345_735_val);
    }
  });

  /**
   * Create the electrical grid class ac lines 345 layer.
   */

  const ac_lines_345_check = d3.select(".checkbox.electrical-grid-ac-lines-345-kV");
  let ac_lines_345_counter = 0;
  ac_lines_345_check.on("change", function() {
    ac_lines_345_counter++;
    if (ac_lines_345_counter % 2 == 0) {
      console.log(`ac 345 counter is even, value of ${ac_lines_345_counter}`);
      ac_lines_345.remove();
      d3.select(".map.layer.electrical-grid-ac-lines-345-kV")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-ac-lines-345-kV")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_345_val)
    } else {
      if (ac_lines_345_counter > 1) {
        ac_lines_345 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-345-kV");
        ctx_ac_lines_345 = ac_lines_345.node().getContext("2d");
        ctx_ac_lines_345.LineCap = "round";
      }
      console.log(`ac 345 counter is odd, value of ${ac_lines_345_counter}`);
      draw_json_layer(gridmap, draw_grid_class_ac_345, ctx_ac_lines_345);
      load(2000);
      console.log(ac_lines_345_val);
      increment_asset_total(ac_lines_345_val);
    }
  });

  /**
   * Create the electrical grid class ac lines 500 layer.
   */

  const ac_lines_500_check = d3.select(".checkbox.electrical-grid-ac-lines-500-kV");
  let ac_lines_500_counter = 0;
  ac_lines_500_check.on("change", function() {
    ac_lines_500_counter++;
    if (ac_lines_500_counter % 2 == 0) {
      console.log(`ac 500 counter is even, value of ${ac_lines_500_counter}`);
      ac_lines_500.remove();
      d3.select(".map.layer.electrical-grid-ac-lines-500-kV")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-ac-lines-500-kV")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_500_val)
    } else {
      if (ac_lines_500_counter > 1) {
        ac_lines_500 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-500-kV");
        ctx_ac_lines_500 = ac_lines_500.node().getContext("2d");
        ctx_ac_lines_500.LineCap = "round";
      }
      console.log(`ac 500 counter is odd, value of ${ac_lines_500_counter}`);
      draw_json_layer(gridmap, draw_grid_class_ac_500, ctx_ac_lines_500);
      load(2000);
      console.log(ac_lines_500_val);
      increment_asset_total(ac_lines_500_val);
    }
  });

  /**
   * Create the electrical grid class ac lines 735 layer.
   */

  const ac_lines_735_check = d3.select(".checkbox.electrical-grid-ac-lines-735-kV");
  let ac_lines_735_counter = 0;
  ac_lines_735_check.on("change", function() {
    ac_lines_735_counter++;
    if (ac_lines_735_counter % 2 == 0) {
      console.log(`ac 735 counter is even, value of ${ac_lines_735_counter}`);
      ac_lines_735.remove();
      d3.select(".map.layer.electrical-grid-ac-lines-735-kV")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-ac-lines-735-kV")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(ac_lines_735_val)
    } else {
      if (ac_lines_735_counter > 1) {
        ac_lines_735 = d3.select(".map.layer.canvas.electrical-grid-ac-lines-735-kV");
        ctx_ac_lines_735 = ac_lines_735.node().getContext("2d");
        ctx_ac_lines_735.LineCap = "round";
      }
      console.log(`ac 735 counter is odd, value of ${ac_lines_735_counter}`);
      draw_json_layer(gridmap, draw_grid_class_ac_735, ctx_ac_lines_735);
      load(2000);
      console.log(ac_lines_735_val);
      increment_asset_total(ac_lines_735_val);
    }
  });


  /**
   * Create the electrical grid class dc lines layer.
   */
  const dc_lines_check = d3.select(".checkbox.electrical-grid-dc-lines");
  let dc_lines_counter = 0;
  dc_lines_check.on("change", function() {
    dc_lines_counter++;
    if (dc_lines_counter % 2 == 0) {
      console.log(`dc lines counter is even, value of ${dc_lines_counter}`);
      dc_lines.remove();
      update_active_layers('electrical-grid-dc-lines', false);
      d3.select(".map.layer.electrical-grid-dc-lines")
        .append("canvas")
        .attr("class", "map layer canvas electrical-grid-dc-lines")
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(dc_lines_val)
    } else {
      if (dc_lines_counter > 1) {
        dc_lines = d3.select(".map.layer.canvas.electrical-grid-dc-lines");
        ctx_dc_lines = dc_lines.node().getContext("2d");
        ctx_dc_lines.LineCap = "round";
      }
      console.log(`dc lines counter is odd, value of ${dc_lines_counter}`);
      draw_json_layer(gridmap, draw_grid_class_dc, ctx_dc_lines);
      load(2000);
      update_active_layers('electrical-grid-dc-lines', true);
      console.log(dc_lines_val);
      increment_asset_total(dc_lines_val);
    }
    update_legend(legend_ctx, active_layers);
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
