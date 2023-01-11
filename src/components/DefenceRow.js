import * as React from "react";
import {
    TableRow,
    TableCell,
    TextField,
    Checkbox,
} from "@mui/material";

const getColor = (def) => {
    let res;
    if (
        def.balsUsed.indexOf("balance") > -1 ||
        def.balsUsed.indexOf("equilibrium") > -1
    ) {
        res = "tomato";
    } else {
        res = "dodgerblue";
    }

    return res;
};

const DefenceRow = ({ def, defs, defPrios, setKeepup, setStaticDefs }) => {
    const [checked, setChecked] = React.useState(defPrios.static[def] > 0);
    const [prio, setPrio] = React.useState(
        defPrios.keepup[def] || defPrios.static[def] || 0
    );

    const handleChange = (e) => {
        setChecked(e.target.checked);
    };

    const handleText = (e) => {
        setPrio(parseInt(e.target.value));
    };

    React.useEffect(() => {
        setStaticDefs((prevState) => {
            return { ...prevState, ...{ [def]: checked ? prio : 0 } };
        });
        setKeepup((prevState) => {
            return { ...prevState, ...{ [def]: checked ? 0 : prio } };
        });
    }, [prio, checked]);

    return (
        <TableRow
            key={def}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
            <TableCell>
                <Checkbox onChange={handleChange} checked={checked} />
            </TableCell>
            <TableCell
                sx={{
                    fontSize: "12px",
                    color: getColor(defs[def]),
                }}
                align="left"
            >
                {defs[def].name}
            </TableCell>
            <TableCell align="left">
                <TextField
                    error={prio < 0 || !Number.isInteger(parseInt(prio)) ? true : false}
                    label={prio < 0 || !Number.isInteger(parseInt(prio)) ? "error" : ""}
                    margin="none"
                    size="small"
                    sx={{ width: "8ch" }}
                    variant="outlined"
                    value={prio}
                    onChange={handleText}
                />
            </TableCell>
        </TableRow>
    );
};

export default DefenceRow;