import { useEffect, useState } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Grid,
  Column,
  CodeSnippet,
} from "@carbon/react";

import { useGlobalState } from "../../hooks/globalState";
import Language from "../../helpers/languagesConfig";
import { useParams } from "react-router-dom";

import "./style.css";

export function ManualInputModal({}) {
  const { language } = useParams();
  const { openManualInputModal, setOpenManualInputModal } = useGlobalState();

  return (
    <ComposedModal
      size="lg"
      open={openManualInputModal}
      onRequestClose={() => {
        setOpenManualInputModal(false);
      }}
      onClose={() => {
        setOpenManualInputModal(false);
      }}
      preventCloseOnClickOutside={true}
      hasScrollingContent
    >
      <ModalHeader label={Language[language].manualInputModal.header}>
        <p style={{ textAlign: "justify" }}>
          {Language[language].manualInputModal.headerTxt}
        </p>
      </ModalHeader>
      <ModalBody
        style={{
          display: "flex",
          padding: "1rem",
          paddingLeft: "1rem",
          paddingRight: "4rem",
          alignItems: "center",
          justifyContent: "left",
          paddingBottom: "1rem",
          margin: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
            width: "100%",
            height: "100%",
          }}
        >
          <CodeSnippet
            style={{ windth: "100%", maxWidth: "100%" }}
            type="single"
            feedback="Copied!"
          >
            {`https://${window.location.hostname}/codeEngineFunction/log`}
          </CodeSnippet>
          <ol>
            <li>
              <strong>v1: </strong>
              <a
                href="https://cloud.ibm.com/docs/assistant?topic=assistant-webhook-log"
                target="_blank"
              >
                https://cloud.ibm.com/docs/assistant?topic=assistant-webhook-log
              </a>
            </li>
            <li>
              <strong>v2: </strong>
              <a
                href="https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-webhook-log"
                target="_blank"
              >
                https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-webhook-log
              </a>
            </li>
          </ol>
        </div>
      </ModalBody>
    </ComposedModal>
  );
}
