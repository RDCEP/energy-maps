import {useContext} from 'react';
import styled from 'styled-components';
import {CssVars} from '../../const/CssVars';
import {TotalAssetValueContext} from '../../contexts/TotalAssetValueContext';
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

export const getAssetValue = (layerName, dataYear) => {
  return assetValues[layerName][String(dataYear)];
}

export const prettyAssetValue = (assetValue) => {
  const magnitude = assetValue === 0 ? 0 : Math.floor(Math.log10(assetValue) / 3);
  const unit = assetValue === 0 ? '' : {1: 'k', 2: 'M', 3: 'B', 4: 'T'}[magnitude]
  return `$${Math.round(assetValue / Math.pow(10, magnitude * 3) * 10) / 10} ${unit}`
}

export const AssetTotal = (props) => {
  const {contextTotalAssetValue} = useContext(TotalAssetValueContext)
  const [totalAssetValue, setTotalAssetValue] = contextTotalAssetValue;

  return (
    <StyledH2>
      <AssetTotalSpan>
        {totalAssetValue}
      </AssetTotalSpan>
      <AssetTotalTag>
        total asset value<br />
        <span id="value-year">out of $9.8T in 2012</span>
      </AssetTotalTag>
    </StyledH2>
  );
};