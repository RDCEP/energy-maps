#!/usr/bin/env python
# -*- coding: utf-8 -*-
# import pandas as pd


def wells():
    """Add new classes to original wells. ONly reads lat and lon
    from original data to save time.

    :return:
    :rtype:
    """
    fields = ['Surface Latitude (WGS84)', 'Surface Longitude (WGS84)', ]
    df1 = pd.read_csv('../src/Wells_Modified_Classified.csv',
                      skipinitialspace=True, usecols=fields)
    fields = ['active', 'class', 'oilgas', 'usegas',
             'useoil', 'gor', 'whichoil', 'whichgas',
             'whichgor', ]
    df = pd.read_csv('../src/nvec.dat', header=None,
                     names=fields)
    for col in [('lat', 'Surface Latitude (WGS84)'),
                ('lon', 'Surface Longitude (WGS84)'), ]:
        df[col[0]] = df1[col[1]]

    df = df.loc[df['active'] == 1]
    # df.to_csv('../static/csv/Wells_abbr.csv')
    oil = df.loc[df['oilgas'] == 'OIL']
    offshore = df.loc[oil['class'] == 'Off']
    offshore.to_csv('../static/csv/Wells_offshore.csv', index=False,
               columns=['lon', 'lat'])
    oil = df.loc[df['class'] != 'Off']
    oil.to_csv('../static/csv/Wells_oil.csv', index=False,
               columns=['lon', 'lat', 'class', 'oilgas'])
    gas = df.loc[df['oilgas'] == 'GAS']
    gas.to_csv('../static/csv/Wells_gas.csv', index=False,
               columns=['lon', 'lat', 'class', 'oilgas'])


def get_classes(path):
    df = pd.read_csv(path, usecols=['class'])
    return df['class'].unique()


def get_offshores(path):
    df = pd.read_csv(path)
    return df[df['class'] == 'Off']


def foo(path):
    df = pd.read_csv(path, usecols=['lon', 'lat'])
    df.to_csv('../static/csv/oref.csv')
    return df.columns


