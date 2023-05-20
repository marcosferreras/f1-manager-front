import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL_CONSTANTS, TEAMS } from "constants";

// reactstrap components
import { Card, CardBody, Container } from "reactstrap";
import Paginator from "components/Paginator/Paginator";
import CardSkeleton from "components/Skeletons/CardSkeleton";
import TeamCard from "components/Cards/TeamCard";

const Teams = () => {
  const [teams, setTeams] = useState(/*{
    content: [{
      id: 1,
      name: "Ferrari",
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
      logo: "https://graffica.info/wp-content/uploads/2016/08/logo-Ferrari-1024x529.png",
      twitter: "https://www.google.com",
    },
    {
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
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/1/1f/Alpine.svg/1200px-Alpine.svg.png",
      twitter: "https://www.google.com",
    }],
    totalPages: 8,
    size: 2
  }*/
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Retrieve teams from API
    axios.get(API_URL_CONSTANTS.API_TEAMS_URL + `?page=${page}&size=${TEAMS.PAGE_SIZE}`).then((response) => {
      if (response) {
        setTeams(response.data);
      }
    })
  }, [page]);

  const renderLoadingCards = () => (
    <div className="d-flex flex-column flex-wrap flex-md-row justify-content-between">
      <CardSkeleton loading={!teams} cardNum={3} />
    </div>
  )


  return (
    <Container className="mb-4 mt--4 mt-md--6" fluid>
      { /* Loop Card for each new recovered from API */}
      {renderLoadingCards()}
      {teams && (
        <>
          <div className="d-flex flex-column flex-wrap flex-md-row justify-content-between">
            {Array.isArray(teams.content) && teams.content.map((teamItem, index) => (
              <TeamCard key={index} teamItem={teamItem} />
            ))}
          </div>
          <Card>
            <CardBody>
              <Paginator totalPages={teams.totalPages} setPage={setPage} />
            </CardBody>
          </Card>
        </>
      )}
    </Container >
  );
};

export default Teams;
