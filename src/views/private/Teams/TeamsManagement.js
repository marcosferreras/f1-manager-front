import { useState, useRef, useEffect } from "react";
// reactstrap components
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Grid,
} from "@mui/material";
// core components
import Header from "components/Headers/Header.js";
import axios from "axios";
import DriverCard from "components/Cards/DriverCard";
import CarCard from "components/Cards/CarCard";
import ManagerTeamCard from "components/Cards/ManagerTeamCard";
import { Stack } from "@mui/system";
import { API_URL_CONSTANTS } from "constants";
import { useSnackbar } from "notistack";
import { API_BASE_URL } from "constants";
import DeleteItemModal from "components/Modals/DeleteItemModal";

const CircuitsManagement = () => {
  const [team, setTeam] = useState("");
  const [view, setView] = useState();
  const [drivers, setDrivers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [cars, setCars] = useState([]);
  const [formImage, setFormImage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [newTeamImgPreview, setNewTeamImgPreview] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [send, setSend] = useState(false);
  const uploadInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    twitter: "",
    logo: "",
  });

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    setFormImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewTeamImgPreview(reader.result);
    };
  };

  const handleCreateTeam = async () => {
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
      .post(API_URL_CONSTANTS.API_TEAMS_URL, {
        name: formData.name,
        twitter: formData.twitter,
        logo: fileName.data,
      })
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar('Team created succesfully', { variant: 'success' });
          setView("view");
          setSend(!send);
        }
      });
  }

  const handleUpdateTeam = async () => {
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
      .put(API_URL_CONSTANTS.API_TEAMS_URL, {
        name: formData.name,
        twitter: formData.twitter,
        logo: fileName && fileName.data ? fileName.data : formData.logo.split('/').pop(),
      });

    enqueueSnackbar('Team updated succesfully', { variant: 'success' });
    setSend(!send);
    setView("view");
  }

  const handleDeleteTeam = () => {
    axios
      .delete(
        API_URL_CONSTANTS.API_TEAMS_URL
      )
      .then((response) => {
        enqueueSnackbar('Team deleted succesfully', { variant: 'success' });
        setSend(!send);
      });
    handleCloseDeleteModal();
  };


  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };


  useEffect(() => {
    setNewTeamImgPreview(null);
    setFormImage(null);
    axios
      .get(API_URL_CONSTANTS.API_TEAMS_URL + "/manager-team")
      .then((response) => {
        if (response.data !== "") {
          setTeam(response.data);
          setView("view");
          setDrivers(response.data.drivers);
          setFormData({
            name: response.data.name,
            twitter: response.data.twitter,
            logo: response.data.logo,
          });
          setManagers(response.data.managers);
          setCars(response.data.cars);
        } else {
          setTeam("");
          setDrivers([]);
          setFormData({
            name: "",
            twitter: "",
            logo: "",
          });
          setManagers([]);
          setCars([]);
          setView("create");
        }
      });
  }, [send]);

  const handleChange = (event, newView) => {
    if (newView === null) {
      return;
    }
    setView(newView);
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
                  <ToggleButton
                    disabled={team ? false : true}
                    value="view"
                  >
                    View Team
                  </ToggleButton>
                  <ToggleButton
                    disabled={team ? true : false}
                    value="create"
                  >
                    Create Team
                  </ToggleButton>
                  <ToggleButton
                    disabled={team ? false : true}
                    value="modify"
                  >
                    Modify Team
                  </ToggleButton>
                  <ToggleButton
                    disabled={team ? false : true}
                    value="delete"
                  >
                    Delete Team
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardHeader>
              <CardBody>
                {view === "view" && (
                  <div>
                    <Stack spacing={4} width="100%">
                      {team && (
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="d-flex justify-content-center">
                            <img src={API_BASE_URL + team.logo} alt={team.name} height={'85px'} />
                          </div>
                          <div className="align-items-center d-flex font-weight-bold">
                            <h1 className="m-0">{team.name}</h1>
                          </div>
                        </div>
                      )}
                      <div>
                        <div>
                          <ManagerTeamCard teamItem={{ "name": team.name, "twitter": team.twitter, "logo": team.logo }} />
                        </div>
                        <h2>Drivers</h2>
                        <Grid container spacing={2}>
                          {drivers.map((driver) => (
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <DriverCard
                                driverItem={driver}
                                key={driver.id}
                              ></DriverCard>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                      <div>
                        <h2>Managers</h2>
                        <Grid container spacing={2}>
                          {managers.map((manager) => (
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <ManagerTeamCard managerItem={manager} key={manager.id}></ManagerTeamCard>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                      <div>
                        <h2>Cars</h2>
                        <Grid container spacing={2}>
                          {cars.map((car) => (
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <CarCard carItem={car} key={car.id}></CarCard>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    </Stack>
                  </div>
                )}
                {view === "create" && (
                  <Stack spacing={2} width="100%">
                    <TextField
                      id="team_name"
                      label="Team Name"
                      variant="outlined"
                      fullWidth
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <TextField
                      id="team_twitter"
                      label="Twitter"
                      variant="outlined"
                      fullWidth
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                    />
                    {newTeamImgPreview && (
                      <div className="d-flex justify-content-center align-items-center">
                        <div
                          className="d-flex col-10 col-lg-6"
                        >
                          <img
                            src={newTeamImgPreview}
                            alt={team.name}
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
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleCreateTeam();
                      }}
                    >
                      Create
                    </Button>
                  </Stack>
                )}
                {view === "modify" && (
                  <Stack spacing={2} width="100%">
                    <TextField
                      id="team_name"
                      label="Team Name"
                      variant="outlined"
                      fullWidth
                      defaultValue={team.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <TextField
                      id="team_twitter"
                      label="Team Twitter"
                      variant="outlined"
                      fullWidth
                      defaultValue={team.twitter}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                    />
                    {formData.id !== "" && !newTeamImgPreview && (
                      <div
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={API_BASE_URL + formData.logo}
                          alt={formData.name}
                          className="col-10 col-lg-4"
                        />
                      </div>
                    )}
                    {newTeamImgPreview && (
                      <div
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={newTeamImgPreview}
                          alt={formData.name}
                          className="col-10 col-lg-4"
                        />
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
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleUpdateTeam();
                      }}
                    >
                      Modify
                    </Button>
                  </Stack>
                )}
                {view === "delete" && (
                  <Stack spacing={3} width="100%">
                    {team && (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="d-flex justify-content-center">
                          <img src={API_BASE_URL + team.logo} alt={team.name} height={'85px'} />
                        </div>
                        <div className="align-items-center d-flex font-weight-bold">
                          <h1 className="m-0">{team.name}</h1>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="contained"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete Team
                    </Button>
                  </Stack>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <DeleteItemModal
        item={{ type: 'team', name: formData.name }}
        handleSubmit={handleDeleteTeam}
        handleClose={handleCloseDeleteModal}
        openModal={isDeleteModalOpen}
      />
    </>
  );
};

export default CircuitsManagement;
