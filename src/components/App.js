import piedpiper from './piedpiper.svg'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={piedpiper} className="App-logo" alt="logo" />
        <p>
          nexSys 2.0.
        </p>
        <a
          className="App-link"
          href="https://github.com/Log-Wall/nexsys2"
          target="_blank"
          rel="noopener noreferrer"
        >
          nexSys2 on github
        </a>
      </header>
    </div>
  );
}

export default App;
