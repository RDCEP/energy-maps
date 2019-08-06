coal_check.on("change", toggle_layer(coalmine, coalmine_canvas, ctx_coalmine, coal_counter, layer_coalmines()));

/** Generalized function proposal  */
  function toggle_layer(layer, layer_canvas, ctx_layer, counter, layer_function) { 
    // let counter = 0;
    counter++;
    
    // let ctx = canvas.node().getContext("2d");
    // ctx.LineCap = "round";
    
    if (counter % 2 == 0) {
      console.log(`${layer} counter is even, current value: ${counter}`);
      layer_canvas.remove();
      d3.select(`.map.layer.${layer}`)
        .append("canvas")
        .attr("class", `map layer canvas ${layer}`)
        .attr("width", width + SCALE * 400)
        .attr("height", height);
    } else {
        if (counter > 1) {
          canvas = d3.select(`.map.layer.canvas.${layer}`);
          ctx_layer = layer.node().getContext("2d");
          ctx_layer.LineCap = "round";
        }
      console.log(`${layer} counter is odd, current value: ${counter}`)
      layer_function();
    }
  }