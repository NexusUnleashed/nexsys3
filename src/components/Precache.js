
import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
/*
class GroupedButtons extends React.Component {
  state = { counter: 0 };

  handleIncrement = () => {
    this.setState(state => ({ counter: state.counter + 1 }));
  };

  handleDecrement = () => {
    this.setState(state => ({ counter: state.counter - 1 }));
  };
  render() {
    const displayCounter = this.state.counter > 0;

    return (
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button onClick={this.handleIncrement}>+</Button>
        {displayCounter && <Button disabled>{this.state.counter}</Button>}
        {displayCounter && <Button onClick={this.handleDecrement}>-</Button>}
      </ButtonGroup>
    );
  }
}
*/
const GroupedButtons = () => {
    const [state, setState] = React.useState({counter: 0});

    const handleIncrement = () => {
        setState(state => ({ counter: state.counter + 1 }));
    };
    
    const handleDecrement = () => {
        if (state.counter === 0) { return; }
        setState(state => ({ counter: state.counter - 1 }));
    };

    React.useEffect(() => {
      // Update the document title using the browser API
      window.precache = state;
      console.log(window.precache)
    });

    return (
        <ButtonGroup size="small" aria-label="small outlined button group">
        <Button onClick={handleIncrement}>+</Button>
        <Button disabled>{state.counter}</Button>
        <Button disabled={state.counter === 0} onClick={handleDecrement}>-</Button>
      </ButtonGroup>
    )
}

const Precache = () => {
    return (
        <div>
        <div><GroupedButtons/>Kelp</div>
        <div><GroupedButtons/>Bloodroot</div>
        </div>
    );
}

export default Precache;