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
assets.register('js_builder',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.builder.v0.js',
                       'js/energy-maps.legends.v0.js',
                       'js/energy-maps.init.builder.v0.js',
                       filters='jsmin',
                       output='gen/js_builder.js'))
assets.register('js_coal',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.coal.v0.js',
                       'js/energy-maps.legends.v0.js',
                       'js/energy-maps.init.coal.v0.js',
                       filters='jsmin',
                       output='gen/js_coal.js'))
assets.register('js_grid',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.grid.v0.js',
                       'js/energy-maps.legends.v0.js',
                       'js/energy-maps.init.grid.v0.js',
                       filters='jsmin',
                       output='gen/js_grid.js'))
assets.register('js_plants',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.plants.v0.js',
                       'js/energy-maps.legends.v0.js',
                       'js/energy-maps.init.plants.nff.v0.js',
                       'js/energy-maps.init.plants.ff.v0.js',
                       filters='jsmin',
                       output='gen/js_plants.js'))
assets.register('js_plants_ff',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.plants.v0.js',
                       'js/energy-maps.legends.v0.js',
                       'js/energy-maps.init.plants.ff.v0.js',
                       filters='jsmin',
                       output='gen/js_plants.js'))
assets.register('js_plants_nff',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.plants.v0.js',
                       'js/energy-maps.legends.v0.js',
                       'js/energy-maps.init.plants.nff.v0.js',
                       filters='jsmin',
                       output='gen/js_plants.js'))
assets.register('js_wells',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.wells.v0.js',
                       'js/energy-maps.legends.v0.js',
                       'js/energy-maps.init.wells.v1.js',
                       filters='jsmin',
                       output='gen/js_wells.js'))
assets.register('js_bigfucker',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.builder.v0.js',
                       'js/energy-maps.funcs.coal.v0.js',
                       'js/energy-maps.funcs.grid.v0.js',
                       'js/energy-maps.funcs.plants.v0.js',
                       'js/energy-maps.funcs.wells.v0.js',
                       'js/energy-maps.legends.v1.js',
                       'js/energy-maps.init.builder.v1.js',
                       'js/energy-maps.init.coal.v0.js',
                       'js/energy-maps.init.grid.v0.js',
                       'js/energy-maps.init.plants.ff.v0.js',
                       'js/energy-maps.init.plants.nff.v0.js',
                       'js/energy-maps.init.wells.v1.js',
                       filters='jsmin',
                       output='gen/js_bigfucker.js'))
assets.register('js_builderfucker',
                Bundle('js/energy-maps.globals.v0.js',
                       'js/energy-maps.funcs.v0.js',
                       'js/energy-maps.funcs.overlays.v0.js',
                       'js/energy-maps.funcs.coal.v0.js',
                       'js/energy-maps.funcs.grid.v0.js',
                       'js/energy-maps.funcs.plants.v0.js',
                       'js/energy-maps.funcs.wells.v0.js',
                       'js/energy-maps.legends.v1.js',
                       'js/energy-maps.init.builder.v1.js',
                       filters='jsmin',
                       output='gen/js_builderfucker.js'))

# @app.errorhandler(400)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=400,
#         error_msg='Your client seems to be speaking a bunch of bollocks.'), 403
#
#
# @app.errorhandler(401)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=401,
#         error_msg='You *do* in fact need stinking badges for that.'), 403
#
#
# @app.errorhandler(403)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=403,
#         error_msg='Access to this is forbidden. For you anyway.'), 403
#
#
# @app.errorhandler(404)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=404,
#         error_msg='Some things change. Link rot remains.'), 404
#
#
# @app.errorhandler(500)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=500,
#         error_msg='The server has soiled it\'s diaper. '
#                   'Maintenance is required.'), 500
