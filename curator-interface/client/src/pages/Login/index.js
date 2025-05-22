import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header";
import {
  Theme,
  Grid,
  Column,
  TextInput,
  Stack,
  Button,
  ButtonSet,
  Loading,
} from "@carbon/react";
import { useGlobalState } from "../../hooks/globalState";

import "./style.scss";
import loginImage from "../../images/login.png";

import { getAvailableWorkspaces } from "../../helpers/resourcesApiCalls";

export default function Dashboard() {
  const { language } = useParams();
  const navigate = useNavigate();
  const { loading, setLoading, setLogged, setAssistants } = useGlobalState();

  const [oneTimepassword, setOneTimepassword] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    console.log("🔐 Iniciando login...");

    try {
      const loginResponse = await fetch("/ibmid/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: oneTimepassword }),
      });

      if (!loginResponse.ok) {
        throw new Error("Falha no login");
      }

      console.log("✅ Login OK. Buscando workspaces...");

      const assistants = await getAvailableWorkspaces();

      console.log("📦 Workspaces recebidos:", assistants);
      console.log(`✅ Total de workspaces: ${assistants.length}`);

      setAssistants(assistants.length > 0 ? assistants : null);
      setLogged(true);

      navigate(`/${language}/lobby`, { replace: true });
    } catch (err) {
      console.error("❌ Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Theme theme="g100">
      <Header />
      {loading && <Loading />}
      <Grid className="content" style={{ marginTop: "3rem" }}>
        <Column sm={4} md={8} lg={12} xlg={12}>
          <img src={loginImage} alt="login" width="94%" height="94%" />
        </Column>
        <Column sm={4} md={8} lg={4} xlg={4}>
          <Stack gap={2}>
            <h2>Login</h2>
            <TextInput
              labelText="Token"
              type="password"
              value={oneTimepassword}
              onChange={(e) => setOneTimepassword(e.target.value)}
            />
            <ButtonSet style={{ width: "50%" }}>
              <Button
                href={`${process.env.REACT_APP_BACKEND_URL}/ibmid/passcode`}
                target="_blank"
                kind="secondary"
              >
                Token
              </Button>
              <Button disabled={!oneTimepassword} onClick={handleLogin}>
                Login
              </Button>
            </ButtonSet>
          </Stack>
        </Column>
      </Grid>
    </Theme>
  );
}
