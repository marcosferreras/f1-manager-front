import { useState, Fragment, useRef, useEffect } from "react";
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
  Divider,
} from "@mui/material";
// core components
import Header from "components/Headers/Header.js";
import axios from "axios";
import CircuitCard from "components/Cards/CircuitCard";
import { Stack } from "@mui/system";
import { API_URL_CONSTANTS } from "constants";
import { API_BASE_URL } from "constants";
import { useSnackbar } from "notistack";
import DeleteItemModal from "components/Modals/DeleteItemModal";

const CircuitsManagement = () => {
  const [view, setView] = useState("view");
  const [circuit, setCircuit] = useState("");
  const [circuits, setCircuits] = useState([]);
  const [send, setSend] = useState(false);
  const uploadInputRef = useRef(null);
  const [newCircuitImgPreview, setNewCircuitImgPreview] = useState(null);
  const [formImage, setFormImage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    laps: 0,
    meters: 0,
    slowCurves: 0,
    mediumCurves: 0,
    fastCurves: 0,
  });

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    setFormImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewCircuitImgPreview(reader.result);
    };
  };

  const handleDeleteCircuit = () => {
    axios
      .delete(
        API_URL_CONSTANTS.API_CIRCUITS_URL + "/" +
        formData.id
      )
      .then((response) => {
        enqueueSnackbar('Circuit deleted succesfully', { variant: 'success' });
        setSend(!send);
      });
    handleCloseDeleteModal();
  };

  const handleUpdateCircuit = async () => {
    const requestFormData = new FormData();
    let fileName = null;
    if (formImage) {
      const fileExtension = formImage.name.split('.').pop();
      fileName = formData.name.replace(/\s+/g, "_") + "." + fileExtension;
      requestFormData.append("file", formImage, fileName);
      fileName = await axios
        .post(
          API_URL_CONSTANTS.API_UPLOADS_URL,
          requestFormData,
        );
    }

    await axios
      .put(API_URL_CONSTANTS.API_CIRCUITS_URL + "/" + formData.id, {
        id: formData.id,
        name: formData.name,
        city: formData.city,
        image: fileName && fileName.data ? fileName.data : circuit.image.split('/').pop(),
        country: formData.country,
        laps: formData.laps,
        meters: formData.meters,
        slowCurves: formData.slowCurves,
        mediumCurves: formData.mediumCurves,
        fastCurves: formData.fastCurves,
      });

    enqueueSnackbar('Circuit updated succesfully', { variant: 'success' });
    setSend(!send);
    setView("view");
  }

  const handleCreateCircuit = async () => {
    const requestFormData = new FormData();
    const fileExtension = formImage.name.split('.').pop();
    let fileName = formData.name.replace(/\s+/g, "_") + "." + fileExtension;
    requestFormData.append("file", formImage, fileName);
    fileName = await axios
      .post(
        API_URL_CONSTANTS.API_UPLOADS_URL,
        requestFormData,
      );

    axios
      .post(API_URL_CONSTANTS.API_CIRCUITS_URL, {
        name: formData.name,
        city: formData.city,
        country: formData.country,
        image: fileName.data,
        laps: formData.laps,
        meters: formData.meters,
        slowCurves: formData.slowCurves,
        mediumCurves: formData.mediumCurves,
        fastCurves: formData.fastCurves,
      })
      .then((response) => {
        enqueueSnackbar('Circuit created succesfully', { variant: 'success' });
        setView("view");
        setSend(!send);
      });
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    axios.get(API_URL_CONSTANTS.API_CIRCUITS_URL).then((response) => {
      setCircuits(response.data.content);
    });
  }, [view, send]);

  //use Effect if send changes, to errase the form
  useEffect(() => {
    setFormData({
      name: "",
      city: "",
      country: "",
      laps: 0,
      meters: 0,
      slowCurves: 0,
      mediumCurves: 0,
      fastCurves: 0,
    });
    setNewCircuitImgPreview(null);
    setFormImage(null);
    // Also clear the fields from the create form
  }, [send]);

  const handleSelectChange = (event) => {
    var circuit = circuits.find(
      (circuit) => circuit.name === event.target.value
    );
    setCircuit(circuit);
    setFormData({
      id: circuit.id,
      name: circuit.name,
      city: circuit.city,
      country: circuit.country,
      laps: circuit.laps,
      meters: circuit.meters,
      slowCurves: circuit.slowCurves,
      mediumCurves: circuit.mediumCurves,
      fastCurves: circuit.fastCurves,
    });
  };

  const handleChange = (event, newView) => {
    if (newView === null) {
      return;
    }
    setView(newView);
    setNewCircuitImgPreview(null);
    setCircuit("");
    setCircuits([]);
    setFormData({
      name: "",
      city: "",
      country: "",
      laps: 0,
      meters: 0,
      slowCurves: 0,
      mediumCurves: 0,
      fastCurves: 0,
    });
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col mb-3">
            <Card className="shadow">
              <CardHeader className="border-0">
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleChange}
                  orientation="horizontal"
                  fullWidth={true}
                >
                  <ToggleButton value="view">View Circuits</ToggleButton>
                  <ToggleButton value="create">Create Circuit</ToggleButton>
                  <ToggleButton value="modify">Modify Circuit</ToggleButton>
                  <ToggleButton value="delete">Delete Circuit</ToggleButton>
                </ToggleButtonGroup>
              </CardHeader>
              <CardBody>
                {view === "view" && (
                  <div>
                    {circuits.length === 0 && <h1>No circuits</h1>}
                    {circuits.length !== 0 &&
                      //Make grid with min 1 and max 3 columns depending on screen size

                      <Grid container spacing={2}  >
                        {circuits.map((circuit) => (
                          <Grid item xs={12} sm={8} md={6}>
                            <CircuitCard circuitItem={circuit} />
                          </Grid>
                        ))}
                      </Grid>
                    }
                  </div>
                )}
                {view === "create" && (
                  <FormGroup>
                    <Stack spacing={3} width="100%">
                      <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        fullWidth={true}
                        type="text"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="City"
                        variant="outlined"
                        fullWidth={true}
                        type="text"
                        autoComplete="off"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="Country"
                        variant="outlined"
                        fullWidth={true}
                        type="text"
                        autoComplete="off"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                      {newCircuitImgPreview && (
                        <div className="d-flex justify-content-center align-items-center">
                          <div
                            className="d-flex col-10 col-lg-6"
                          >
                            <img
                              src={newCircuitImgPreview}
                              alt={circuit.name}
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <input
                          ref={uploadInputRef}
                          type="file"
                          accept="image/*"
                          hidden
                          required
                          onChange={onChangeImage}
                        />
                        <Button
                          onClick={() =>
                            uploadInputRef.current &&
                            uploadInputRef.current.click()
                          }
                          variant="contained"
                        >
                          Upload circuit image
                        </Button>
                      </div>
                      <TextField
                        id="outlined-basic"
                        label="Laps"
                        variant="outlined"
                        fullWidth={true}
                        type="number"
                        autoComplete="off"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, laps: e.target.value })
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="Meters"
                        variant="outlined"
                        fullWidth={true}
                        type="number"
                        autoComplete="off"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, meters: e.target.value })
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="Slow Corners"
                        variant="outlined"
                        fullWidth={true}
                        type="number"
                        autoComplete="off"
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            slowCurves: e.target.value,
                          })
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="Medium Corners"
                        variant="outlined"
                        fullWidth={true}
                        type="number"
                        autoComplete="off"
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mediumCurves: e.target.value,
                          })
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="Fast Corners"
                        variant="outlined"
                        fullWidth={true}
                        type="number"
                        autoComplete="off"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, fastCurves: e.target.value })
                        }
                      />
                      <Button
                        variant="contained"
                        fullWidth={true}
                        onClick={() => {
                          //Submit form to API localhost:8080/cicuits via POST request and redirect to /admin/circuits-management
                          handleCreateCircuit();
                        }}
                      >
                        Create
                      </Button>
                    </Stack>
                  </FormGroup>
                )}
                {view === "modify" && (
                  <div>
                    <Stack spacing={3} width="100%">
                      <h2 className="mb-0" style={{ fontWeight: 'bold' }}>Choose circuit</h2>
                      <Select onChange={handleSelectChange} fullWidth>
                        {circuits.map((circuit) => (
                          <MenuItem value={circuit.name}>{circuit.name}</MenuItem>
                        ))}
                      </Select>
                    </Stack>

                    {circuit !== "" && (
                      <div className="mt-4">
                        <Divider sx={{ bgcolor: "primary.main", borderBottomWidth: 2 }}></Divider>
                        <div className="mt-4">
                          <FormGroup>
                            <Stack spacing={3} width="100%">
                              <TextField
                                id="outlined-basic"
                                label="Name"
                                variant="outlined"
                                fullWidth={true}
                                type="text"
                                autoComplete="off"
                                onChange={(e) =>
                                  setFormData({ ...formData, name: e.target.value })
                                }
                                defaultValue={circuit.name}
                                value={formData.name}
                              />
                              <TextField
                                id="outlined-basic"
                                label="City"
                                variant="outlined"
                                fullWidth={true}
                                type="text"
                                autoComplete="off"
                                onChange={(e) =>
                                  setFormData({ ...formData, city: e.target.value })
                                }
                                defaultValue={circuit.city}
                                value={formData.city}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Country"
                                variant="outlined"
                                fullWidth={true}
                                type="text"
                                autoComplete="off"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    country: e.target.value,
                                  })
                                }
                                defaultValue={circuit.country}
                                value={formData.country}
                              />
                              {circuit.image !== "" && !newCircuitImgPreview && (
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                >
                                  <img
                                    src={API_BASE_URL + circuit.image}
                                    alt={circuit.name}
                                    className="col-10 col-lg-6"
                                  />
                                </div>
                              )}
                              {newCircuitImgPreview && (
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                >
                                  <img
                                    src={newCircuitImgPreview}
                                    alt={circuit.name}
                                    className="col-10 col-lg-6"
                                  />
                                </div>
                              )}
                              <div>
                                <input
                                  ref={uploadInputRef}
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  onChange={onChangeImage}
                                />
                                <Button
                                  onClick={() =>
                                    uploadInputRef.current &&
                                    uploadInputRef.current.click()
                                  }
                                  variant="contained"
                                >
                                  Upload circuit image
                                </Button>
                              </div>
                              <TextField
                                id="outlined-basic"
                                label="Laps"
                                variant="outlined"
                                fullWidth={true}
                                type="number"
                                autoComplete="off"
                                onChange={(e) =>
                                  setFormData({ ...formData, laps: e.target.value })
                                }
                                defaultValue={circuit.laps}
                                value={formData.laps}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Meters"
                                variant="outlined"
                                fullWidth={true}
                                type="number"
                                autoComplete="off"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    meters: e.target.value,
                                  })
                                }
                                defaultValue={circuit.meters}
                                value={formData.meters}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Slow Corners"
                                variant="outlined"
                                fullWidth={true}
                                type="number"
                                autoComplete="off"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    slowCurves: e.target.value,
                                  })
                                }
                                defaultValue={circuit.slowCurves}
                                value={formData.slowCurves}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Medium Corners"
                                variant="outlined"
                                fullWidth={true}
                                type="number"
                                autoComplete="off"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    mediumCurves: e.target.value,
                                  })
                                }
                                defaultValue={circuit.mediumCurves}
                                value={formData.mediumCurves}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Fast Corners"
                                variant="outlined"
                                fullWidth={true}
                                type="number"
                                autoComplete="off"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    fastCurves: e.target.value,
                                  })
                                }
                                defaultValue={circuit.fastCurves}
                                value={formData.fastCurves}
                              />
                              <Button
                                variant="contained"
                                fullWidth={true}
                                onClick={() => {
                                  //Submit form to API localhost:8080/cicuits via PUT request and redirect to /admin/circuits-management
                                  handleUpdateCircuit();
                                }}
                              >
                                Modify
                              </Button>
                            </Stack>
                          </FormGroup>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {view === "delete" && (
                  <div>
                    <Stack spacing={3} width="100%">
                      <h2 className="mb-0" style={{ fontWeight: 'bold' }}>Choose circuit</h2>
                      <Select onChange={handleSelectChange} fullWidth>
                        {circuits.map((circuit) => (
                          <MenuItem value={circuit.name}>{circuit.name}</MenuItem>
                        ))}
                      </Select>

                      {circuit !== "" && (
                        <div>
                          <Button
                            variant="contained"
                            fullWidth={true}
                            onClick={() => {
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </Stack>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <DeleteItemModal
        item={{ type: 'circuit', name: formData.city }}
        handleSubmit={handleDeleteCircuit}
        handleClose={handleCloseDeleteModal}
        openModal={isDeleteModalOpen}
      />
    </>
  );
};

export default CircuitsManagement;
