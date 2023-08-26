import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const GroupedButtons = ({ curative, precache, setCacheTable }) => {
  const [count, setCount] = React.useState(precache[curative] || 0);

  const handleIncrement = () => {
    setCount((count) => count + 1);
  };

  const handleDecrement = () => {
    if (count === 0) {
      return;
    }
    setCount((count) => count - 1);
  };

  React.useEffect(() => {
    setCacheTable((prev) => ({ ...prev, [curative]: count }));
  }, [count]);

  return (
    <div>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button disabled={count === 0} onClick={handleDecrement}>
          -
        </Button>
        <Button disabled={count === 0}>{count}</Button>
        <Button onClick={handleIncrement}>+</Button>
      </ButtonGroup>
      <span style={{ color: "white" }}> {curative}</span>
    </div>
  );
};

export default GroupedButtons;
