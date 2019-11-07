/** Draw a layer to the screen. 
 * Pass the data from a JSON file through a drawing function out to a canvas context. */
function draw_json_layer(path, draw_function, ctx) {
    Promise.all([
      d3.json(path)
    ]).then(function(files) {
      draw_function(ctx, files)
    })
    console.log(`draw json layer`);
  }  

  function draw_plant_json_layer(path, draw_function, fuel, ctx) {
    Promise.all([
      d3.json(path)
    ]).then(function(files) {
      draw_function(ctx, files, fuel)
    })
    console.log(`draw json layer`);
  } 

// function draw_json_layer(arg_obj) {
//   Promise.all([
//     d3.json(arg_obj.path)
//   ]).then(function(files) {
//     arg_obj.f(arg_obj.ctx, files)
//   }).then(function() {spinner.style.display = "none"})
//   console.log(`draw json layer`);
// }  

function draw_csv_layer(path, draw_function, ctx) {
    Promise.all([
        d3.csv(path)
    ]).then(function(files) {
        draw_function(ctx, files)
    });
    console.log(`draw csv layer`);
}

// Loading
let spinner = document.getElementById("spinner");
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
/** @description display the loading spinner for user set time in milliseconds */
const load = async time => {
  // show the spinner
  spinner.style.display = "block";
  await sleep(time);
  // hide the spinner
  spinner.style.display = "none";
};

function create_layer(label, canvas, asset_value, ctx, draw_function, arg_obj) {
  checkbox = d3.select(`.checkbox.${label}`);
  let counter = 0;
  
  checkbox.on("change", function() {
    console.log(spinner.style.display);
    counter++;
    if (counter % 2 == 0) {
      // call the spinner here
      // spinner.style.display = "block";
      console.log(`counter is even, current value is ${counter}`);
      canvas.remove();
      d3.select(`.map.layer.${label}`)
        .append("canvas")
        .attr("class", `map layer canvas ${label}`)
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      decrement_asset_total(asset_value);
      // kill the spinner here
      // spinner.style.display = "none";
    } 
    else {
      if (counter > 1) {
        canvas = d3.select(`.map.layer.canvas.${label}`);
        ctx = canvas.node().getContext("2d");
        ctx.LineCap = "round";
      }
      // call the spinner here
      spinner.style.display = "block";
      console.log(`counter is odd, current value is ${counter}`);
      draw_function(arg_obj);
      // load(load_time);
      console.log(asset_value);
      increment_asset_total(asset_value);
      // kill the spinner here
      // spinner.style.display = "none";
    }
  });

}

  /** @description the total sum of asset values for all active layers */
  let asset_total_sum = 0;

  /** Add the passed value to the asset total array and compute the new value */
  function increment_asset_total(value) {
    asset_total_sum += value;
    display_asset_total();
  }

  /** Remove the passed value from the asset total array and compute the new value */
  function decrement_asset_total(value) {
    asset_total_sum -= value;
    display_asset_total();
  }

  /** Display total asset value of all active layers.
   * Numeral.js is used for currency formatting (http://numeraljs.com/#format)
   */
  function display_asset_total() {
    document.getElementById(
      "asset-totals"
    ).innerHTML = `${d3.format('$.2~s')(asset_total_sum)
      .replace(/G/, ' B')
      .replace(/T/, ' T')}`
    ;
  }