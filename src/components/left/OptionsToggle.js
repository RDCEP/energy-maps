import styled from 'styled-components';

const StyledOptionsToggle = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  right: 0;
  align-items: center;
  height: 4rem;
  width: 2rem;
  top: 14.5rem;
  z-index: 999;
`

const StyledShade = styled.div`
  position: absolute;
  top: 0;
  height: 0;
  width: 0;
  border-width: 2rem 2rem 2rem 0;
  border-color: transparent #024964 transparent transparent;
  border-style: solid;
`

const StyledOptionsToggleArrow = styled.div`
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

export const OptionsToggle = () => {
  return (
    <StyledOptionsToggle>
      <StyledShade></StyledShade>
      <StyledOptionsToggleArrow
        className='uk-icon'
        data-uk-icon='icon: chevron-left; ratio: 3;' >
      </StyledOptionsToggleArrow>
    </StyledOptionsToggle>
  );
};