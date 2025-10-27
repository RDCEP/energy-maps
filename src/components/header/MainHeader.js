import styled from 'styled-components';
import {CssVars} from '../../const/CssVars';
import {AssetTotal} from './AssetTotal';
import {LogoWrap} from './LogoWrap';
import {YearPicker} from './YearPicker';

const Header = styled.header`
  background-color: ${CssVars.darkblue};
  color: ${CssVars.white};
  position: relative;
  width: 46rem;
  display: inline-block;
  margin: 1rem 0 0 0;
  padding: 1rem 3rem 1rem 2rem;
  z-index: 999;
`

const H1 = styled.h1`
  line-height: 1.25em;
  display: inline-block;
  color: ${CssVars.white};
  margin: 0;
  font-weight: bold;
  font-size: 1.5rem;
  padding: 0 3rem 0 0;
`

/**
 * Main site header.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const MainHeader = () => {

  return (
    <Header>
      <LogoWrap />
      <H1>US Energy<br />Infrastructure</H1>
      <AssetTotal />
    </Header>
  );
};
