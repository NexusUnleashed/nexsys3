import * as React from "react";
import {
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import DefenceRow from "./DefenceRow";

const DefenceTable = ({
  defList,
  defs,
  defPrios,
  setKeepup,
  setStaticDefs,
}) => {
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table stickyHeader size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>
              Defup
              <Tooltip
                arrow
                placement="bottom-end"
                title={
                  <div style={{ fontSize: "14px" }}>
                    Checked defences will not be kept up by serverside curing.
                    Checked defences will be managed by nexSys using the "defup"
                    alias.
                  </div>
                }
              >
                <HelpOutline fontSize="small" />
              </Tooltip>
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "12px" }}
              align="left"
            >
              Name
              <Tooltip
                arrow
                placement="bottom-end"
                title={
                  <div>
                    <div style={{ fontSize: "14px" }}>
                      <span style={{ color: "tomato" }}>Red</span>: These skills
                      will USE eq or bal to activate and should have the lowest
                      priority.
                    </div>
                    <div style={{ fontSize: "14px" }}>
                      <span style={{ color: "yellow" }}>Yellow</span>: These
                      skills are free to use but REQUIRE eq or bal to activate
                      and should have the middle priority.
                    </div>
                    <div style={{ fontSize: "14px" }}>
                      <span style={{ color: "dodgerblue" }}>Blue</span>: Skills
                      that are free to use and should likely have the highest
                      priority.
                    </div>
                  </div>
                }
              >
                <HelpOutline fontSize="small" />
              </Tooltip>
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "12px" }}
              align="left"
            >
              Priority
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {defList.map((def, i) => (
            <DefenceRow
              key={def}
              def={def}
              defs={defs}
              defPrios={defPrios}
              setKeepup={setKeepup}
              setStaticDefs={setStaticDefs}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DefenceTable;
