import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL_CONSTANTS, API_BASE_URL, NEWS } from "../../constants";

// reactstrap components
import { Button, Card, CardHeader, CardBody, Row, Container } from "reactstrap";
import Paginator from "components/Paginator/Paginator";
import SearchInput from "components/SearchInput/SearchInput";
import CardSkeleton from "components/Skeletons/CardSkeleton";

const News = () => {
  const [news, setNews] = useState(/*
    {
      content: [{
        id: 1,
        title: "News 1",
        text: "Description 1",
        image: "https://picsum.photos/200/300",
        link: "https://www.google.com",
      },
      {
        id: 2,
        title: "News 2",
        text: "Description 2",
        image: "https://picsum.photos/200/300",
        link: "https://picsum.photos/200/300",
      }],
      totalPages: 8,
      size: 2
    }*/);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Retrieve news from API
    fetchNews();
  }, [page]);

  const fetchNews = () => {
    // Retrieve news from API
    axios.get(API_URL_CONSTANTS.API_NEWS_URL + `?page=${page}&size=${NEWS.PAGE_SIZE}`).then((response) => {
      if (response) {
        const newsData = response.data;
        setNews(newsData);
      }
    })
  }

  const searchNews = (e) => {
    e.preventDefault();
    setPage(0);
    const title = e.target.value;
    if (title) {
      axios.post(API_URL_CONSTANTS.API_NEWS_URL + `/findNew?page=${page}&size=${NEWS.PAGE_SIZE}`, {
        title
      }).then((response) => {
        if (response) {
          const newsData = response.data;
          setNews(newsData);
        }
      })
    } else {
      fetchNews();
    }
  }

  return (
    <Container className="mb-4 mt--4 mt-md--6" fluid>
      { /* Search bar */}
      <SearchInput handleSearch={searchNews} placeHolder={NEWS.SEARCH_PLACEHOLDER} />
      { /* News */}
      { /* Loop Card for each new recovered from API */}
      <CardSkeleton loading={!news} cardNum={4} />
      {news && (
        <>
          {Array.isArray(news.content) && news.content.map((newItem, index) => (
            <Card className="shadow mb-4" key={index}>
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col-10">
                    <h2 className="mb-0">{newItem.title}</h2>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={() => window.open(newItem.link, "_blank")}
                      size="sm"
                    >
                      Expand New
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <p>
                  {newItem.text}
                </p>
                <div className="text-center">
                  <img src={API_BASE_URL+newItem.image} style={{ width: '100%', borderRadius: '8px' }} alt={newItem.title} />
                </div>
              </CardBody>
            </Card>
          ))}
          <Card>
            <CardBody>
              <Paginator totalPages={news.totalPages} setPage={setPage} />
            </CardBody>
          </Card>
        </>
      )}
    </Container>
  );
};

export default News;
