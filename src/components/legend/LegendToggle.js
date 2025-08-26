import styled from 'styled-components';

const StyledLegendToggle = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 8rem;
  height: 2rem;
  width: 4rem;
  bottom: 100%;
  z-index: 999;
`

const StyledShade = styled.div`
  position: absolute;
  top: 0;
  height: 0;
  width: 0;
  border-width: 0 2rem 2rem 2rem;
  border-color: transparent transparent #024964 transparent;
  border-style: solid;
`

const StyledLegendToggleArrow = styled.div`
  margin: 0;
  border: none;
  border-radius: 0;
  overflow: visible;
  font: inherit;
  color: #ffffff;
  text-transform: none;
  padding: 0;
  background-color: transparent;
  display: inline-block;
  fill: currentcolor;
  line-height: 0;
`

/**
 * The graphical arrow that the user clicks to toggle visibility of the
 * LeftPane UI.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const LegendToggle = ({toggleState, setToggleState}) => {

  const toggleOptions = ()=> {
    setToggleState((toggleState === 'closed') ? 'open' : 'closed')
  }

  return (
    <StyledLegendToggle
      onClick={toggleOptions}
      className='legend-toggle' >
      <StyledShade className='shade'></StyledShade>
      <StyledLegendToggleArrow
        className='uk-icon options-toggle-arrow'
        data-uk-icon='icon: chevron-up; ratio: 3;' >
      </StyledLegendToggleArrow>
    </StyledLegendToggle>
  );
};