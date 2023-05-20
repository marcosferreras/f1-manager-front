import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL_CONSTANTS } from "constants";

// reactstrap components
import { Container } from "reactstrap";
import { Skeleton } from '@mui/material';
import VoteModal from "components/Modals/VoteModal";
import CardSkeleton from "components/Skeletons/CardSkeleton";
import dayjs from "dayjs";
import DriverVoteCard from "components/Cards/DriverVote/DriverVoteCard";
const clm = require('country-locale-map');

const Index = () => {
  const [surveyData, setSurveyData] = useState(/*
    {
      id: 1,
      title: "Survey 1",
      description: "Description 1",
      link: "https://www.google.com",
      drivers: [{
        id: 1,
        name: "Carlitros",
        lastName: "Seins",
        acronym: "CS5",
        number: 55,
        image: "https://yt3.ggpht.com/ytc/AMLnZu8eavv05f05zXDXGdPP0vB_2XSmOpEsqJcs7ilZ1g=s900-c-k-c0x00ffffff-no-rj",
        country: "sdfsdf",
        twitter: "www.google.es",
        team: {
          id: 1,
          name: "Ferrari",
          image: "https://graffica.info/wp-content/uploads/2016/08/logo-Ferrari-1024x529.png",
          country: "sdfsdf",
          twitter: "www.google.es",
        }
      },
      {
        id: 2,
        name: "Esteban",
        lastName: "Mocosón",
        acronym: "CS5",
        number: 55,
        image: "https://superviralisimo.com/wp-content/uploads/2021/06/image16x9.img_.1536.high-1.jpg",
        country: "sdfsdf",
        twitter: "www.google.es",
        team: {
          id: 2,
          name: "Alpine",
          image: "https://brandlogos.net/wp-content/uploads/2022/08/alpine_logomark-logo_brandlogos.net_pzhvz.png",
          country: "sdfsdf",
          twitter: "www.google.es",
        }
      },
      {
        id: 3,
        name: "Leguis",
        lastName: "Jamilton",
        acronym: "LH",
        number: 44,
        image: "https://dd20lazkioz9n.cloudfront.net/wp-content/uploads/2021/06/Lewis_Hamilton_styria.jpg",
        country: "sdfsdf",
        twitter: "www.google.es",
        team: {
          id: 2,
          name: "Mercedes AMG",
          image: "http://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/4149.png",
          country: "sdfsdf",
          twitter: "www.google.es",
        }
      }]
    }*/);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteDriverData, setVoteDriverData] = useState(null);

  const handleVoteClick = (data) => {
    setVoteDriverData(data);
    setIsModalOpen(true)
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    // Retrieve teams from API
    axios.get(API_URL_CONSTANTS.API_SURVEYS_URL + "/search-survey").then((response) => {
      if (response && Array.isArray(response.data)) {
        //Only one survey can be active at the same time
        setSurveyData(response.data);
      }
    })
  }, [isModalOpen]);

  const renderLoading = () => (
    <>
      {!surveyData && (
        <Container className="mb-4">
          <span>
            <Skeleton className="mb-3" style={{ backgroundColor: 'white' }} variant="text" />
            <Skeleton style={{ backgroundColor: 'white' }} variant="text" />
          </span>
        </Container>
      )}
      <div className="d-flex flex-column flex-wrap flex-lg-row justify-content-between">
        <CardSkeleton loading={!surveyData} cardNum={3} />
      </div>
    </>
  )

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <Container className="mb-4 mt--4 mt-md--6" fluid>
      {renderLoading()}
      {Array.isArray(surveyData) && surveyData.length === 0 && (
        <h1 className="bg-primary " style={{ color: "white", textAlign: 'center', borderRadius: '3px' }}>
          There are no surveys available at the moment
        </h1>
      )}
      {Array.isArray(surveyData) && surveyData.map((surveyItem, index) => (
        <div key={index} className="mb-6">
          <VoteModal handleClose={handleClose} openModal={isModalOpen} surveyData={voteDriverData} />
          {surveyItem && (
            <div className="d-flex flex-column flex-wrap flex-lg-row justify-content-center">
              <Container className="mb-4" fluid>
                <h1 style={{ color: "white", textAlign: 'center', fontWeight: 'bold' }}>{surveyItem.title}</h1>
                <h2 style={{ color: "white", textAlign: 'center' }}>{surveyItem.description}</h2>
              </Container>
              <div>
                <h3 className="bg-primary mb-4 px-4" style={{ color: "white", textAlign: 'center', borderRadius: '6px' }}>{
                  `Votaciones abiertas hasta el ${dayjs(surveyItem.limitDate).toDate().toLocaleString(undefined, options)}`
                }
                </h3>
              </div>
            </div>
          )}
          <div className="d-flex flex-column flex-wrap flex-lg-row justify-content-between">
            {Array.isArray(surveyItem.drivers) &&
              surveyItem.drivers.map((driverItem, index) => (
                <DriverVoteCard
                  key={index}
                  handleVoteClick={handleVoteClick}
                  driverItem={driverItem}
                  votes={surveyItem.votes.filter((voteItem) => {
                    return voteItem.driverId === driverItem.id;
                  }).length}
                  surveyId={surveyItem.id}
                />
              ))
            }
            {Array.isArray(surveyItem.drivers) && surveyItem.drivers.length === 0 && (
              <div className="d-flex w-100 justify-content-center">
                <h2 style={{ color: "white", textAlign: 'center' }}>❌ There are no available drivers in this survey</h2>
              </div>
            )}
          </div>
        </div>
      ))}
    </Container >
  );
};

export default Index;
