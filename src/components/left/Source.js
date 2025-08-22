import styled from 'styled-components';
import {StyledH6} from '../../const/StyledBlocks';

const StyledSourceSection = styled.section`
`;

const StyledSourceP = styled.p`
  font-size: .75rem;
  line-height: 1.2;
  text-align: center;
  padding: 0 2rem;
`;

/**
 * Source reference that appears at the top of LeftPane UI
 *
 * @return {JSX.Element}
 * @constructor
 */
export const Source = () => {

  return (
    <StyledSourceSection>
      <StyledH6>Source</StyledH6>
      <StyledSourceP>
        <a href="">A Physical Inventory of the U.S. Energy System.</a> Chen,
          Weisbach, Matteson, Brizius, Moyer, 2020.
      </StyledSourceP>
    </StyledSourceSection>
  )
};