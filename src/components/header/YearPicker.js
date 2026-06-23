import {useContext} from 'react';
import {DataYearContext} from '../../contexts/DataYearContext';
import styled from 'styled-components';
import {CssVars} from '../../const/CssVars';
import {LayerContext} from '../../contexts/LayerContext';
import {getLayersFromState} from '../map/Layers';
import {ZoomLevelContext} from '../../contexts/ZoomContext';
import {disableAllLayers} from '../map/layers/layerWrapper';

const StyledYearPickerWrap = styled.div`
  background-color: ${CssVars.darkblue};
  color: ${CssVars.white};
  position: absolute;
  top: 7rem;
  left: 0;
  //width: 100%;
  width: 26rem;
  display: inline-block;
  //margin: 1rem 0 0 0;
  padding: 0 3rem 1rem 22rem;
  z-index: 800;
`;

const StyledSlider = styled.input`
  width: 100%;
`;

const StyledMinYear = styled.span`
  position: absolute;
  left: 22rem;
  top: 1.25rem;
  font-size: .66rem;
  color: ${CssVars.white};
`;

const StyledMaxYear = styled.span`
  position: absolute;
  right: 3rem;
  top: 1.25rem;
  font-size: .66rem;
  color: ${CssVars.white};
`;

export const YearPicker = () => {

  const {contextDataYear} = useContext(DataYearContext);
  const [dataYear, setDataYear] = contextDataYear;
  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const [, setMapLayers] = contextMapLayers;
  const [layerState, ] = contextLayerState;
  const {contextZoomLevel} = useContext(ZoomLevelContext);
  const [zoomLevel, ] = contextZoomLevel;

  const onYearChange = (e) => {
    setDataYear(e.target.value);
    disableAllLayers();
    setMapLayers(getLayersFromState(layerState, zoomLevel, dataYear))
    //TODO: Need to update total asset value in header
  };

  return <StyledYearPickerWrap>
    <StyledSlider
      type='range'
      min='2000'
      max='2022'
      value={dataYear}
      onChange={onYearChange}>
    </StyledSlider>
    <StyledMinYear>2000</StyledMinYear>
    <StyledMaxYear>2022</StyledMaxYear>
  </StyledYearPickerWrap>
}