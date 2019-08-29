// Since all the heavy lifting for everything is already being done in the .x.funcs files, What needs to actually go in here?

function draw_json_layer(path, draw_function, context) {
    Promise.all([
      d3.json(path)
    ]).then(function(files) {
      draw_function(context, files)
    })
  }  