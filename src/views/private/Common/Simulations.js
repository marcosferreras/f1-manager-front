import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip,
    CardBody,
    Form,
} from "reactstrap";
import { useState, useEffect } from "react";
// core components
import Header from "components/Headers/Header.js";
import {
    Button,
    ToggleButton,
    ToggleButtonGroup,
    FormGroup,
    Input,
    Autocomplete,
    TextField,
} from "@mui/material";
import axios from "axios";
import FuelConsumption from "components/Simulations/FuelConsumption";
import ERS from "components/Simulations/ERS";

const Simulations = () => {
    const [view, setView] = useState("fuel-consumption");
    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
          setView(newAlignment);
        }
      };
    return (
        <>
            <div>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row>
                        <div className="col">
                            <Card>
                                <CardHeader className="border-0">
                                    <ToggleButtonGroup
                                        value={view}
                                        exclusive
                                        onChange={handleChange}
                                        orientation="horizontal"
                                        fullWidth={true}
                                        color="primary"
                                    >
                                        <ToggleButton value="fuel-consumption">Fuel Consumption</ToggleButton>
                                        <ToggleButton value="ers-value">ERS (Energy Recovery System)</ToggleButton>
                                    </ToggleButtonGroup>
                                </CardHeader>
                                <CardBody>
                                    {view === "fuel-consumption" && (
                                        <div>
                                            <h1>Fuel Consumption Simulation</h1>
                                            <FuelConsumption/>
                                        </div>
                                    )}
                                    {view === "ers-value" && (
                                        <div>
                                            <h1>ERS (Energy Recovery System) Simulation</h1>
                                            <ERS/>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Simulations;