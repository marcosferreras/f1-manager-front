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
import DriverCard from "components/Cards/DriverCard";
import { API_URL_CONSTANTS } from "constants";
import { useSnackbar } from "notistack";
import { API_BASE_URL } from "constants";
import DeleteItemModal from "components/Modals/DeleteItemModal";

const PilotsManagement = () => {
  const [view, setView] = useState("view");
  const [pilots, setPilots] = useState([]);
  const [send, setSend] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [newDriverImgPreview, setNewDriverImgPreview] = useState(null);
  const [formImage, setFormImage] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    lastName: "",
    twitter: "",
    image: "",
    acronym: "",
    number: "",
    country: "",
  });
  const [teamId, setTeamId] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const uploadInputRef = useRef(null);

  useEffect(() => {
    axios.get(API_URL_CONSTANTS.API_DRIVERS_URL + "/manager-drivers").then((res) => {
      if (res.data && Array.isArray(res.data.content) && res.data.content.length > 0) {
        setPilots(res.data.content);
        setTeamId(res.data.content[0].teamDto.id);
      }
    });
    setNewDriverImgPreview(null);
    setFormImage(null);
    //reset form data
    setFormData({
      id: "",
      name: "",
      lastName: "",
      twitter: "",
      image: "",
      acronym: "",
      number: "",
      country: "",
    });
  }, [send]);

  const handleChange = (e) => {
    setView(e.target.value);
    setNewDriverImgPreview(null);
    setFormData({
      id: "",
      name: "",
      lastName: "",
      twitter: "",
      image: "",
      acronym: "",
      number: "",
      country: "",
    });
  };

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    setFormImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewDriverImgPreview(reader.result);
    };
  };

  function checkFields() {
    if (
      formData.name === "" ||
      formData.lastName === "" ||
      formData.twitter === "" ||
      formData.acronym === "" ||
      formData.acronym.length > 8 ||
      formData.number === "" ||
      formData.country === ""
    ) {
      return false;
    }
    return true;
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

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
      .post(API_URL_CONSTANTS.API_DRIVERS_URL, {
        name: formData.name,
        lastName: formData.lastName,
        twitter: formData.twitter,
        image: fileName.data,
        acronym: formData.acronym,
        number: formData.number,
        teamId: teamId,
        country: formData.country,
      })
      .then((response) => {
        enqueueSnackbar('Driver created succesfully', { variant: 'success' });
        setView("view");
        setSend(!send);
      });
  };

  const handleUpdateDriver = async () => {
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
      .put(API_URL_CONSTANTS.API_DRIVERS_URL + "/" + formData.id, {
        name: formData.name,
        lastName: formData.lastName,
        twitter: formData.twitter,
        image: fileName && fileName.data ? fileName.data : formData.image.split('/').pop(),
        acronym: formData.acronym,
        number: formData.number,
        teamId: teamId,
        country: formData.country,
      });

    enqueueSnackbar('Driver updated succesfully', { variant: 'success' });
    setSend(!send);
    setView("view");
  }

  const handleDeleteDriver = () => {
    axios
      .delete(
        API_URL_CONSTANTS.API_DRIVERS_URL + "/" +
        formData.id
      )
      .then((response) => {
        enqueueSnackbar('Driver deleted succesfully', { variant: 'success' });
        setSend(!send);
      });
    handleCloseDeleteModal();
  };

  return (
    <>
      <Header />
      {/* Page content */}
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
                  <ToggleButton value="view">View Pilots</ToggleButton>
                  <ToggleButton value="create">Create Pilots</ToggleButton>
                  <ToggleButton value="modify">Modify Pilots</ToggleButton>
                  <ToggleButton value="delete">Delete Pilots</ToggleButton>
                </ToggleButtonGroup>
              </CardHeader>
              <CardBody>
                {view === "view" && (
                  <Grid container spacing={2}>
                    {pilots.map((pilot) => (
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <DriverCard driverItem={pilot} />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {view === "create" && (
                  <Stack spacing={2} width="100%">
                    <FormGroup>
                      <TextField
                        id="name"
                        label="Name"
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
                        id="last_name"
                        label="Last Name"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="twitter"
                        label="Twitter"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.twitter}
                        onChange={(e) =>
                          setFormData({ ...formData, twitter: e.target.value })
                        }
                      />
                    </FormGroup>
                    {/** Image insert here */}

                    {newDriverImgPreview && (
                      <div className="d-flex justify-content-center align-items-center">
                        <div
                          className="d-flex col-10 col-lg-6"
                        >
                          <img
                            src={newDriverImgPreview}
                            alt={formData.name}
                            className="img-fluid"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <Button
                        variant="contained"
                        component="label"
                      >
                        Upload Image
                        <input
                          type="file"
                          hidden
                          ref={uploadInputRef}
                          onChange={onChangeImage}
                        />
                      </Button>
                    </div>
                    <FormGroup>
                      <TextField
                        id="acronym"
                        label="Acronym"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.acronym}
                        onChange={(e) =>
                          setFormData({ ...formData, acronym: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="number"
                        label="Number"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.number}
                        onChange={(e) =>
                          setFormData({ ...formData, number: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="country"
                        label="Country"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                    </FormGroup>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        if (checkFields()) {
                          handleCreateCircuit();
                        } else {
                          enqueueSnackbar('Please fill all the fields', { variant: 'error' });
                        }
                      }}
                    >
                      Create
                    </Button>
                  </Stack>
                )}
                {view === "modify" && (
                  <Stack spacing={2} width="100%">
                    <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Choose driver</h2>
                    <FormGroup style={{ paddingBottom: "10px" }} fullWidth>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">
                          Select Pilot
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={formData.id}
                          onChange={(e) => {
                            pilots.map((pilot) => {
                              if (pilot.id === e.target.value) {
                                setFormData({
                                  id: pilot.id,
                                  name: pilot.name,
                                  lastName: pilot.lastName,
                                  twitter: pilot.twitter,
                                  image: pilot.image,
                                  acronym: pilot.acronym,
                                  number: pilot.number,
                                  country: pilot.country,
                                });
                              }
                            });
                          }}
                          label="Select Pilot"
                        >
                          {pilots.map((pilot) => (
                            <MenuItem value={pilot.id}>{pilot.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                    {formData.id && (
                      <>
                        <Divider sx={{ bgcolor: "primary.main", borderBottomWidth: 2 }}></Divider>
                        <Stack spacing={2} className="mt-4" width="100%">
                          <FormGroup>
                            <TextField
                              id="name"
                              label="Name"
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
                              id="last_name"
                              label="Last Name"
                              variant="outlined"
                              style={{ paddingBottom: "10px" }}
                              fullWidth
                              value={formData.lastName}
                              onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                              }
                            />
                          </FormGroup>
                          <FormGroup>
                            <TextField
                              id="twitter"
                              label="Twitter"
                              variant="outlined"
                              style={{ paddingBottom: "10px" }}
                              fullWidth
                              value={formData.twitter}
                              onChange={(e) =>
                                setFormData({ ...formData, twitter: e.target.value })
                              }
                            />
                          </FormGroup>
                          {/** Image insert here */}
                          {formData.id !== "" && !newDriverImgPreview && (
                            <div
                              className="d-flex justify-content-center align-items-center"
                            >
                              <img
                                src={API_BASE_URL + formData.image}
                                alt={formData.name}
                                className="col-10 col-lg-6"
                              />
                            </div>
                          )}
                          {newDriverImgPreview && (
                            <div
                              className="d-flex justify-content-center align-items-center"
                            >
                              <img
                                src={newDriverImgPreview}
                                alt={formData.name}
                                className="col-10 col-lg-6"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onChangeImage}
                            ref={uploadInputRef}
                            style={{ display: "none" }}
                          />
                          <div>
                            <Button
                              variant="contained"
                              component="label"
                            >
                              Upload Image
                              <input
                                type="file"
                                hidden
                                ref={uploadInputRef}
                                onChange={onChangeImage}
                              />
                            </Button>
                          </div>
                          <FormGroup>
                            <TextField
                              id="acronym"
                              label="Acronym"
                              variant="outlined"
                              style={{ paddingBottom: "10px" }}
                              fullWidth
                              value={formData.acronym}
                              onChange={(e) =>
                                setFormData({ ...formData, acronym: e.target.value })
                              }
                            />
                          </FormGroup>
                          <FormGroup>
                            <TextField
                              id="number"
                              label="Number"
                              variant="outlined"
                              style={{ paddingBottom: "10px" }}
                              fullWidth
                              value={formData.number}
                              onChange={(e) =>
                                setFormData({ ...formData, number: e.target.value })
                              }
                            />
                          </FormGroup>
                          <FormGroup>
                            <TextField
                              id="country"
                              label="Country"
                              variant="outlined"
                              style={{ paddingBottom: "10px" }}
                              fullWidth
                              value={formData.country}
                              onChange={(e) =>
                                setFormData({ ...formData, country: e.target.value })
                              }
                            />
                          </FormGroup>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                              if (checkFields()) {
                                handleUpdateDriver();
                              } else {
                                enqueueSnackbar('Please fill all the fields', { variant: 'error' });
                              }
                            }}
                          >
                            Modify
                          </Button>
                        </Stack>
                      </>
                    )}
                  </Stack>
                )}
                {view === "delete" && (
                  <form>
                    <FormGroup style={{ paddingBottom: "10px" }} fullWidth>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">
                          Select Pilot
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={formData.id}
                          onChange={(e) => {
                            pilots.map((pilot) => {
                              if (pilot.id === e.target.value) {
                                setFormData({
                                  id: pilot.id,
                                  name: pilot.name,
                                  lastName: pilot.lastName,
                                  twitter: pilot.twitter,
                                  image: pilot.image,
                                  acronym: pilot.acronym,
                                  number: pilot.number,
                                  country: pilot.country,
                                });
                              }
                            }
                            );
                          }}
                          label="Select Pilot"
                        >
                          {pilots.map((pilot) => (
                            <MenuItem value={pilot.id}>{pilot.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                    {formData.id && (
                      <FormGroup>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </FormGroup>
                    )}
                  </form>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <DeleteItemModal
        item={{ type: 'driver', name: formData.name }}
        handleSubmit={handleDeleteDriver}
        handleClose={handleCloseDeleteModal}
        openModal={isDeleteModalOpen}
      />
    </>
  );
};

export default PilotsManagement;
