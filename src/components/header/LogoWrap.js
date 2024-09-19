import styled from 'styled-components';
import CssVars from '../../const/CssVars';
import logo from '../../static/images/rdcep_logo.png';


const LogoWrapDiv =styled.div`
  display: inline-block;
  height: 4rem;
  width: 4rem;
  margin-right: 1rem;
  border-radius: 2rem;
  background-color: ${CssVars.white};
`

const FlexShim = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const Image = styled.img`
  height: 3.5rem;
  width: 3.5rem;
`

const LogoWrap = (props) => {

  return (
    <LogoWrapDiv>
      <FlexShim>
        <Image src={logo} alt="RDCEP logo" />
      </FlexShim>
    </LogoWrapDiv>
  );
};

export default LogoWrap;