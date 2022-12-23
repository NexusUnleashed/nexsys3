import * as React from 'react';
import { Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText, ListItemButton } from '@mui/material';

const DefencePriorities = ({ defences, classList }) => {
    const [defs, setDefs] = React.useState({ ...defences });
    const [skill, setSkill] = React.useState('');
    const defList = Object.keys(defs);

    const handleChange = (e) => {
        setSkill(e.target.value);
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Class</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={skill}
                    label="This is a test"
                    onChange={handleChange}
                >
                    <MenuItem value={"all"}>{"All"}</MenuItem>
                    {classList.map((skill, i) => <MenuItem value={skill}>{skill}</MenuItem>)}
                </Select>
            </FormControl>


            
        </div>
    );
};

export default DefencePriorities;