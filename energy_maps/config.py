#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import timedelta

class FlaskConfig(object):
    DEBUG = True
    ASSETS_DEBUG = True

    CACHE_TYPE = 'redis'
    CACHE_KEY_PREFIX = 'energy_maps'
    SEND_FILE_MAX_AGE_DEFAULT = timedelta(days=365)

    ADMINS = frozenset(['matteson@obstructures.org'])
    SECRET_KEY = 'REPLACEME'

    THREADS_PER_PAGE = 8

    CSRF_ENABLED = True
    CSRF_SESSION_KEY = 'REPLACEME'

    COMPRESS_MIMETYPES = [
        'text/html',
        'text/css',
        'text/xml',
        'application/json',
        'application/vnd.ms-excel',
        'application/octet-stream',
        'application/javascript',
        'image/png',
        'image/gif'
        ]