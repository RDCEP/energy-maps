#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Blueprint, render_template


main_views = Blueprint('base_views', __name__, static_folder='static')


@main_views.route('/')
def index():
    return render_template(
        'index.html',
        scale='false',
        # index=True,
    )


@main_views.route('/builder')
@main_views.route('/builder/<float:scale>')
def builder(scale='false'):
    return render_template(
        'builder.html',
        scale=scale,
    )
