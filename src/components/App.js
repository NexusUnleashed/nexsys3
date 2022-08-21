import piedpiper from '../styles/piedpiper.svg'
import '../styles/App.css';
import nexsys from '../nexsys';
import * as React from 'react';

window.nexusclient = {
  variables() {
    return {
      get() {
        return false;
      }
    }
  }
}

function App() {
  const startup = React.useMemo(() => {window.nexsys = nexsys;});
  return (
    <div className="App">
      <header className="App-header">
        <img src={piedpiper} className="App-logo" alt="logo" />
        <p>
          nexsys 3.0.
        </p>
        <a
          className="App-link"
          href="https://github.com/Log-Wall/nexsys3"
          target="_blank"
          rel="noopener noreferrer"
        >
          nexsys3 on github
        </a>
      </header>
    </div>
  );
}

export default App;
