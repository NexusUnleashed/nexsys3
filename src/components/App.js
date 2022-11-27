/* global globalThis */
import Configuration from "./Configuration"
import { createTheme } from "@mui/material/styles";

window.nexusclient = {
  variables() {
    return {
      get() {
        return false;
      }
    }
  }
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <Configuration theme={darkTheme} nexsys={globalThis.nexsys}/>
  );
}

export default App;
