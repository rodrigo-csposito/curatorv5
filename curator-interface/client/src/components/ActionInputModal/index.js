import {
  ComposedModal,
  ModalHeader,
  ModalFooter,
  Button,
  ModalBody,
  TextInput,
  Grid,
  Column,
  FileUploader,
  MultiSelect,
} from "@carbon/react";
import { FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { getAssistants } from "../../helpers/resourcesApiCalls";
import { useGlobalState } from "../../hooks/globalState";
import Language from "../../helpers/languagesConfig";
import { useParams } from "react-router-dom";

export function ActionInputModal({
  resourceData,
  setResourceData,
  disableAllInputs,
  setDisableInput,
  setResponseAssistants,
  setAssistantDetails,
  setShowNotification,
  setNotificationContent,
  skillJson,
  setSkillJson,
}) {
  const { openActionInputModal, setOpenActionInputModal, setLoading } =
    useGlobalState();

  const { language } = useParams();

  function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
  }

  function handleFileLoad(event) {
    try {
      setSkillJson(JSON.parse(event.target.result));
    } catch (err) {
      clearMultiSelects();
      setSkillJson(null);
      setDisableInput(false);
      setOpenActionInputModal(false);
      setNotificationContent({
        title: Language[language].inputModal.notifyTitle,
        text: Language[language].inputModal.notifyTxt,
        kind: "error",
      });
      setShowNotification(true);
    }
  }

  function clearMultiSelects() {
    const multiselectElements = document.getElementsByClassName(
      "cds--tag__close-icon"
    );
    for (let element of multiselectElements) {
      element.click();
    }
    const fileElement = document.getElementsByClassName("cds--file-close");
    for (let element of fileElement) {
      element.click();
    }
  }

  useEffect(() => {
    const tmp = { ...resourceData };
    if (!skillJson) {
      tmp.workspace_id = null;
      tmp.assistant_id = null;
      tmp.environment_id = undefined;
      tmp.actions = null;
      tmp.skill_name = null;
      tmp.assistantMetadata = {
        transferNode: [],
        feedbackNode: [],
        relevantTopics: [],
        finalNode: [],
      };
    } else if (
      !skillJson.name ||
      !skillJson.workspace_id ||
      !skillJson.assistant_id ||
      !skillJson.workspace?.actions
    ) {
      clearMultiSelects();
      setSkillJson(null);
      setDisableInput(false);
      setOpenActionInputModal(false);
      setNotificationContent({
        title: Language[language].inputModal.notifyTitle,
        text: Language[language].inputModal.notifyTxt,
        kind: "error",
      });
      setShowNotification(true);
    } else {
      tmp.skill_name = skillJson.name;
      tmp.workspace_id = skillJson.workspace_id;
      tmp.assistant_id = skillJson.assistant_id;
      tmp.actions = true;
      setResponseAssistants(null);
      setAssistantDetails(null);
    }

    setResourceData(tmp);
  }, [skillJson]);

  return (
    <>
      <ComposedModal
        size="lg"
        open={openActionInputModal}
        onRequestClose={() => {
          setOpenActionInputModal(false);
        }}
        onClose={() => {
          setOpenActionInputModal(false);
        }}
        preventCloseOnClickOutside={true}
        hasScrollingContent
      >
        <ModalHeader label={Language[language].inputModal.headerLbl}>
          <p style={{ textAlign: "justify" }}>
            {Language[language].inputmodal.header}
          </p>
        </ModalHeader>
        <ModalBody>
          <Grid>
            {/*File Uploader*/}
            <Column
              className="selectColumnResource"
              sm={4}
              md={8}
              lg={16}
              xlg={16}
            >
              <FileUploader
                disabled={disableAllInputs}
                accept={[".json"]}
                buttonLabel={Language[language].inputModal.fileBtn}
                filenameStatus="edit"
                iconDescription={Language[language].inputModal.fileIcon}
                labelDescription={Language[language].inputModal.fileLbl}
                labelTitle={Language[language].inputModal.fileTitle}
                name=""
                onChange={(e) => {
                  clearMultiSelects();
                  handleFileSelect(e);
                  setDisableInput(true);
                }}
                onDelete={async () => {
                  clearMultiSelects();
                  setSkillJson(null);
                  setDisableInput(false);
                  setOpenActionInputModal(false);
                  setLoading(true);
                  if (resourceData.assistant)
                    setResponseAssistants(
                      await getAssistants(resourceData.assistant)
                    );
                  setLoading(false);
                }}
                size="lg"
              />
            </Column>
            {/*Skill Name*/}
            <Column
              className="selectColumnResource"
              sm={4}
              md={8}
              lg={16}
              xlg={16}
            >
              <TextInput
                labelText={Language[language].inputModal.labelTxt}
                value={
                  disableAllInputs
                    ? "Using Manual Input"
                    : skillJson?.name ?? Language[language].inputModal.fileBtn
                }
                disabled
              />
            </Column>
            {/*Environment ID*/}
            <Column
              className="selectColumnResource"
              sm={4}
              md={8}
              lg={16}
              xlg={16}
            >
              <TextInput
                disabled={disableAllInputs}
                labelText="Environment ID"
                value={
                  disableAllInputs
                    ? "Using Manual Input"
                    : resourceData.environment_id ?? ""
                }
                onChange={(e) => {
                  const tmp = { ...resourceData };
                  if (e.target.value) {
                    tmp.environment_id = e.target.value;
                  } else {
                    tmp.environment_id = undefined;
                  }
                  setResourceData(tmp);
                }}
              />
            </Column>
            {/*Assistant Transfer Nodes*/}
            <Column
              className="selectColumnResource"
              sm={4}
              md={8}
              lg={16}
              xlg={16}
            >
              <MultiSelect
                disabled={disableAllInputs}
                className="multiselect"
                titleText={Language[language].inputModal.titleTxt1}
                onChange={(e) => {
                  const tmp = { ...resourceData };
                  tmp.assistantMetadata.transferNode = [...e.selectedItems];
                  setResourceData(tmp);
                }}
                itemToString={(item) => (item ? item : "")}
                items={
                  skillJson?.workspace?.actions
                    ? skillJson?.workspace?.actions.map(
                        (action) => action.title
                      )
                    : []
                }
                label={
                  disableAllInputs
                    ? "Using Manual Input"
                    : skillJson
                    ? resourceData?.assistantMetadata.transferNode.length > 0
                      ? resourceData?.assistantMetadata.transferNode.join("; ")
                      : Language[language].inputModal.label1
                    : Language[language].inputModal.label2
                }
                size="md"
              />
            </Column>
            {/*Assistant Feedback Nodes*/}
            <Column
              className="selectColumnResource"
              sm={4}
              md={8}
              lg={16}
              xlg={16}
            >
              <MultiSelect
                disabled={disableAllInputs}
                className="multiselect"
                titleText={Language[language].inputModal.titleTxt2}
                onChange={(e) => {
                  const tmp = { ...resourceData };
                  tmp.assistantMetadata.feedbackNode = [...e.selectedItems];
                  setResourceData(tmp);
                }}
                itemToString={(item) => (item ? item : "")}
                items={
                  skillJson?.workspace?.actions
                    ? skillJson?.workspace?.actions.map(
                        (action) => action.title
                      )
                    : []
                }
                label={
                  disableAllInputs
                    ? "Using Manual Input"
                    : skillJson
                    ? resourceData?.assistantMetadata.feedbackNode.length > 0
                      ? resourceData?.assistantMetadata.feedbackNode.join("; ")
                      : Language[language].inputModal.label1
                    : Language[language].inputModal.label2
                }
                size="md"
              />
            </Column>
            {/*Assistant Final Node*/}
            <Column
              className="selectColumnResource"
              sm={4}
              md={8}
              lg={16}
              xlg={16}
            >
              <MultiSelect
                disabled={disableAllInputs}
                className="multiselect"
                titleText={Language[language].inputmodal.titleTxt3}
                onChange={(e) => {
                  const tmp = { ...resourceData };
                  tmp.assistantMetadata.finalNode = [...e.selectedItems];
                  setResourceData(tmp);
                }}
                itemToString={(item) => (item ? item : "")}
                items={
                  skillJson?.workspace?.actions
                    ? skillJson?.workspace?.actions.map(
                        (action) => action.title
                      )
                    : []
                }
                label={
                  disableAllInputs
                    ? "Using Manual Input"
                    : skillJson
                    ? resourceData?.assistantMetadata.finalNode.length > 0
                      ? resourceData?.assistantMetadata.finalNode.join("; ")
                      : Language[language].inputModal.label1
                    : Language[language].inputModal.label2
                }
                size="md"
              />
            </Column>
            {/*Assistant Relevant Topics*/}
            <Column
              className="selectColumnResource"
              sm={4}
              md={8}
              lg={16}
              xlg={16}
            >
              <MultiSelect
                disabled={disableAllInputs}
                className="multiselect"
                titleText={Language[language].inputmodal.titleTxt4}
                onChange={(e) => {
                  const tmp = { ...resourceData };
                  tmp.assistantMetadata.relevantTopics = [...e.selectedItems];
                  setResourceData(tmp);
                }}
                itemToString={(item) => (item ? item : "")}
                items={
                  skillJson?.workspace?.actions
                    ? skillJson?.workspace?.actions.map(
                        (action) => action.title
                      )
                    : []
                }
                label={
                  disableAllInputs
                    ? "Using Manual Input"
                    : skillJson
                    ? resourceData?.assistantMetadata.relevantTopics.length > 0
                      ? resourceData?.assistantMetadata.relevantTopics.join(
                          "; "
                        )
                      : Language[language].inputModal.label1
                    : Language[language].inputModal.label2
                }
                size="md"
              />
            </Column>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={disableAllInputs}
            kind="secondary"
            onClick={async () => {
              clearMultiSelects();
              setSkillJson(null);
              setDisableInput(false);
              setOpenActionInputModal(false);
              setLoading(true);

              if (resourceData.assistant)
                setResponseAssistants(
                  await getAssistants(resourceData.assistant)
                );
              setLoading(false);
            }}
          >
            {Language[language].inputModal.cancelBtn}
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              setOpenActionInputModal(false);
            }}
          >
            {Language[language].inputModal.continueBtn}
          </Button>
        </ModalFooter>
      </ComposedModal>
    </>
  );
}
