import Configuration from "./Configuration"

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
  return (
    <Configuration />
  );
}

export default App;
