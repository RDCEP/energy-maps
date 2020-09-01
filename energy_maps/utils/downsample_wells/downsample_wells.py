#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import numpy as np
import pandas as pd


def reduce_arr(_df):
    """
    https://stackoverflow.com/questions/29462414/remove-elements-from-2d-numpy-array-based-on-proximity
    """

    def reduce_tail(arr, index, mask, threshold=1.0):
        m = np.linalg.norm(arr[index] - arr[index:], axis=1) > threshold
        mask[index+1:] = m[1:]
        return mask

    def reduce(arr, mask, threshold=1.0):
        _mask = mask
        _arr = np.array(arr)
        index = 0
        while True:
            if index % 10000 == 0:
                print('Index', index)
            if _mask[index]:
                _mask = reduce_tail(_arr, index, _mask, threshold)
            index += 1
            if index == _arr.shape[0]:
                break
        return _mask

    arr = _df.iloc[:, :2].to_numpy()
    arr = arr[np.lexsort((arr[:, 1], arr[:, 0]))]
    _df['zoom'] = np.zeros(arr.shape[0])
    mask = np.zeros(arr.shape[0], dtype=np.bool)
    z0 = np.zeros(arr.shape[0])
    for zoom, threshold in [[1, .16], [2, .08], [3, .04], [4, .02]]:
        print('Zoom', zoom, 'Threshold', threshold, )
        mask = reduce(arr, ~mask, threshold)
        z = np.vstack((_df['zoom'], mask.astype(np.int) * zoom)).T.sum(axis=1)
        z[np.where(z > zoom)] = z0[np.where(z > zoom)]
        _df['zoom'] = z
        z0 = z.copy()
    return _df


if __name__ == '__main__':
    # arr = np.genfromtxt(INPUT_FILE, delimiter=',',
    #                     skip_header=1, usecols=[0, 1])
    # print(arr[:5, :])
    # print(arr.shape)
    # arr = np.array(reduce_arr(arr, .05))
    # print(arr.shape)

    INPUT_FILE = os.path.join('..', '..', 'static', 'csv', 'wells_gas.csv')
    OUTPUT_FILE = os.path.join('..', '..', 'static', 'csv', 'wells_gas.2.csv')

    df = pd.read_csv(INPUT_FILE)
    df = reduce_arr(df)
    df.to_csv(OUTPUT_FILE)
