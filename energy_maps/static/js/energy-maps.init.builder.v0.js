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

  // Loading
  let spinner = document.getElementById("spinner");
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  /** @description display the loading spinner for user set time in milliseconds */
  const load = async (time) => {
    // show the spinner
    spinner.style.display = 'block';
    await sleep(time);
    // hide the spinner
    spinner.style.display = 'none';
  }

  /** @description An array of keys for canvases{}.  */
  let layers = [
    "gas-well",
    "oil-well",
    "gas-pipeline",
    "oil-pipeline",
    "oil-product-pipeline",
    "gas-processing",
    "oil-refinery",
    "railroad",
    "coal-mine",
    "non-fossil-fuel-plant",
    "fossil-fuel-plant",
    "electrical-grid"
  ];

  let unimplemented_layers = [
    "off-shore-well",
    "gas-storage",
    "natural-gas-plant",
    "petroleum-plant",
    "coal-plant",
    "solar-plant",
    "wind-plant",
    "hydro-plant",
    "nuclear-plant",
    "geothermal-plant",
  ]

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

    // set lineCap = 'round' in this loop
    contexts[layers[i]].lineCap = 'round';

    console.log(contexts[i]); // currently displaying 'undefined'

    checkboxes[layers[i]] = d3
      .select(".options")
      .append("label")
      .text(`${layers[i]}`)
      .append("input")
      .attr("type", "checkbox")
      .attr("class", `checkbox ${layers[i]}`)
      .attr('data-layer', `${layers[i]}`)
    ;
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

  // Below is commented out to test generalized layer function generator

  /**
   * Create the gas well layer.
   * TODO: solve foreach console error in draw_gas_wells() under funcs.wells..js
   */
  function layer_gas_well(ctx) {
    Promise.all([d3.csv(wells_gas1)])
      .then(function(files) {
        draw_all_wells(ctx, files);
      })
      .then(function() {
        Promise.all([d3.csv(wells_gas2)]).then(function(files) {
          draw_all_wells(ctx, files);
        });
      });
  }


  /**
   * Create the oil well layer.
   */
  function layer_oil_well(ctx) {
    Promise.all([d3.csv(wells_oil1)])
      .then(function(files) {
        draw_all_wells(ctx, files);
      })
      .then(function() {
        Promise.all([d3.csv(wells_oil2)]).then(function(files) {
          draw_all_wells(ctx, files);
        });
      });
  }

  /**
   * Create the gas pipeline layer.
   */
  function layer_gas_pipeline(ctx) {
    Promise.all([
      d3.json('/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson')
    ]).then(function(files) {
      draw_pipes(ctx, files);
    })
  }

  /**
   * Create the oil pipeline layer.
   */
  function layer_oil_pipeline(ctx) {
    Promise.all([
      d3.json('/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson')
    ]).then(function(files) {
      draw_pipes(ctx, files);
    })
  }

  /**
   * Create the oil product pipeline layer.
   */
  function layer_oil_prod_pipeline(ctx) {
    Promise.all([
      d3.json('/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson')
    ]).then(function(files) {
      draw_pipes(ctx, files);
    })
  }

  /**
   * Create the gas processing layer.
   */
  function layer_processing(ctx) {
    Promise.all([
      d3.csv("/static/csv/nproc.csv")
    ]).then(function(files) {
      draw_processing(ctx, files);
    });
  }

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

  function layer_oil_refinery(ctx) {
    Promise.all([d3.json('/static/json/Petroleum_Refineries_US_2015.geojson')
      ]).then(function(files) {
        draw_refining(ctx, files);
    });
  }

  /**
   * Create the coal mine layer.
   * TODO: Ensure that the railroads always appear below the mines
   */
  function layer_coalmines(ctx) {
    Promise.all([d3.csv(mines)]).then(function(files) {
      draw_coal_mines(ctx, files).then(function() {
        coal_legend(ctx);
      });
    });
    console.log("layer coal mines");
  }

  /**
   * Create the railroad map layer.
   * TODO: Ensure that the railroads always appear below the mines
   */
  function layer_rrmap(ctx) {
    Promise.all([d3.json(rrmap)]).then(function(files) {
      draw_railroads(ctx, files);
    });
    console.log("Layer rrmap");
  }
  
  /**
   * Create the non-fossil-fuel plant layer.
   */
  function layer_nff(ctx) {
    Promise.all([d3.json('/static/json/PowerPlants_US_2014Aug_R.geojson')])
    .then(function(files) {
      draw_nff_plants(ctx, files);
    })
  }

  /**
   * Create the fossil-fuel plant layer.
   */
  function layer_ff(ctx) {
    Promise.all([
      d3.json("/static/json/PowerPlants_US_2014Aug_R.geojson")
    ]).then(function(files) {
      draw_ff_plants(ctx, files);
    });
  }

  /**
   * Create the electrical grid layer.
   */
  function layer_grid(ctx) {
    Promise.all([d3.json(gridmap)]).then(function(files) {
      draw_grid(ctx, files).then(function() {
        grid_legend(ctx);
      });
    });
  }

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

  /*
   Generalized function form nate
   */
  /** @description an object containing counters for each layer checkbox */
  let counters = {};
  /** @description an object containing the names of functions for each layer */
  let layer_funcs = {};
  // Set counter of each layer to zero
  for (let i = 0; i < layers.length; ++i) {
    counters[layers[i]] = 0;
    layer_funcs[layers[i]] = `layer_${layers[i].replace('-', '_')}`;
  }
  // Should the next line be iterating through layer_funcs.length of layers.length? layer_funcs.length hasn't been set yet, has it?
  // Correct! Dumb mistake on my part. And it should be in the same loop as `counter`.

  // Do we need to call const checks as a function somewhere?
  /** @description Toggle layer functionality on checkbox change event */  
  const checks = d3.selectall('.checkbox').on('change', function() {
    // Attach a new canvas based on the checkbox's data-layer attribute
    let layer = d3.select(this).attr('data-layer');
    // let canvas = d3.select(`.map.layer.canvas.${layer}`);
    // Increase the counter of the current layer
    counters[layer]++;
    // If the counter is even, checkbox is in off state.
    // Destroy the canvas element and replace it with a new one
    // I don't think I'd destroy the canvas. It's been included in the
    // `canvases` object above. Maybe just fill it white?
    if (counters[layer] % 2 === 0) {
      // canvas.remove();
      // console.log(`${layer} counter is even, value of ${counters[layer]}`);
      // d3.select(`.map.layer.${layer}`)
      //   .append('canvas')
      //   .attr("class", `map layer canvas ${layer}`)
      //   .attr("width", width + SCALE * 400)
      //   .attr("height", height);

      // This needs to be transparent. Another dumb mistake.
      contexts[layer].fillStyle = 'rgba(255, 255, 255, 0)';
      contexts[layer].rect(0, 0, canvases[layer].attr('width'),
        canvases[layer].attr('height'));
      contexts[layer].fill();
    } else {
      // If the checkbox has been clicked before, the layer and is turned back on,
      // Add a new context since the old one was destroyed.
      // If we're filling the canvas white instead of destroying it,
      // should be able to keep the old context/
      // if (counters[layer] > 1) {
      //     canvas.node().getContext("2d").LineCap = "round";
      //   }
        // If the checkbox is in the on state, 
        // call the relevant layer function and show the loading spinner.
        console.log(`${layer} counter is odd, value of ${counters[layer]}`);
        // This call was wrong in the past commits
        window[layer_funcs[layer]](contexts[layer]);
        load(2000);
    }
  });

})();
