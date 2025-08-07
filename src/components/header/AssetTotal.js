import {useContext} from 'react';
import styled from 'styled-components';
import {CssVars} from '../../const/CssVars';
import {LayerContext} from '../../contexts/LayerContext';
import {AssetValueContext} from '../../contexts/AssetValueContext';
import {assetValues} from './AssetValues';


const StyledH2 = styled.h2`
  line-height: 1.25em;
  display: inline-block;
  color: ${CssVars.white};
  margin: 0;
  font-weight: bold;
  font-size: 1rem;
`

const AssetTotalSpan = styled.span`
  display: inline-block;
  font-size: 3.5rem;
  padding: 0 2rem 0 0;
`

const AssetTotalTag = styled.span`
  display: inline-block;
  font-weight: normal;
  padding: 0 2rem 0 0;
`

export const getAssetValue = function(layerName, dataYear) {
  return assetValues[layerName][String(dataYear)];
}

export const prettyAssetValue = function(assetValue) {
  const magnitude = assetValue === 0 ? 0 : Math.floor(Math.log10(assetValue) / 3);
  const unit = assetValue === 0 ? '' : {1: 'k', 2: 'M', 3: 'B', 4: 'T'}[magnitude]
  return `$${Math.round(assetValue / Math.pow(10, magnitude * 3) * 10) / 10} ${unit}`
}

export const AssetTotal = (props) => {
  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const [layerState, setLayerState] = contextLayerState;
  const {contextAssetValue} = useContext(AssetValueContext)
  const [totalAssetValue, setTotalAssetValue] = contextAssetValue;

  setTotalAssetValue(prettyAssetValue(
    layerState.reduce((acc, val) => val.visible ? acc + val.assetValue : acc, 0)
  ));

  return (
    <StyledH2>
      <AssetTotalSpan>{totalAssetValue}</AssetTotalSpan>
      <AssetTotalTag>
        total asset value<br />
        <span id="value-year">out of $9.8T in 2012</span>
      </AssetTotalTag>
    </StyledH2>
  );
};