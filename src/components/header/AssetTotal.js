import styled from 'styled-components';
import CssVars from '../../const/CssVars';

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

  return (
    <StyledH2>
      <AssetTotalSpan>$41 B</AssetTotalSpan>
      <AssetTotalTag>
        total asset value<br />
        <span id="value-year">out of $9.8T in 2012</span>
      </AssetTotalTag>
    </StyledH2>
  );
};

export default AssetTotal;