import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../hooks/globalState";
import Language from "../../helpers/languagesConfig";
import Header from "../../components/Header";

import { Button, Loading, Theme } from "@carbon/react";
import { useParams } from "react-router-dom";
import {
  getCognosSession,
  initializeExperiments,
} from "../../helpers/cognosApiCalls";

import "./style.scss";

import CognosApi from "../../helpers/cognos";
import { runExperiment } from "../../helpers/cloudFunctionsApiCalls";

export default function CognosPage() {
  const { language } = useParams();
  const [iframeUrl, setIframeUrl] = useState("");
  const [forceRender, setForceRender] = useState(false);

  const {
    lightMode,
    loading,
    setLoading,
    selectedAssistant,
    cognosSession,
    setCognosSession,
  } = useGlobalState();

  // useEffect(() => {
  //   if (!selectedAssistant) {
  //     console.warn("selectedAssistant não está definido.");
  //     return;
  //   }
  //   const { COGNOSURL, ASSISTANTAPIKEY, WORKSPACE_ID } = selectedAssistant;
  //   if (!COGNOSURL || !ASSISTANTAPIKEY || !WORKSPACE_ID) {
  //     console.error("Propriedades obrigatórias do selectedAssistant ausentes.");
  //     return;
  //   }
  //   console.log(selectedAssistant);
  //   setIframeUrl(COGNOSURL);
  // }, [selectedAssistant]);

  useEffect(() => {
    if (selectedAssistant?.COGNOSURL) {
      setIframeUrl(selectedAssistant.COGNOSURL);
      setForceRender((prev) => !prev); // Força o componente a re-renderizar
    }
  }, [selectedAssistant]);

  // const [skillJSON, setSkillJSON] = useState(null);

  // useEffect(async () => {
  //   setCognosSession(null);

  //   const session = await getCognosSession();
  //   if (session.data.Error) {
  //     setCognosSession(null);
  //   } else {
  //     setCognosSession(session.data);
  //   }
  // }, []);

  // useEffect(async () => {
  //   setCognosSession(null);

  //   const session = await getCognosSession();
  //   if (session.data.Error) {
  //     setCognosSession(null);
  //   } else {
  //     setCognosSession(session.data);
  //   }
  // }, [selectedAssistant]);

  // useEffect(async () => {
  //   if (cognosSession && typeof cognosSession === "string") {
  //     const cognosApi = new CognosApi({
  //       cognosRootURL:
  //         "https://us-south.dynamic-dashboard-embedded.cloud.ibm.com/daas/",
  //       node: document.getElementById("cognosDiv"),
  //       sessionCode: cognosSession,
  //       language: language,
  //     });

  //     await initializeDashboard(cognosApi);
  //   }
  // }, [cognosSession]);

  // async function initializeDashboard(cognosApi) {
  //   cognosApi.initialize().then(async () => {
  //     cognosApi.dashboard
  //       .openDashboard({
  //         dashboardSpec: await initializeExperiments(
  //           selectedAssistant.ENVIRONMENT_ID
  //             ? selectedAssistant.ENVIRONMENT_ID.replace(/-/g, "")
  //             : selectedAssistant.WORKSPACE_ID.replace(/-/g, ""),
  //           language
  //         ),
  //       })
  //       .then(async (dashboardAPI) => {
  //         dashboardAPI.setMode(dashboardAPI.MODES.VIEW);

  //         dashboardAPI.on(dashboardAPI.EVENTS.DIRTY, async () => {
  //           const dashSpec = await dashboardAPI.getSpec();
  //           console.log(dashSpec);
  //         });
  //       });
  //   });
  // }

  return (
    <Theme theme={lightMode ? "white" : "g100"}>
      <Header />
      <div className="content">
        {loading ? <Loading /> : ""}
        <div className="content">
          {selectedAssistant?.COGNOSURL ? (
            <iframe
              id="dash"
              src={iframeUrl}
              width="100%"
              height="90vh"
              frameBorder="0"
              gesture="media"
              allow="encrypted-media"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="no-assistant">
              {Language[language].conversationPerformance.text1}
            </div>
          )}
        </div>
        <div id="newExperimentButton">
          <Button
            id="runExperimentButton"
            onClick={async () => {
              setLoading(true);
              try {
                await runExperiment({
                  apiKey: selectedAssistant.ASSISTANTAPIKEY,
                  url: selectedAssistant.ASSISTANTURL,
                  workspaceId: selectedAssistant.WORKSPACE_ID,
                  schema: selectedAssistant.ENVIRONMENT_ID
                    ? selectedAssistant.ENVIRONMENT_ID.replace(/-/g, "")
                    : selectedAssistant.WORKSPACE_ID.replace(/-/g, ""),
                  assistantId: selectedAssistant.ASSISTANT_ID,
                });
              } catch (err) {
                console.log(err);
              }
              setLoading(false);
            }}
          >
            {Language[language].intentTrain.btn}
          </Button>
        </div>
      </div>
    </Theme>
  );
}
