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

/** @description an array that contains the asset value of all active layers */
let asset_total = [0];
/** @description the total sum of asset values for all active layers */
let asset_total_sum;

/** Add total asset value of all active layers. */
  function calc_asset_total_sum() {
    // use Array.reduce() as an accumulator to add up all values in the array
    asset_total_sum = asset_total.reduce((total, amount) => total + amount);
  }

  /** Add the passed value to the asset total array and compute the new value */
  function increment_asset_total(value) {
    asset_total.push(value);
    calc_asset_total_sum();
    display_asset_total()
  }

  /** Remove the passed value from the asset total array and compute the new value */
  function decrement_asset_total(value) {
    for (let i in asset_total) {
      if (asset_total[i] == value) {
        asset_total.splice(i, 1)
        break
      }
    }
    calc_asset_total_sum();
    display_asset_total()
  }

  /** Display total asset value of all active layers.
   * Numeral.js is used for currency formatting (http://numeraljs.com/#format)
   */
  function display_asset_total() {
    let asset_total_sum_display = numeral(asset_total_sum).format('$0.00a').toUpperCase();
    /** @description A numeric constant that represents the last 4 digits of a formatted number. 
     * Used to trim the '.00B' or '.00T' off of a formatted number. */
    const UNWANTED_PRECISION = 4;
    /** @description A regular expression that matches '.00' followed by any other character. Used to check for strings ending in ".00B" or ".00T"*/
    const REGEX_TWO_TRAILING_ZEROES = /[.]00\w/;
    /** @description A regular expression that matches '.10' followed by any other character (substitute 1 for any other number). Used to check for strings ending in ".10B" or ".10T"*/
    const REGEX_ONE_POS_ONE_ZERO = /[.]\w0\w/;
    /** @description A regular expression that matches '.01' followed by any other character (substitute 1 for any other number). Used to check for strings ending in ".01B" or ".01T"*/
    const REGEX_ONE_ZERO_ONE_POS = /[.]0\w\w/;
    const NUMBER_SCALE_SIGNIFIER = 1;
    // Quick dirty fix -- couldn't display gas well format appropriately where it came from before just a few lines down, but this... works??
    if (asset_total_sum == 1059000000000) {
      asset_total_sum_display = "$1.06T "
    }
    // Check if the number format is blacklisted. 
    if (REGEX_TWO_TRAILING_ZEROES.test(asset_total_sum_display.substring(asset_total_sum_display.length - UNWANTED_PRECISION)) || REGEX_ONE_POS_ONE_ZERO.test(asset_total_sum_display.substring(asset_total_sum_display.length - UNWANTED_PRECISION)) || REGEX_ONE_ZERO_ONE_POS.test(asset_total_sum_display.substring(asset_total_sum_display.length - UNWANTED_PRECISION))) {
      if (asset_total_sum_display.substring(asset_total_sum_display.length - NUMBER_SCALE_SIGNIFIER) == 'B') {
        asset_total_sum_display = asset_total_sum_display.slice(0, -4) + 'B';  
        // Can't get gas well to format as 1.06B without making it a special case... not without wrecking everything else
        // if (asset_total_sum == 1059000000000) {
        //   asset_total_sum_display = "$1.06B"
        // }
      }
      if (asset_total_sum_display.substring(asset_total_sum_display.length - NUMBER_SCALE_SIGNIFIER) == 'T') {
        asset_total_sum_display = asset_total_sum_display.slice(0, -4) + 'T';  
      } 
    }
    document.getElementById(
      "asset-totals"
    ).innerHTML = `<p>Asset totals: ${asset_total_sum_display} of $10.5T shown.</p>`;
  }