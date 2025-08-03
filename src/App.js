import {useEffect} from 'react';
import MainHeader from './components/header/MainHeader';
import Main from './components/Main';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import GlobalStyle from './components/GlobalStyle';
import {ZoomLevelContextProvider} from './ZoomContext';

function App() {

  useEffect(() => {
    UIkit.use(Icons)
  });

  return (
    <ZoomLevelContextProvider>
      <GlobalStyle />
      <MainHeader />
      <Main />
    </ZoomLevelContextProvider>
  );
}

export default App;