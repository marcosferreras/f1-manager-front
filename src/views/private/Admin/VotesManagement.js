import {
  Card,
  CardHeader,
  Container,
  CardBody,
  Label,
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import axios from "axios";
import VotationCard from "components/Cards/VotationCard";
import { API_URL_CONSTANTS } from "constants";
import { useSnackbar } from "notistack";
import DeleteItemModal from "components/Modals/DeleteItemModal";

const VotesManagement = () => {
  const [view, setView] = useState("view");
  const [pilots, setPilots] = useState([]);
  const [votations, setVotations] = useState([]);
  const [send, setSend] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    link: "",
    drivers: [],
    limitDate: "",
    votes: [],
    driversId: [],
  });

  const handleChange = (event) => {
    setView(event.target.value);
    setFormData({
      id: "",
      title: "",
      description: "",
      link: "",
      drivers: [],
      limitDate: "",
      votes: [],
      driversId: [],
    });
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    axios.get(API_URL_CONSTANTS.API_DRIVERS_URL + "/manager-drivers").then((res) => {
      setPilots(res.data.content);
    });
  }, []);

  useEffect(() => {
    axios.get(API_URL_CONSTANTS.API_SURVEYS_URL).then((res) => {
      setVotations(res.data.content);
    });
  }, [send]);

  function createVotation() {
    axios.post(API_URL_CONSTANTS.API_SURVEYS_URL + "/new", {
      "title": formData.title,
      "description": formData.description,
      "link": formData.link,
      "limitDate": formData.limitDate,
      "driversId": formData.driversId
    }).then((res) => {
      setSend(!send);
      setFormData({
        id: "",
        title: "",
        description: "",
        link: "",
        drivers: [],
        limitDate: "",
        votes: [],
        driversId: [],
      });
      enqueueSnackbar('Survey created succesfully', { variant: 'success' });
      setView("view");
    });
  }

  function modifyVotation() {
    axios.put(API_URL_CONSTANTS.API_SURVEYS_URL + "/" + formData.id, {
      "title": formData.title,
      "description": formData.description,
      "link": formData.link,
      "limitDate": formData.limitDate,
      "driversId": formData.driversId
    }).then((res) => {
      setSend(!send);
      setFormData({
        id: "",
        title: "",
        description: "",
        link: "",
        drivers: [],
        limitDate: "",
        votes: [],
        driversId: [],
      });
      if (res.status === 200) {
        enqueueSnackbar('Survey modified succesfully', { variant: 'success' });
        setView("view");
      }
    });
  }

  const handleDeleteSurvey = () => {
    axios
      .delete(
        API_URL_CONSTANTS.API_SURVEYS_URL + "/" +
        formData.id
      )
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar('Survey deleted succesfully', { variant: 'success' });
          setSend(!send);
          setView("view");
        }
      });
    handleCloseDeleteModal();
  };

  function retrieveDriversId(drivers) {
    let driversId = [];
    drivers.forEach((driver) => {
      driversId.push(driver.id);
    });
    return driversId;
  }


  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Card>
          <CardHeader className="border-0">
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleChange}
              orientation="horizontal"
              fullWidth={true}
            >
              <ToggleButton value="view">View Surveys</ToggleButton>
              <ToggleButton value="create">Create Survey</ToggleButton>
              <ToggleButton value="modify">Modify Survey</ToggleButton>
              <ToggleButton value="delete">Delete Survey</ToggleButton>
            </ToggleButtonGroup>
          </CardHeader>
          <CardBody>
            {view === "view" && (
              <Grid container spacing={2}>
                {votations.map((votation) => (
                  <Grid item xs={12}>
                    <VotationCard votationItem={votation} />
                  </Grid>
                ))}
              </Grid>
            )}
            {view === "create" && (
              <>
                <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Field survey information</h2>
                <FormGroup style={{ paddingBottom: "10px" }}>
                  <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup style={{ paddingBottom: "10px" }}>
                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup style={{ paddingBottom: "10px" }}>
                  <TextField
                    label="Link"
                    variant="outlined"
                    fullWidth
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        link: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup style={{ paddingBottom: "20px" }}>
                  <Label for="exampleDate">Limit Date</Label>
                  <TextField
                    id="date"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        limitDate: e.target.value,
                      })
                    }
                    type="date"
                  />
                </FormGroup>
                <Grid container spacing={2} style={{ paddingBottom: "10px" }}>
                  <Grid item xs={4}>
                    <FormGroup>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">
                          Driver 1
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={formData.driversId[0]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              driversId: [e.target.value],
                            })
                          }
                          label="Driver 1"
                        >
                          {pilots.map((pilot) => (
                            <MenuItem value={pilot.id}>{pilot.name} {pilot.lastName}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </Grid>
                  <Grid item xs={4}>
                    <FormGroup>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">
                          Driver 2
                        </InputLabel>
                        <Select
                          disabled={formData.driversId[0] === "" || formData.driversId === []}
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={formData.driversId[1]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              driversId: [
                                formData.driversId[0],
                                e.target.value,
                              ],
                            })
                          }
                          label="Driver 2"
                        >
                          {pilots.map((pilot) => (
                            <MenuItem value={pilot.id}>{pilot.name} {pilot.lastName}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </Grid>
                  <Grid item xs={4}>
                    <FormGroup>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">
                          Driver 3
                        </InputLabel>
                        <Select
                          disabled={formData.driversId[1] === "" || formData.driversId[0] === ""}
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={formData.driversId[2]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              driversId: [
                                formData.driversId[0],
                                formData.driversId[1],
                                e.target.value,
                              ],
                            })
                          }
                          label="Driver 3"
                        >
                          {pilots.map((pilot) => (
                            <MenuItem value={pilot.id}>{pilot.name} {pilot.lastName}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={createVotation}
                >
                  Create
                </Button>
              </>
            )}
            {view === "modify" && (
              <>
                <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Choose survey</h2>
                <FormControl variant="outlined" fullWidth>
                  <Select
                    value={formData.id}
                    onChange={(e) => {
                      votations.map((votation) => {
                        if (votation.id === e.target.value) {
                          setFormData({
                            ...formData,
                            id: votation.id,
                            title: votation.title,
                            description: votation.description,
                            link: votation.link,
                            limitDate: votation.limitDate,
                            driversId: retrieveDriversId(votation.drivers),
                          });
                        }
                      });
                    }}
                  >
                    {votations.map((votation) => (
                      <MenuItem value={votation.id}>{votation.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData.id !== "" && (
                  <>
                    <Divider sx={{ bgcolor: "primary.main", borderBottomWidth: 2, marginTop: "1rem" }}></Divider>
                    <FormGroup style={{ marginTop: "2rem" }}>
                      <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup style={{ marginTop: "1rem" }}>
                      <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup style={{ marginTop: "1rem" }}>
                      <TextField
                        label="Link"
                        variant="outlined"
                        fullWidth
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup style={{ marginBottom: "2rem", marginTop: "1rem" }}>
                      <Label for="exampleDate">Limit Date</Label>
                      <TextField
                        id="date"
                        variant="outlined"
                        fullWidth
                        value={formData.limitDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            limitDate: e.target.value,
                          })
                        }
                        type="date"
                      />
                    </FormGroup>
                    <Grid container spacing={2} style={{ paddingBottom: "10px" }}>
                      <Grid item xs={4}>
                        <FormGroup>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">
                              Driver 1
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={formData.driversId[0] !== undefined ? formData.driversId[0] : ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  driversId: [e.target.value],
                                })
                              }
                              label="Driver 1"
                            >
                              {pilots.map((pilot) => (
                                <MenuItem value={pilot.id}>{pilot.name} {pilot.lastName}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </Grid>
                      <Grid item xs={4}>
                        <FormGroup>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">
                              Driver 2
                            </InputLabel>
                            <Select
                              disabled={formData.driversId[0] === "" || formData.driversId === []}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={formData.driversId[1] !== undefined ? formData.driversId[1] : ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  driversId: [
                                    formData.driversId[0],
                                    e.target.value,
                                  ],
                                })
                              }
                              label="Driver 2"
                            >
                              {pilots.map((pilot) => (
                                <MenuItem value={pilot.id}>{pilot.name} {pilot.lastName}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </Grid>
                      <Grid item xs={4}>
                        <FormGroup>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">
                              Driver 3
                            </InputLabel>
                            <Select
                              disabled={formData.driversId[1] === "" || formData.driversId[0] === ""}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={formData.driversId[2] !== undefined ? formData.driversId[2] : ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  driversId: [
                                    formData.driversId[0],
                                    formData.driversId[1],
                                    e.target.value,
                                  ],
                                })
                              }
                              label="Driver 3"
                            >
                              {pilots.map((pilot) => (
                                <MenuItem value={pilot.id}>{pilot.name} {pilot.lastName}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={modifyVotation}
                      style={{ marginTop: "1rem" }}
                    >
                      Modify
                    </Button>
                  </>
                )}

              </>
            )}
            {view === "delete" && (
              <>
                <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Choose survey</h2>
                <Select
                  fullWidth
                  onChange={(e) => {
                    votations.map((votation) => {
                      if (votation.id === e.target.value) {
                        setFormData({
                          ...formData,
                          id: votation.id,
                          title: votation.title,
                          description: votation.description,
                          link: votation.link,
                          limitDate: votation.limitDate,
                          driversId: retrieveDriversId(votation.drivers),
                        });
                      }
                    });
                  }}
                >
                  {votations.map((votation) => (
                    <MenuItem value={votation.id}>{votation.title}</MenuItem>
                  ))}
                </Select>
                {formData.id !== "" && (
                  <Button variant="contained" color="primary" fullWidth style={{ marginTop: "1rem" }} onClick={() => setIsDeleteModalOpen(true)}>
                    Delete
                  </Button>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Container>
      <DeleteItemModal
        item={{ type: 'survey', name: formData.title }}
        handleSubmit={handleDeleteSurvey}
        handleClose={handleCloseDeleteModal}
        openModal={isDeleteModalOpen}
      />
    </>
  );
};

export default VotesManagement;
