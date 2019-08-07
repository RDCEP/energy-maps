  
   /** Create a canvas element and drawing context for a map layer */
   // layer_class as a string
   function create_canvas_context(layer_class) {
     let canvas_element = d3.select(`.map.layer.canvas.${layer_class}`);
     let context = canvas_element.node().getContext("2d");
     context.LineCap = "round";
   }

   // example
   create_canvas_context("oil-wells");