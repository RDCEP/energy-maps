#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import configparser
from flask import Blueprint, render_template


main_views = Blueprint('base_views', __name__, static_folder='static')
config_file = configparser.ConfigParser()
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
config_file.read(os.path.join(BASE_DIR, 'config.ini'))
print([k for k in config_file.keys()])


@main_views.route('/')
def index():
    return render_template(
        'index.html',
        scale='false',
        # index=True,
        api_domain=config_file.get('api', 'domain'),
        api_endpoint=config_file.get('api', 'endpoint'),
    )


@main_views.route('/builder')
@main_views.route('/builder/<float:scale>')
def builder(scale='false'):
    return render_template(
        'builder.html',
        scale=scale,
    )
