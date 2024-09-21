import {Fragment, useEffect} from 'react';
import MainHeader from './components/header/MainHeader';
import Main from './components/Main';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import GlobalStyle from './components/GlobalStyle';

function App() {

  useEffect(() => {
    UIkit.use(Icons)
  });

  return (
    <Fragment>
      <GlobalStyle />
      <MainHeader />
      <Main />
    </Fragment>
  );
}

export default App;