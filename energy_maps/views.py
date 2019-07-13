#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Blueprint, render_template


main_views = Blueprint('base_views', __name__, static_folder='static')


@main_views.route('/')
def index():
    return render_template(
        'images.html',
        index=True,
    )


@main_views.route('/coal')
@main_views.route('/coal/<float:scale>')
def coal(scale='false'):
    return render_template(
        'coal.html',
        scale=scale,
    )


@main_views.route('/grid')
@main_views.route('/grid/<float:scale>')
def grid(scale='false'):
    return render_template(
        'grid.html',
        scale=scale,
    )


@main_views.route('/power/ff')
@main_views.route('/power/ff/<float:scale>')
def power_plants_ff(scale='false'):
    return render_template(
        'plants_ff.html',
        scale=scale,
    )


@main_views.route('/power/nff')
@main_views.route('/power/nff/<float:scale>')
def power_plants_nff(scale='false'):
    return render_template(
        'plants_nff.html',
        scale=scale,
    )


@main_views.route('/power')
@main_views.route('/power/<float:scale>')
def power_plants(scale='false'):
    return render_template(
        'plants.html',
        scale=scale,
    )


@main_views.route('/gas_oil')
@main_views.route('/gas_oil/<float:scale>')
def gas_oil(scale='false'):
    return render_template(
        'wells.html',
        scale=scale,
    )
