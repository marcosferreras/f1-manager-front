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
  InputLabel,
  FormControl,
  Stack,
  Divider,
} from "@mui/material";
// core components
import Header from "components/Headers/Header.js";
import axios from "axios";
import NewsCard from "components/Cards/NewsCard";
import { API_URL_CONSTANTS } from "constants";
import { useSnackbar } from "notistack";
import { API_BASE_URL } from "constants";
import DeleteItemModal from "components/Modals/DeleteItemModal";

const NewsManagement = () => {
  const [view, setView] = useState("view");
  const [news, setNews] = useState([]);
  const [send, setSend] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [newNewImgPreview, setNewNewImgPreview] = useState(null);
  const [formImage, setFormImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    link: "",
    image: "",
  });
  const uploadInputRef = useRef(null);

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setFormImage(file);
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewNewImgPreview(reader.result);
    };
  };

  useEffect(() => {
    axios
      .get(API_URL_CONSTANTS.API_NEWS_URL)
      .then((response) => {
        setNews(response.data.content);
      });
    setFormData({
      id: "",
      title: "",
      text: "",
      image: "",
      link: "",
    });
    setNewNewImgPreview(null);
    setFormImage(null);
    try {
      uploadInputRef.current.value = "";
    } catch (error) { }
  }, [send]);

  const handleChange = (event, newView) => {
    setView(event.target.value);
    setNewNewImgPreview(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  function checkFields() {
    return (
      formData.title &&
      formData.text &&
      (newNewImgPreview || formData.image) &&
      formData.link
    );
  }

  const handleCreateNew = async () => {
    const requestFormData = new FormData();
    const fileExtension = formImage.name.split('.').pop();
    let fileName = formData.title.replace(/\s+/g, "_").substring(0, 10) + "." + fileExtension;
    requestFormData.append("file", formImage, fileName);
    fileName = await axios
      .post(
        API_URL_CONSTANTS.API_UPLOADS_URL,
        requestFormData,
      );

    axios
      .post(API_URL_CONSTANTS.API_NEWS_URL + "/new", {
        title: formData.title,
        text: formData.text,
        link: formData.link,
        image: fileName.data,
      })
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar('New created succesfully', { variant: 'success' });
          setView("view");
          setSend(!send);
        }
      });
  }

  const handleUpdateNew = async () => {
    const requestFormData = new FormData();
    let fileName = null;
    if (formImage) {
      const fileExtension = formImage.name.split('.').pop();
      fileName = formData.title.replace(/\s+/g, "_").substring(0, 10) + "." + fileExtension;
      requestFormData.append("file", formImage, fileName);
      fileName = await axios
        .post(
          API_URL_CONSTANTS.API_UPLOADS_URL,
          requestFormData,
        );
    }

    await axios
      .put(API_URL_CONSTANTS.API_NEWS_URL + "/" + formData.id, {
        id: formData.id,
        title: formData.title,
        text: formData.text,
        link: formData.link,
        image: fileName && fileName.data ? fileName.data : formData.image.split('/').pop(),
      });

    enqueueSnackbar('New updated succesfully', { variant: 'success' });
    setSend(!send);
    setView("view");
  }

  const handleDeleteNew = () => {
    axios
      .delete(
        API_URL_CONSTANTS.API_NEWS_URL + "/" +
        formData.id
      )
      .then((response) => {
        enqueueSnackbar('New deleted succesfully', { variant: 'success' });
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
            <Card className="shadow border-0">
              <CardHeader className="border-0">
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleChange}
                  orientation="horizontal"
                  fullWidth={true}
                >
                  <ToggleButton value="view">View News</ToggleButton>
                  <ToggleButton value="create">Create News</ToggleButton>
                  <ToggleButton value="modify">Modify News</ToggleButton>
                  <ToggleButton value="delete">Delete News</ToggleButton>
                </ToggleButtonGroup>
              </CardHeader>

              <CardBody>
                {view === "view" && (
                  <div>
                    {news.length === 0 && <h1>No news</h1>}
                    {news.length !== 0 && (
                      <Grid container spacing={2}>
                        {news.map((newItem) => (
                          <Grid item xs={12} sm={8} md={6}>
                            <NewsCard newItem={newItem} />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </div>
                )}
                {view === "create" && (
                  <div>
                    <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Create new</h2>
                    <FormGroup>
                      <TextField
                        id="title"
                        label="Title"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="text"
                        label="Text"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        multiline
                        value={formData.text}
                        onChange={(e) =>
                          setFormData({ ...formData, text: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <TextField
                        id="link"
                        label="Link"
                        variant="outlined"
                        style={{ paddingBottom: "10px" }}
                        fullWidth
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                      />
                    </FormGroup>
                    {newNewImgPreview && (
                      <div className="d-flex justify-content-center align-items-center">
                        <div
                          className="d-flex col-10 col-lg-6"
                        >
                          <img
                            src={newNewImgPreview}
                            alt={formData.title}
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
                    <FormGroup style={{ paddingTop: "10px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!checkFields()}
                        onClick={() => {
                          handleCreateNew();
                        }}
                      >
                        Create
                      </Button>
                    </FormGroup>
                  </div>
                )}
                {view === "modify" && (
                  <>
                    <Stack spacing={3} width="100%">
                      <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Choose new</h2>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">
                          News
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={formData.id}
                          onChange={(e) =>
                            news.map((newItem) => {
                              if (newItem.id === e.target.value) {
                                setFormData({
                                  id: newItem.id,
                                  title: newItem.title,
                                  text: newItem.text,
                                  image: newItem.image,
                                  link: newItem.link,
                                });
                              }
                            })
                          }
                          label="News"
                        >
                          {news.map((newItem) => (
                            <MenuItem value={newItem.id}>
                              {newItem.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    {formData.id !== "" && (
                      <div className="mt-4">
                        <Divider sx={{ bgcolor: "primary.main", borderBottomWidth: 2 }}></Divider>
                        <div className="mt-4">
                          <FormGroup style={{ marginTop: "2rem" }}>
                            <TextField
                              id="title"
                              label="Title"
                              variant="outlined"
                              style={{ paddingBottom: "10px" }}
                              fullWidth
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                              }
                            />
                          </FormGroup>
                          <FormGroup style={{ marginTop: "1rem" }}>
                            <TextField
                              id="text"
                              label="Text"
                              variant="outlined"
                              style={{ paddingBottom: "10px" }}
                              fullWidth
                              multiline
                              value={formData.text}
                              onChange={(e) =>
                                setFormData({ ...formData, text: e.target.value })
                              }
                            />
                          </FormGroup>
                          <FormGroup style={{ marginTop: "1rem" }}>
                            <TextField
                              id="link"
                              label="Link"
                              variant="outlined"
                              style={{ paddingBottom: "10px" }}
                              fullWidth
                              value={formData.link}
                              onChange={(e) =>
                                setFormData({ ...formData, link: e.target.value })
                              }
                            />
                          </FormGroup>
                          <div style={{ marginTop: "1rem" }}>
                            {formData.image && !newNewImgPreview && (
                              <div
                                className="d-flex justify-content-center align-items-center"
                              >
                                <img
                                  src={API_BASE_URL + formData.image}
                                  alt={formData.title}
                                  className="col-10 col-lg-6"
                                />
                              </div>
                            )}
                            {newNewImgPreview && (
                              <div
                                className="d-flex justify-content-center align-items-center"
                              >
                                <img
                                  src={newNewImgPreview}
                                  alt={formData.title}
                                  className="col-10 col-lg-6"
                                />
                              </div>
                            )}
                          </div>
                          <FormGroup style={{ marginTop: "1rem" }}>
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
                          </FormGroup>
                          <FormGroup style={{ paddingTop: "10px" }}>
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={!checkFields()}
                              onClick={() => {
                                handleUpdateNew();
                              }}
                            >
                              Update
                            </Button>
                          </FormGroup>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {view === "delete" && (
                  <>
                    <Stack spacing={3} width="100%">
                      <h2 className="mb-3" style={{ fontWeight: 'bold' }}>Choose new</h2>
                      <FormGroup style={{ paddingBottom: "10px" }} fullWidth>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel id="demo-simple-select-outlined-label">
                            News
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={formData.id}
                            onChange={(e) =>
                              news.map((newItem) => {
                                if (newItem.id === e.target.value) {
                                  setFormData({
                                    id: newItem.id,
                                    title: newItem.title,
                                    text: newItem.text,
                                    image: newItem.image,
                                    link: newItem.link,
                                  });
                                }
                              })
                            }
                            label="News"
                          >
                            {news.map((newItem) => (
                              <MenuItem value={newItem.id}>
                                {newItem.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </FormGroup>
                      {formData.id !== "" && (
                        <FormGroup style={{ paddingTop: "10px" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </FormGroup>
                      )}
                    </Stack>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <DeleteItemModal
        item={{ type: 'new', name: formData.title }}
        handleSubmit={handleDeleteNew}
        handleClose={handleCloseDeleteModal}
        openModal={isDeleteModalOpen}
      />
    </>
  );
};

export default NewsManagement;
