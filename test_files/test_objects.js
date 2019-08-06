








let layers = ['gas-well', 'oil-well', 'off-shore-well', 'gas-pipeline', 'oil-pipeline', 'oil-product-pipeline', 'gas-processing', 'gas-storage', 'oil-refinery', 'railroad', 'coal-mine', 'natural-gas-plant', 'petroleum-plant', 'coal-plant', 'non-fossil-fuel-plant', 'solar-plant', 'wind-plant', 'hydro-plant', 'nuclear-plant', 'geothermal-plant', 'fossil-fuel-plant']

// Objects to contain keys from the layers array with corresponding d3 expressions as values
let canvases = {};
let contexts = {};

  for (let i = 0; i < layers.length; i++) {
    canvases[layers[i]] = d3
      .select(`.map-layer.${layers[i]}`)
      .append("canvas")
      .attr("id", `canvas-${layers[i]}`)
      .attr("width", width + SCALE * 400)
      .attr("height", height);

      contexts[canvases[i]]
      
  }

  console.log(canvases.length(), contexts)


// Set coal canvas
  /** @description A canvas element for the coal mines, attached to div "map-layer coal-mine" with id="coalminecanvas" */
  const coalmine_canvas = d3
    .select(".map-layer.coal-mine")
    .append("canvas")
    .attr("id", "coalminecanvas")
    .attr("width", width + SCALE * 400)
    .attr("height", height);
  const ctx_coalmine = coalmine_canvas.node().getContext("2d");
  ctx_coalmine.LineCap = "round";
  



  function layer(class_name, layer_function) {
    const check = d3.select(`.checkbox.${class_name}`);
    check.on("change", function () {
      layer_function;
    });
  }

  layer("coal-mine", layer_coalmines());