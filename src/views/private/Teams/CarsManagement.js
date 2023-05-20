import React, { useState, Fragment, useRef, useEffect } from "react";
// reactstrap components
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  FormGroup,
  TextField,
  Select,
  MenuItem,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Stack,
  Divider,
} from "@mui/material";
// core components
import Header from "components/Headers/Header.js";
import axios from "axios";
import CarCard from "components/Cards/CarCard";
import { API_URL_CONSTANTS } from "constants";
import { useSnackbar } from "notistack";
import DeleteItemModal from "components/Modals/DeleteItemModal";

const CarsManagement = () => {
  const [view, setView] = useState("view");
  const [cars, setCars] = useState([]);
  const [send, setSend] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    carId: "",
    name: "",
    consumption: "",
    ers_fast_corner: "",
    ers_medium_corner: "",
    ers_slow_corner: "",
    code: "",
  });
  const [teamId, setTeamId] = useState(0);

  useEffect(() => {
    axios
      .get(API_URL_CONSTANTS.API_CARS_URL + "/manager-cars")
      .then((res) => {
        setCars(res.data.content);
        setTeamId(res.data.content[0].teamId);
      })
      .catch((err) => {
        console.log(err);
      });
    // reset form data
    setFormData({
      carId: "",
      name: "",
      consumption: "",
      ers_fast_corner: "",
      ers_medium_corner: "",
      ers_slow_corner: "",
      code: "",
    });
  }, [send]);

  const handleChange = (e) => {
    setView(e.target.value);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleCreateCar = () => {
    //Check if all fields are filled
    if (!checkFields()) {
      enqueueSnackbar('Please fill all fields. Check ERS values', { variant: 'error' });
      return;
    }
    axios
      .post(API_URL_CONSTANTS.API_CARS_URL, {
        name: formData.name,
        //consumption is a number
        consumption: Number.parseFloat(
          formData.consumption
        ),
        //ers is a number
        ers_FastCurve: Number.parseFloat(
          formData.ers_fast_corner
        ),
        ers_MediumCurve: Number.parseFloat(
          formData.ers_medium_corner
        ),
        ers_SlowCurve: Number.parseFloat(
          formData.ers_slow_corner
        ),
        teamId: teamId,
        code: formData.code,
      })
      .then((res) => {
        if (res && res.status === 200) {
          enqueueSnackbar('Car created successfully', { variant: 'success' });
          setSend(!send);
          setView("view");
        }
        if (res && res.status === 400) {
          enqueueSnackbar('Car code already exists', { variant: 'error' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleUpdateCar = () => {
    //Check if all fields are filled
    if (!checkFields()) {
      enqueueSnackbar('Please fill all fields correctly. Check ERS values', { variant: 'error' });
      return;
    }
    axios
      .put(API_URL_CONSTANTS.API_CARS_URL + "/" + formData.carId, {
        name: formData.name,
        //consumption is a number
        consumption: Number.parseFloat(
          formData.consumption
        ),
        //ers is a number
        ers_FastCurve: Number.parseFloat(
          formData.ers_fast_corner
        ),
        ers_MediumCurve: Number.parseFloat(
          formData.ers_medium_corner
        ),
        ers_SlowCurve: Number.parseFloat(
          formData.ers_slow_corner
        ),
        teamId: teamId,
        code: formData.code,
      })
      .then((res) => {
        //Alert the user that the car has been created
        if (res.status === 200) {
          enqueueSnackbar('Car updated successfully', { variant: 'success' });
        }
        setView("view");
        setSend(!send);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleDeleteCar = () => {
    axios
      .delete(API_URL_CONSTANTS.API_CARS_URL + "/" + formData.carId)
      .then((res) => {
        //Alert the user that the car has been created
        if (res.status === 200) {
          enqueueSnackbar('Car deleted successfully', { variant: 'success' });
        }
        setSend(!send);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function checkFields() {
    if (
      formData.name === "" ||
      formData.code === "" ||
      formData.consumption === "" ||
      formData.ers_fast_corner === "" ||
      formData.ers_medium_corner === "" ||
      formData.ers_slow_corner === "" ||
      formData.consumption === ""
    ) {
      return false;
    }
    // if ers is greater or equal than 0.01 and less or equal than 0.06 and consumption is greater than 0 return true
    if (
      Number.parseFloat(formData.ers_fast_corner) >= 0.01 &&
      Number.parseFloat(formData.ers_fast_corner) <= 0.06 &&
      Number.parseFloat(formData.ers_medium_corner) >= 0.01 &&
      Number.parseFloat(formData.ers_medium_corner) <= 0.06 &&
      Number.parseFloat(formData.ers_slow_corner) >= 0.01 &&
      Number.parseFloat(formData.ers_slow_corner) <= 0.06 &&
      Number.parseFloat(formData.consumption) > 0
    ) {
      return true;
    }
    return false;
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleChange}
                  orientation="horizontal"
                  fullWidth={true}
                >
                  <ToggleButton value="view">View Cars</ToggleButton>
                  <ToggleButton value="create">Create Cars</ToggleButton>
                  <ToggleButton value="modify">Modify Cars</ToggleButton>
                  <ToggleButton value="delete">Delete Cars</ToggleButton>
                </ToggleButtonGroup>
              </CardHeader>
              <CardBody>
                {view === "view" && (
                  <Grid container spacing={2}>
                    {cars.map((car) => (
                      <Grid item xs={12} sm={8} md={6}>
                        <CarCard carItem={car} />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {view === "create" && (
                  <Stack spacing={2} width="100%">
                    <FormGroup>
                      <TextField
                        id="car-name"
                        label="Car Name"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="car-code"
                        label="Car Code"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="car-consumption"
                        label="Car Consumption"
                        variant="outlined"
                        type={"number"}
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.consumption}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consumption: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="car-ers-fast-curve"
                        label="Car ERS Fast Corner"
                        variant="outlined"
                        type={"number"}
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.ers_fast_corner}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ers_fast_corner: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="car-ers-medium-curve"
                        label="Car ERS Medium Corner"
                        variant="outlined"
                        type={"number"}
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.ers_medium_corner}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ers_medium_corner: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="car-ers-slow-curve"
                        label="Car ERS Slow Corner"
                        variant="outlined"
                        type={"number"}
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.ers_slow_corner}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ers_slow_corner: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <Button
                      variant="contained"
                      style={{ marginTop: "10px" }}
                      fullWidth
                      onClick={() => {
                        handleCreateCar();
                      }}
                    >
                      Create Car
                    </Button>
                  </Stack>
                )}
                {view === "modify" && (
                  <>
                    <Stack spacing={2} width="100%">
                      <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Choose car</h2>
                      <FormGroup style={{ paddingBottom: "10px" }} fullWidth>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel id="car-select-label">Car</InputLabel>
                          <Select
                            labelId="car-select-label"
                            id="car-select"
                            value={formData.carId}
                            onChange={(e) =>
                              cars.map((car) => {
                                if (car.id === e.target.value) {
                                  setFormData({
                                    ...formData,
                                    carId: car.id,
                                    name: car.name,
                                    code: car.code,
                                    consumption: car.consumption,
                                    ers_fast_corner: car.ers_FastCurve,
                                    ers_medium_corner: car.ers_MediumCurve,
                                    ers_slow_corner: car.ers_SlowCurve,
                                  });
                                }
                              })
                            }
                            label="Car"
                          >
                            {cars.map((car) => (
                              <MenuItem value={car.id}>{car.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </FormGroup>
                      {formData.carId && (
                        <>
                          <Divider sx={{ bgcolor: "primary.main", borderBottomWidth: 2 }}></Divider>
                          <Stack spacing={2} className="mt-4" width="100%">
                            <FormGroup>
                              <TextField
                                id="car-name"
                                label="Car Name"
                                variant="outlined"
                                style={{ paddingBottom: "10px" }}
                                fullWidth
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({ ...formData, name: e.target.value })
                                }
                              />
                            </FormGroup>
                            <FormGroup>
                              <TextField
                                id="car-code"
                                label="Car Code"
                                variant="outlined"
                                style={{ paddingBottom: "10px" }}
                                fullWidth
                                value={formData.code}
                                onChange={(e) =>
                                  setFormData({ ...formData, code: e.target.value })
                                }
                              />
                            </FormGroup>
                            <FormGroup>
                              <TextField
                                id="car-consumption"
                                label="Car Consumption"
                                variant="outlined"
                                type={"number"}
                                style={{ paddingBottom: "10px" }}
                                fullWidth
                                value={formData.consumption}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    consumption: e.target.value,
                                  })
                                }
                              />
                            </FormGroup>
                            <FormGroup>
                              <TextField
                                id="car-ers-fast-curve"
                                label="Car ERS Fast Curve"
                                variant="outlined"
                                type={"number"}
                                style={{ paddingBottom: "10px" }}
                                fullWidth
                                value={formData.ers_fast_corner}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    ers_fast_corner: e.target.value,
                                  })
                                }
                              />
                            </FormGroup>
                            <FormGroup>
                              <TextField
                                id="car-ers-medium-curve"
                                label="Car ERS Medium Curve"
                                variant="outlined"
                                type={"number"}
                                style={{ paddingBottom: "10px" }}
                                fullWidth
                                value={formData.ers_medium_corner}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    ers_medium_corner: e.target.value,
                                  })
                                }
                              />
                            </FormGroup>
                            <FormGroup>
                              <TextField
                                id="car-ers-slow-curve"
                                label="Car ERS Slow Curve"
                                variant="outlined"
                                type={"number"}
                                style={{ paddingBottom: "10px" }}
                                fullWidth
                                value={formData.ers_slow_corner}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    ers_slow_corner: e.target.value,
                                  })
                                }
                              />
                            </FormGroup>
                            <Button
                              variant="contained"
                              style={{ marginTop: "10px" }}
                              fullWidth
                              onClick={() => {
                                handleUpdateCar();
                              }}
                            >
                              Modify Car
                            </Button>
                          </Stack>
                        </>
                      )}

                    </Stack>
                  </>
                )}
                {view === "delete" && (
                  <div>
                    <FormGroup style={{ paddingBottom: "10px" }} fullWidth>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="car-select-label">Car</InputLabel>
                        <Select
                          labelId="car-select-label"
                          id="car-select"
                          value={formData.carId}
                          onChange={(e) =>
                            cars.map((car) => {
                              if (car.id === e.target.value) {
                                setFormData({
                                  ...formData,
                                  carId: car.id,
                                  name: car.name,
                                  code: car.code,
                                  consumption: car.consumption,
                                  ers_fast_corner: car.ers_FastCurve,
                                  ers_medium_corner: car.ers_MediumCurve,
                                  ers_slow_corner: car.ers_SlowCurve,
                                });
                              }
                            }
                            )}
                          label="Car"
                        >
                          {cars.map((car) => (
                            <MenuItem value={car.id}>{car.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                    {formData.carId !== "" && (
                      <FormGroup>
                        <Button
                          variant="contained"
                          style={{ marginTop: "10px" }}
                          fullWidth
                          onClick={() => {
                            //Check if all fields are filled
                            // Prompt the user to confirm the deletion
                            setIsDeleteModalOpen(true);

                          }}
                        >
                          Delete Car
                        </Button>
                      </FormGroup>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <DeleteItemModal
        item={{ type: 'car', name: formData.name }}
        handleSubmit={handleDeleteCar}
        handleClose={handleCloseDeleteModal}
        openModal={isDeleteModalOpen}
      />
    </>
  );
};

export default CarsManagement;
