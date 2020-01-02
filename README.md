# Energy infrastructure maps

Maps of oil and gas wells, offshore wells, 
oil and gas pipelines, 
oil refineries, gas processing and storage, 
coal mines, railroads,
electricity transmission grid, 
and power plants in the US.  

## Structure

This is a web app built with `flask` nad is 
organized in a pretty run-of-the-mill no-frills
manner.

 * `/static/js` is the business. 
 
   * `energy-maps.init.X.vY.js` files load data 
 files and initialize the mapping functions for
 various maps (defined by the X in filename).
 
   * `energy-maps.funcs.X.vY.js` files contain 
 functions relevant to the various maps.
 
   * `energy-maps.funcs.vY.js` contain 
 functions relevant to all of the various 
 maps.
 
   * `energy-maps.globals.vY.js` contain 
 variables relevant to all of the various 
 maps.
 
   * `energy-maps.legends.vY.js` contain 
 functions responsible for drawing map 
 legends.
 
 * `/static/json` and `/static/csv` contain 
 data files.
 
 ## API

 ### Postman URL:
 
 