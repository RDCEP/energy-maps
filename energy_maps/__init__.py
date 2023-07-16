#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask, render_template
from flask_assets import Environment, Bundle
from energy_maps.views import main_views
from flask_compress import Compress

compress = Compress()

app = Flask(__name__)
compress.init_app(app)
app.config.from_object('energy_maps.config.FlaskConfig')
app.register_blueprint(main_views)
assets = Environment(app)


assets.register('css_main',
                Bundle('css/main.v0.css',
                       'css/main.css',
                       filters='cssmin',
                       output='gen/main.css'))
assets.register('js_underscore',
                Bundle('js/vendors/underscore-js/underscore-min.js',
                       'js/vendors/underscore-js/underscore.js',
                       filters='jsmin',
                       output='gen/js_underscore.js'))
assets.register('js_d3',
                Bundle('js/vendors/d3/d3.min.js',
                       'js/vendors/d3-queue/d3-queue.min.js',
                       'js/vendors/d3-drag/d3-drag.min.js',
                       'js/vendors/topojson-simplify/topojson-simplify.min.js',
                       filters='jsmin',
                       output='gen/js_d3.js'))
assets.register('js_numeral',
                Bundle('js/vendors/numeral-js/min/numeral.min.js',
                       filters='jsmin',
                       output='gen/js_numeral.js'))
assets.register('js_builderfucker',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.overlays.v0.js',
                       'js/energy-maps.funcs.coal.v0.js',
                       'js/energy-maps.funcs.grid.v0.js',
                       'js/energy-maps.funcs.plants.v0.js',
                       'js/energy-maps.funcs.wells.v0.js',
                       'js/energy-maps.legends.v1.js',
                       'js/energy-maps.layers.v0.js',
                       'js/energy-maps.zoom.v0.js',
                       'js/energy-maps.init.builder.v1.js',
                       'js/energy-maps.options.v0.js',
                       filters='jsmin',
                       output='gen/js_builderfucker.js'))