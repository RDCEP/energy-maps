# US Energy Infrastructure Visualization

This data visualization project is the result of a grant-funded partnership between the [National Science Foundation](https://www.nsf.gov/) and the [Center for Robust Decision-making on Climate and Energy Policy](https://www.rdcep.org/). The application utilizes the [D3.js](https://d3js.org/) library, leveraging nationwide data to vizualize US energy infrastructure by location and total asset value in USD. The end user can toggle layers on and off for the resource they wish to see, and the current available options include:
* gas wells
* offshore wells
* oil and gas pipelines
* oil refineries
* gas processing and storage
* coal mines
* railroads
* electricity transmission grid
* power plants   

## Getting Started

`git clone`
`python run.py`

view documentation at [docs](./energy_maps/docs/index.html)

### Prerequisites

Ensure that you have [Python 3.x](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/stable/) installed on your machine; install [Flask](https://flask.palletsprojects.com/en/1.1.x/installation/) if you haven't already:
`python --version`
`pip --version`
`pip install Flask`

## Structure

The web app is built with [Flask](https://github.com/pallets/flask) and is 
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

 * `/static/css` and `/static/sass` contain project stylesheets.
   * All styling is written in SCSS and compiled down to CSS like so: 
   `sass main.v#.sass main.v#.css`

## API

 * [Node/Express microservice](https://hidden-brook-47088.herokuapp.com/)
 * [Endpoints on Postman](https://documenter.getpostman.com/view/9183499/SWLce9RF?version=latest)
 
## Style Guide

 * Function names are snake_case()
 * Fat arrow functions are generally avoided
 * Descriptive variable names are used rather than magic numbers
 * [JSDoc](https://devhints.io/jsdoc) is used whenever possible 
 * Curly braces open at the end of a line and close on their own line, like so:
    * `if (i === foo) {`
      * `bar()`
    * `}`

    
## License

This project is licensed under the [TBA]() License - see [LICENSE.md](LICENSE.md) for details.

## Acknowledgments

* **Nathan Matteson** - *Original codebase & static maps, UI design* - [njmattes](https://github.com/njmattes)
* **Benjamin Kleeman** - *Core app dev from 07/2019-08/2020* - [bkleeman](https://github.com/bkleeman)