def prune_grid():
    import json
    f_name = 'Electric_Power_Transmission_Lines'
    with open('../static/json/{}.geojson'.format(f_name), 'r') as f:
        j = json.loads(f.read())

        for i, feature in enumerate(j['features']):

            # Remove bits poking into Canada
            if feature['properties']['OBJECTID'] == 56388:
                feature['geometry']['coordinates'] = [
                    [-122.716378783, 48.996860321],
                    [-122.71619532, 48.992334895],
                    [-122.702313269, 48.9807155570001],
                    [-122.680297681, 48.9647542550001],
                    [-122.635471498, 48.9284285360001],
                    [-122.610520498, 48.9119168450001],
                    [-122.625438269, 48.9043068610001]
                ]

            if feature['properties']['OBJECTID'] == 61793:
                feature['geometry']['coordinates'] = [
                    [-110.291744939, 48.812577488],
                    [-110.291821082, 48.8127392920001],
                    [-110.292154206, 48.813158077],
                    [-110.292125653, 48.8157278950001],
                    [-110.29218276, 48.8267876290001],
                    [-110.292192278, 48.8327172460001],
                    [-110.292201796, 48.8387134880001],
                    [-110.292201796, 48.8419019660001],
                    [-110.287233481, 48.8418924480001],
                    [-110.276744817, 48.8419019660001],
                    [-110.270301236, 48.8419019660001],
                    [-110.270320272, 48.850715489],
                    [-110.27032979, 48.8566260700001],
                    [-110.27032979, 48.864421185],
                    [-110.270377379, 48.870950426],
                    [-110.266674938, 48.870912354],
                    [-110.256481327, 48.870874283],
                    [-110.249904497, 48.8708552470001],
                    [-110.250370871, 48.8744339570001],
                    [-110.248848016, 48.8765945070001],
                    [-110.249457158, 48.880753805],
                    [-110.249837872, 48.8835425330001],
                    [-110.250389907, 48.887387742],
                    [-110.245611949, 48.887321117],
                    [-110.240805438, 48.8873116],
                    [-110.234599804, 48.887283046],
                    [-110.23117338, 48.888044474],
                    [-110.233286341, 48.8902430960001],
                    [-110.235285088, 48.8923846100001],
                    [-110.237359978, 48.8945927500001],
                    [-110.237293353, 48.8979811030001],
                    [-110.2372648, 48.9037013270001],
                    [-110.237312389, 48.910316229],
                    [-110.237369496, 48.914332759],
                    [-110.237426603, 48.9224609980001],
                    [-110.237445639, 48.928847471],
                    [-110.23165879, 48.9288094],
                    [-110.223102248, 48.9287903640001],
                    [-110.214954973, 48.9287998820001],
                    [-110.214964491, 48.933777714],
                    [-110.214964491, 48.938907832],
                    [-110.214954973, 48.9460462150001],
                    [-110.214935938, 48.9519758320001],
                    [-110.214945456, 48.9579340020001],
                    [-110.214916902, 48.9635780840001],
                    [-110.214964491, 48.969241201],
                    [-110.214945456, 48.976503316],
                    [-110.214945456, 48.982023665],
                    [-110.214916902, 48.9878771400001],
                    [-110.214935938, 48.993787721],
                    [-110.214916902, 48.999127231],
                ]

            if feature['properties']['OBJECTID'] == 57956:
                feature['geometry']['coordinates'] = [
                    [-112.201288478, 48.814552721],
                    [-112.201345585, 48.815314148],
                    [-112.201383657, 48.815732933],
                    [-112.200146337, 48.8164372540001],
                    [-112.200075537, 48.8175529530001],
                    [-112.200082667, 48.820290105],
                    [-112.200061277, 48.822731348],
                    [-112.200075537, 48.8258531500001],
                    [-112.200075537, 48.828247182],
                    [-112.200075537, 48.8310494620001],
                    [-112.200068407, 48.8338891340001],
                    [-112.200047016, 48.836944536],
                    [-112.200054146, 48.8392958000001],
                    [-112.200075537, 48.8411307430001],
                    [-112.200096928, 48.844204473],
                    [-112.200104059, 48.846517858],
                    [-112.200061277, 48.8487701390001],
                    [-112.200047016, 48.8516228820001],
                    [-112.200061277, 48.8543159480001],
                    [-112.200054146, 48.8572152890001],
                    [-112.200082667, 48.8594201760001],
                    [-112.200061277, 48.861770386],
                    [-112.200068407, 48.8649085180001],
                    [-112.200047016, 48.8672209470001],
                    [-112.200054146, 48.86983344],
                    [-112.200047016, 48.8725442860001],
                    [-112.200047016, 48.875118985],
                    [-112.200054146, 48.8776794820001],
                    [-112.199811713, 48.8795130180001],
                    [-112.199533628, 48.881454336],
                    [-112.199590671, 48.8831751990001],
                    [-112.199626322, 48.8857399730001],
                    [-112.199654844, 48.88801862],
                    [-112.199704757, 48.8905409510001],
                    [-112.199733278, 48.8931100350001],
                    [-112.199768931, 48.8954539750001],
                    [-112.199825974, 48.8980415560001],
                    [-112.199868756, 48.900136837],
                    [-112.199897278, 48.9026351210001],
                    [-112.199954321, 48.905170776],
                    [-112.199982842, 48.907125157],
                    [-112.200011364, 48.9097074490001],
                    [-112.200047016, 48.911985003],
                    [-112.200032755, 48.913948491],
                    [-112.201195009, 48.9159681300001],
                    [-112.202685261, 48.9184890510001],
                    [-112.20395447, 48.920714667],
                    [-112.205637243, 48.9235820490001],
                    [-112.207070452, 48.9260229430001],
                    [-112.208468009, 48.928459032],
                    [-112.208525052, 48.931026167],
                    [-112.208553573, 48.933714959],
                    [-112.208617747, 48.9360101550001],
                    [-112.208639138, 48.9381787840001],
                    [-112.20867479, 48.9411575670001],
                    [-112.208724703, 48.943588236],
                    [-112.208781746, 48.9466790870001],
                    [-112.208817397, 48.9493483050001],
                    [-112.20885305, 48.9520267450001],
                    [-112.208902962, 48.9546909960001],
                    [-112.208960006, 48.957771796],
                    [-112.208988527, 48.960257835],
                    [-112.209024179, 48.962444136],
                    [-112.209081222, 48.965543182],
                    [-112.209109743, 48.9680101100001],
                    [-112.209173917, 48.9711322140001],
                    [-112.209195309, 48.972887434],
                    [-112.209138265, 48.975859465],
                    [-112.209188178, 48.9783024830001],
                    [-112.20923096, 48.980904492],
                    [-112.209323656, 48.9839275200001],
                    [-112.209354707, 48.986363667],
                    [-112.209368968, 48.9886424040001],
                    [-112.209404619, 48.990836818],
                    [-112.20941175, 48.9933368040001],
                    [-112.209430764, 48.9953298410001],
                    [-112.20971598, 48.99721364],
                    [-112.209825313, 48.998264669],
                    [-112.209701719, 48.998953907],
                    [-112.209699342, 49.013747362],
                    [-112.209547227, 49.0571777530001],
                    [-112.209509198, 49.086349484],
                    [-112.209423634, 49.08868435],
                ]

            if (feature['properties']['VOLT_CLASS'] == 'DC'
                    or feature['properties']['TYPE'] == 'DC') \
                    and feature['properties']['VOLTAGE'] < 1000:
                feature['properties']['VOLTAGE'] *= 2

            # Remove unused properties
            props = {'voltage': feature['properties']['VOLTAGE'],
                     'class': feature['properties']['VOLT_CLASS']}

            # Remove duplicate classes
            if props['class'] == 'UNDER 100':
                props['class'] = 'Under 100'

            # Path 27
            object_ids = [62970, 64032, 64254, 64307]
            if feature['properties']['OBJECTID'] in object_ids:
                props['class'] = 'DC'
                props['voltage'] = 1000

            # Butte
            object_ids = [7986, 48100]
            if feature['properties']['OBJECTID'] in object_ids:
                props['class'] = 'DC'
                props['voltage'] = 500

            # Quebec NE
            object_ids = [51964, 30703]
            if feature['properties']['OBJECTID'] in object_ids:
                props['class'] = 'DC'
                props['voltage'] = 900

            # CU
            object_ids = [48205, 48206, ]
            if feature['properties']['OBJECTID'] in object_ids:
                props['class'] = 'DC'
                props['voltage'] = 800

            # Bay
            object_ids = [63828]
            if feature['properties']['OBJECTID'] in object_ids:
                props['class'] = 'DC'
                props['voltage'] = 400

            # Neptune cable
            if feature['properties']['OBJECTID'] == 12774:
                props['class'] = 'DC'
                props['voltage'] = 500

            feature['properties'] = props

        # Cross sound cable
        j['features'].append(
            {'type': 'Feature',
             'properties': {
                 'voltage': 300,
                 'class': 'DC'},
             'geometry': {
                 'type': 'LineString',
                 'coordinates': [
                     [-72.902222, 41.286667],
                     [-72.8675, 40.959167],
                 ]}}
        )

    f_name = 'Electric_Power_Transmission_Lines_011'
    with open('../static/json/{}.geojson'.format(f_name), 'w') as f:
        f.write(json.dumps(j))


