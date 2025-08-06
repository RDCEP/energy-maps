import {useContext} from 'react';
import styled from 'styled-components';
import CssVars from '../../const/CssVars';
import {LayerContext} from '../../contexts/LayerContext';
import {DataYearContext} from '../../contexts/DataYearContext';
import {getLayersFromState} from '../map/Layers';
import {prettyAssetValue} from '../../const/asset_values/AssetValues';


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

const AssetTotal = (props) => {

  // const {contextDataYear} = useContext(DataYearContext);
  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const [layerState, setLayerState] = contextLayerState;
  // const [mapLayers, setMapLayers] = contextMapLayers;
  // const [dataYear, setDataYear] = contextDataYear;

  const totalAssetValue = prettyAssetValue(
    layerState.reduce((acc, val) => acc + val.assetValue, 0)
  );

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

export default AssetTotal;