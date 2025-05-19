import React from "react";
import { Theme } from "@carbon/react";
import { useGlobalState } from "../../hooks/globalState";
import Header from "../../components/Header";
import { getAssistants } from "../../helpers/db2ApiCalls";
import { runExperiment } from "../../helpers/cloudFunctionsApiCalls";
import { Button, Loading } from "@carbon/react";
import Language from "../../helpers/languagesConfig";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "./style.scss";

export default function CognosPage() {
  const {
    lightMode,
    selectedAssistant,
    setSelectedAssistant,
    loading,
    setLoading,
  } = useGlobalState();
  const { language } = useParams();
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    if (!selectedAssistant) {
      console.warn("selectedAssistant não está definido.");
      return;
    }
    const { COGNOSURL, ASSISTANTAPIKEY, WORKSPACE_ID } = selectedAssistant;
    if (!COGNOSURL || !ASSISTANTAPIKEY || !WORKSPACE_ID) {
      console.error("Propriedades obrigatórias do selectedAssistant ausentes.");
      return;
    }
    console.log(selectedAssistant);
    setIframeUrl(COGNOSURL); // Atualiza a URL do iframe
  }, [selectedAssistant]);

  return (
    <Theme theme={lightMode ? "white" : "g100"}>
      <Header />
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
        <div id="newExperimentButton">
          <Button
            id="runExperimentButton"
            disabled={loading}
            onClick={async () => {
              if (!selectedAssistant) {
                console.error("Nenhum assistente selecionado");
                return;
              }
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
                console.error(err);
              } finally {
                console.log(loading);
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <Loading small description="Carregando..." />
            ) : (
              Language[language].intentTrain.btn
            )}
          </Button>
        </div>
      </div>
    </Theme>
  );
}
