import react from "react";
import { useState, useEffect } from "react";
// core components
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { LeapFrog, RaceBy } from "@uiball/loaders";
import CarCard from "components/Cards/CarCard";
import CircuitCard from "components/Cards/CircuitCard";
import { useSnackbar } from "notistack";
import { API_URL_CONSTANTS } from "constants";

export default function FuelConsumption() {
    const [cars, setCars] = useState([{
        id: 1,
        ers_FastCurve: 0.01,
        ers_SlowCurve: 0.06,
        ers_MediumCurve: 0.03,
        code: "CES767",
        consumption: 36,
        name: "Ferrari SF21",
        team: {
            id: 2,
            name: "Alpine",
            drivers: [{
                id: 1,
                name: "Carlitros",
                lastName: "Seins",
                acronym: "CS5",
                number: 55,
                image: "https://graffica.info/wp…ogo-Ferrari-1024x529.png",
                country: "sdfsdf",
                twitter: "www.google.es",
            }],
            logo: "http://localhost:8080/uploads/logo-Ferrari-1024x529.png",
            twitter: "https://www.google.com",
        }
    }]);
    const [circuits, setCircuits] = useState([{
        id: 1,
        city: "Monaco",
        country: "Monaco",
        fastCurves: 5,
        mediumCurves: 10,
        slowCurves: 15,
        image: "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monoco_Circuit.png.transform/9col/image.png",
        name: "Circuit de Monaco",
        meters: 3000,
        laps: 78,
    }]);
    const [view, setView] = useState("init-simulation");
    const [selectedCar, setSelectedCar] = useState(null);
    const [selectedCircuit, setSelectedCircuit] = useState(null);
    const [consumptionPerLap, setConsumptionPerLap] = useState(0);
    const [totalConsumption, setTotalConsumption] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const handleSimulateButtonClick = () => {
        if (selectedCar && selectedCircuit) {
            setView("loading");
            axios.post(API_URL_CONSTANTS.API_SIMULATIONS_URL + `/consumptionLap`, {
                carId: selectedCar.id,
                circuitId: selectedCircuit.id,
            }).then((response) => {
                if (response && response.status === 200) {
                    setConsumptionPerLap(response.data);
                } else {
                    enqueueSnackbar("Error calculating consumption per lap", { variant: "error" });
                }
            })
            axios.post(API_URL_CONSTANTS.API_SIMULATIONS_URL + `/consumptionTotal`, {
                carId: selectedCar.id,
                circuitId: selectedCircuit.id,
            }).then((response) => {
                if (response && response.status === 200) {
                    setTotalConsumption(response.data);
                } else {
                    enqueueSnackbar("Error calculating total consumption", { variant: "error" });
                }
            })
        } else {
            enqueueSnackbar('Please choose both car and circuit', { variant: 'error' });
        }
    };

    useEffect(() => {
        if (consumptionPerLap && totalConsumption) {
            setView("results");
        }
    }, [consumptionPerLap, totalConsumption]);

    useEffect(() => {
        axios.get(API_URL_CONSTANTS.API_CARS_URL+"/manager-cars").then((response) => {
            if (response && response.status === 200) {
                setCars(response.data.content);
            } else {
                enqueueSnackbar("Error retrieving cars", { variant: "error" });
            }
        });
        axios.get(API_URL_CONSTANTS.API_CIRCUITS_URL).then((response) => {
            if (response && response.status === 200) {
                setCircuits(response.data.content);
            } else {
                enqueueSnackbar("Error retrieving circuits", { variant: "error" });
            }
        });
    }, []);

    return (
        <>
            {view === "init-simulation" && (
                <div>
                    {/* Create 2 columns grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg rounded">
                                <div className="px-4 py-5 sm:px-6 d-flex flex-column flex-md-row">
                                    <div className="col-sm-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Car
                                        </h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            Choose a car from the list.
                                        </p>
                                    </div>
                                    <div className="col col-md-6 d-flex justify-content-center justify-content-md-left mt-4 mt-md-0 align-content-center">
                                        <Autocomplete id="combo-box-demo"
                                            options={cars}
                                            getOptionLabel={(option) => option.name} style={{ width: '100%' }}
                                            renderInput={
                                                (params) =>
                                                    <TextField {...params} label="Car for simulation" variant="outlined" />
                                            }
                                            onChange={(event, value) => setSelectedCar(value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <FontAwesomeIcon icon={faCirclePlus} size="3x" color="#b20600" />
                            </div>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-3 rounded">
                                <div className="px-4 py-5 sm:px-6 d-flex flex-column flex-md-row">
                                    <div className="col-sm-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Circuit
                                        </h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            Choose a Circuit from the list.
                                        </p>
                                    </div>
                                    <div className="col col-md-6 d-flex justify-content-center justify-content-md-left mt-4 mt-md-0 align-content-center">
                                        <Autocomplete id="combo-box-demo"
                                            options={circuits}
                                            getOptionLabel={(option) => option.name} style={{ width: '100%' }}
                                            renderInput={
                                                (params) =>
                                                    <TextField {...params} label="Circuit for simulation" variant="outlined" />
                                            }
                                            onChange={(event, value) => setSelectedCircuit(value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                        <Button variant="contained" color="primary" onClick={() => handleSimulateButtonClick()}>
                            Start simulation
                        </Button>
                    </div>
                </div>
            )}
            {view === "loading" && (
                <div className="d-flex justify-content-center m-8">
                    <LeapFrog
                        size={50}
                        lineWeight={5}
                        speed={1.4}
                        color="#b20600"
                    />
                </div>
            )}
            {view === "results" && (
                <>
                    <div className="d-flex flex-column flex-wrap flex-lg-row justify-content-between align-items-center">
                        {selectedCar && (
                            <CarCard carItem={selectedCar} />
                        )}
                        <div className="d-flex justify-content-center m-3">
                            <FontAwesomeIcon icon={faCirclePlus} size="4x" color="#b20600" />
                        </div>
                        {selectedCircuit && (
                            <CircuitCard circuitItem={selectedCircuit} />
                        )}
                    </div>
                    <div className="mt-3 mb-3">
                        <h1>Computed results</h1>
                    </div>

                    <div>
                        {/* Create 2 columns grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg rounded">
                                    <div className="px-4 py-5 sm:px-6 d-flex flex-column flex-md-row">
                                        <div className="col-sm-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Consumption per lap
                                            </h3>
                                            <p className="mt-1 mb-0 max-w-2xl text-sm text-gray-500">
                                                Estimated consumption
                                            </p>
                                        </div>
                                        <div className="col col-md-6 d-flex justify-content-center justify-content-md-left mt-4 mt-md-0 align-items-center">
                                            <h1 className="text-primary" style={{ fontWeight: 'bold' }}>{consumptionPerLap.toFixed(2)} L/lap</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-3 rounded">
                                    <div className="px-4 py-5 sm:px-6 d-flex flex-column flex-md-row">
                                        <div className="col-sm-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Total consumption
                                            </h3>
                                            <p className="mt-1 mb-0 max-w-2xl text-sm text-gray-500">
                                                Estimated consumption
                                            </p>
                                        </div>
                                        <div className="col col-md-6 d-flex justify-content-center justify-content-md-left mt-4 mt-md-0 align-items-center">
                                            <h1 className="text-primary" style={{ fontWeight: 'bold' }}>{totalConsumption.toFixed(2)} L</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                        <Button variant="contained" color="primary" onClick={() => setView('init-simulation')}>
                            Reset simulation
                        </Button>
                    </div>
                </>
            )}
        </>
    )
}