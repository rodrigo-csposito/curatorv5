import {
  ComposedModal,
  ModalHeader,
  ModalFooter,
  Button,
  ModalBody,
  ProgressStep,
  ProgressIndicator,
} from "@carbon/react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import step1 from "./imgs/step1.png";
import step2 from "./imgs/step2.png";
import step3 from "./imgs/step3.png";
import step4 from "./imgs/step4.png";
import step5 from "./imgs/step5.png";

import "./style.scss";
import Language from "../../helpers/languagesConfig";

export function UseFlowModal({ openModal, setOpenModal }) {
  const [currentPage, setCurrentPage] = useState(0);
  const { language } = useParams();
  const pages = [
    {
      img: step1,
      text: Language[language].useFlowModal.imgTxt1,
    },
    {
      img: step2,
      text: Language[language].useFlowModal.imgTxt2,
    },
    {
      img: step3,
      text: Language[language].useFlowModal.imgTxt3,
    },
    {
      img: step4,
      text: Language[language].useFlowModal.imgTxt4,
    },
    {
      img: step5,
      text: Language[language].useFlowModal.imgTxt5,
    },
  ];
  return (
    <ComposedModal
      size="lg"
      open={openModal}
      onRequestClose={() => {
        setOpenModal(false);
      }}
      onClose={() => {
        setOpenModal(false);
      }}
    >
      <ModalHeader
        label={Language[language].useFlowModal.modalHeaderLbl}
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "16px",
        }}
      >
        <ProgressIndicator
          currentIndex={currentPage}
          style={{
            width: "100%",
            margin: "1rem",
            display: "flex",
            justifyContent: "center",
            overflow: "scroll",
          }}
        >
          <ProgressStep
            current={currentPage == 0}
            complete={currentPage > 0}
            label="Conversation Performance"
          />
          <ProgressStep
            current={currentPage == 1}
            complete={currentPage > 1}
            label="Access WA"
          />
          <ProgressStep
            current={currentPage == 2}
            complete={currentPage > 2}
            label="Edit intents"
          />
          <ProgressStep
            current={currentPage == 3}
            complete={currentPage > 3}
            label="Intent Search"
          />
          <ProgressStep
            current={currentPage == 4}
            complete={currentPage == 4}
            label="Performance"
            description={Language[language].useFlowModal.progressDescription}
          />
        </ProgressIndicator>
      </ModalHeader>
      <ModalBody id="modalBody">
        <div
          style={{
            height: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              minHeight: "20%",
              width: "100%",
              objectFit: "cover",
              paddingRight: "2rem",
              paddingLeft: "2rem",
            }}
          >
            {pages[currentPage].text}
          </p>
          <img
            src={pages[currentPage].img}
            style={{
              width: "100%",
              height: "80%",
              overflow: "scroll",
              objectFit: "contain",
              paddingTop: "-10px",
            }}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={currentPage == 0}
          kind="secondary"
          onClick={async () => {
            setCurrentPage(currentPage - 1);
          }}
        >
          {Language[language].useFlowModal.previousBtn}
        </Button>
        <Button
          disabled={currentPage == pages.length - 1}
          kind="primary"
          onClick={async () => {
            setCurrentPage(currentPage + 1);
          }}
        >
          {Language[language].useFlowModal.nextBtn}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
}
