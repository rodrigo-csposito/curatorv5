import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header";
import texts from "../../helpers/languagesConfig";
import Language from "../../helpers/languagesConfig";

import {
  Theme,
  Grid,
  Column,
  Loading,
  Tile,
  Stack,
  ClickableTile,
} from "@carbon/react";
import { useGlobalState } from "../../hooks/globalState";

import "./style.scss";
import lobbyImage from "../../images/lobby.png";
import { queryAllResources } from "../../helpers/resourcesApiCalls";

export default function Dashboard() {
  const navigate = useNavigate();
  const { language } = useParams();
  const {
    lightMode,
    loading,
    setLoading,
    accounts,
    setAccounts,
    resources,
    setResources,
  } = useGlobalState();

  return (
    <Theme theme={lightMode ? "white" : "g100"}>
      <Header />
      {loading ? <Loading /> : ""}
      <Grid narrow className="content" style={{ marginTop: "3rem" }}>
        <Column
          sm={4}
          md={8}
          lg={10}
          xlg={10}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h1>{Language[language].lobby.title1}</h1>
        </Column>
        <Column
          sm={4}
          md={8}
          lg={6}
          xlg={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          <img
            src={lobbyImage}
            alt="login"
            width="65%"
            height="auto"
            style={{ marginBottom: "1rem" }}
          />
        </Column>
        <Column className="tilesContainer" sm={4} md={8} lg={16} xlg={16}>
          <ClickableTile onClick={() => navigate(`/${language}/train`)}>
            <h3>{Language[language].lobby.title4}</h3>
            <p className="pageDescription">
              {Language[language].lobby.paragraph3}
            </p>
          </ClickableTile>
        </Column>
        <Column className="tilesContainer" sm={4} md={8} lg={16} xlg={16}>
          <ClickableTile onClick={() => navigate(`/${language}/intents`)}>
            <h3>{Language[language].lobby.title3}</h3>
            <p className="pageDescription">
              {Language[language].lobby.paragraph2}
            </p>
          </ClickableTile>
        </Column>
      </Grid>
    </Theme>
  );
}
