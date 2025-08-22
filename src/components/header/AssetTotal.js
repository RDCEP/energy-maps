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

/**
 * Return asset value based on layer and year.
 *
 * @param layerName {String}
 * @param dataYear {Number}
 * @return {*}
 */
export const getAssetValue = (layerName, dataYear) => {
  return assetValues[layerName][String(dataYear)];
}

/**
 * Return prettified two-sigfig version of assetValue with unit
 *
 * @param assetValue {Number} The asset value to prettify
 * @return {string}
 */
export const prettyAssetValue = (assetValue) => {
  const units = {1: 'k', 2: 'M', 3: 'B', 4: 'T'}
  const magnitude = Math.floor(Math.log10(assetValue));
  const unitMagnitude = assetValue === 0 ? 0 : Math.floor(magnitude / 3);
  const unit = assetValue === 0 ? '' : units[unitMagnitude]
  const significantDigits = 2;
  const significantValue = (assetValue === 0) ? 0 : Math.round(assetValue / 10 ** (magnitude - (significantDigits - 1))) * 10 ** (magnitude - (significantDigits - 1))
  // return `$${Math.round(assetValue / Math.pow(10, unitMagnitude * 3) * 10) / 10} ${unit}`
  return `$${Math.round(significantValue / Math.pow(10, unitMagnitude * 3) * 10) / 10} ${unit}`
}

/**
 * Asset total in an <h2> element for the MainHeader.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const AssetTotal = () => {
  const {contextTotalAssetValue} = useContext(TotalAssetValueContext)
  const [totalAssetValue] = contextTotalAssetValue;

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