def separate_plants():
    import json

    fuels = [
        'COAL', 'NG', 'PET', 'HYC', 'SUN', 'WND', 'GEO', 'NUC',
    ]
    for fuel in fuels:
        with open('../static/json/PowerPlants_US_2014Aug_R.geojson') as f:
            j = json.loads(f.read())
            new_json = j
            j['features'] = [x for i, x in enumerate(j['features'])
                             if j['features'][i]['properties']['primary_fu']
                             == fuel]
            for feature in j['features']:
                feature['properties'] = {
                    k: v for k, v in feature['properties'].items()
                    if k in ['primary_fu', 'total_cap']}
            with open('../static/json/power_plants-{}.json'.format(fuel), 'w') as w:
                w.write(json.dumps(new_json))


def separate_grids():
    import json
    import re

    grids = {
        'unk_under_100': ['NOT AVAILABLE', 'Under 100'],
        '100_300': ['100-161', '220-287', ],
        '345_735': ['345', '500', '735 and Above', ],
        'dc': ['DC']
    }
    for k, v in grids.items():
        with open('../static/json/Electric_Power_Transmission_Lines_011s.geojson') as f:
            j = json.loads(f.read())
            new_json = j
            new_json['features'] = [
                x for i, x in enumerate(j['features'])
                if j['features'][i]['properties']['class'] in v]
            with open('../static/json/elec_grid_split/grid-{}.json'.format(k), 'w') as w:
                w.write(json.dumps(new_json))
            # with open('../static/json/elec_grid_split/grid-{}.json'.format(k), 'w+') as n:
            #     s = n.read()
            #     s = re.sub(r'(\d+\.\d{2})\d*', '\1', s)
            #     n.write(s)


if __name__ == '__main__':
    separate_grids()
