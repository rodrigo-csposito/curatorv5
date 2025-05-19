import {
  ComposedModal,
  ModalHeader,
  ModalFooter,
  Button,
  ModalBody,
  TextInput,
} from "@carbon/react";
import { useState } from "react";
import {
  getFromCloudant,
  sendToCloudant,
} from "../../helpers/cloudantApiCalls";
import { useGlobalState } from "../../hooks/globalState";
import Language from "../../helpers/languagesConfig";
import { useParams } from "react-router-dom";

export function SaveLoadModal({
  setLoadedDashboard,
  currentDashboard,
  setShowNotification,
  setNotificationContent,
}) {
  const { language } = useParams();
  const {
    dbName,
    setDbName,
    selectedAssistant,
    openSaveLoadModal,
    setOpenSaveLoadModal,
  } = useGlobalState();

  return (
    <>
      <ComposedModal
        open={openSaveLoadModal}
        onRequestClose={() => {
          setOpenSaveLoadModal(false);
        }}
        onClose={() => {
          setOpenSaveLoadModal(false);
        }}
        preventCloseOnClickOutside={true}
      >
        <ModalHeader label={Language[language].saveLoadModal.modalHeaderLbl}>
          <p>{Language[language].saveLoadModal.modalHeader}</p>
        </ModalHeader>
        <ModalBody>
          <TextInput
            onChange={(e) => {
              setDbName(e.target.value.toLowerCase());
            }}
            labelText={Language[language].saveLoadModal.txtLbl}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            kind="secondary"
            onClick={async () => {
              const dashboard = await getFromCloudant(dbName);
              if (dashboard) {
                setLoadedDashboard(dashboard);
                setNotificationContent({
                  title: Language[language].saveLoadModal.searchBtnTitle,
                  text: Language[language].saveLoadModal.searchBtnTxt,
                  kind: "info",
                });
                setShowNotification(true);
              } else {
                setDbName(null);
                setLoadedDashboard(null);
                setNotificationContent({
                  title: Language[language].saveLoadModal.searchBtnTitle2,
                  text: Language[language].saveLoadModal.searchBtnTxt2,
                  kind: "error",
                });
                setShowNotification(true);
              }
              setOpenSaveLoadModal(false);
            }}
          >
            {Language[language].saveLoadModal.searchBtn}
          </Button>
          <Button
            kind="primary"
            onClick={async () => {
              const insertionResult = await sendToCloudant(
                dbName,
                currentDashboard
              );
              if (!insertionResult) {
                setDbName(null);
                setNotificationContent({
                  title: Language[language].saveLoadModal.searchBtnTitle2,
                  text: Language[language].saveLoadModal.saveBtnTxt,
                  kind: "error",
                });
                setShowNotification(true);
              }
              setOpenSaveLoadModal(false);
            }}
          >
            {Language[language].saveLoadModal.saveBtn}
          </Button>
        </ModalFooter>
      </ComposedModal>
    </>
  );
}
