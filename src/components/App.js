import piedpiper from '../styles/piedpiper.svg'
import '../styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={piedpiper} className="App-logo" alt="logo" />
        <p>
          nexSys 3.0.
        </p>
        <a
          className="App-link"
          href="https://github.com/Log-Wall/nexsys3"
          target="_blank"
          rel="noopener noreferrer"
        >
          nexSys3 on github
        </a>
      </header>
    </div>
  );
}

export default App;
