import {useEffect} from 'react';
import MainHeader from './components/header/MainHeader';
import Main from './components/Main';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

function App() {

  useEffect(() => {
    UIkit.use(Icons)
  });

  return (
    <div className="main-wrap">
      <MainHeader />
      <Main />
    </div>
  );
}

export default App;