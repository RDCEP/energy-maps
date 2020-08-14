#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import numpy as np
import pandas as pd

INPUT_FILE = os.path.join('..', '..', 'static', 'csv', 'wells_gas1.csv')
OUTPUT_FILE = os.path.join('..', '..', 'static', 'csv', 'wells_gas1.1.csv')


def reduce_arr(_df):
    """
    https://stackoverflow.com/questions/29462414/remove-elements-from-2d-numpy-array-based-on-proximity
    """

    def reduce_tail(l, index, threshold=1.0):
        print('l:', l)
        elm = l[index]
        print('elm:', elm)
        mask = np.linalg.norm(elm - l, axis=1) > threshold
        print('mask:', mask)
        mask[:index + 1] = True  # ensure to return the head of the array unchanged
        print('mask:', mask)
        return l[mask]

    def my_reduce(z, threshold=1.0):
        z = np.array(z)
        print(z)
        index = 0
        while True:
            z = reduce_tail(z, index, threshold)
            print('z:', z)
            index += 1
            if index == z.shape[0]:
                break
        return z.tolist()

    def my_new_reduce_tail(arr, index, mask, threshold=1.0):
        m = np.linalg.norm(arr[index] - arr[index:], axis=1) > threshold
        mask[index+1:] = m[1:]
        return mask

    def my_new_reduce(arr, mask, threshold=1.0):
        arr = np.array(arr)
        index = 0
        while True:
            if mask[index]:
                mask = my_new_reduce_tail(arr, index, mask, threshold)
            index += 1
            if index == arr.shape[0]:
                break
        return mask

    _arr = _df.iloc[:, :2].to_numpy()
    _arr = _arr[np.lexsort((_arr[:, 1], _arr[:, 0]))]
    df['zoom'] = np.zeros(_arr.shape[0])
    for zoom, threshold in [[4, .01], [3, .015], [2, .025], [1, .05]]:
        _mask = np.ones(_arr.shape[0], dtype=np.bool)
        _mask = my_new_reduce(_arr, _mask, threshold)
        df['zoom'] = np.max(np.vstack((df['zoom'],
                                      _mask.astype(np.int) * zoom)).T, axis=1)
    return _df
    # _arr = np.array([[1, 2], [1, 3], [4, 8], [7, 7], [8, 7]])
    # return my_reduce(_arr, _threshold)


if __name__ == '__main__':
    # arr = np.genfromtxt(INPUT_FILE, delimiter=',',
    #                     skip_header=1, usecols=[0, 1])
    # print(arr[:5, :])
    # print(arr.shape)
    # arr = np.array(reduce_arr(arr, .05))
    # print(arr.shape)
    df = pd.read_csv(INPUT_FILE)
    df = reduce_arr(df)
    df.to_csv(OUTPUT_FILE)
