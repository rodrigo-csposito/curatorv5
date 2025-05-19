import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Modal, TextInput, Dropdown } from "@carbon/react";
import Language from "../../helpers/languagesConfig";
import { useParams } from "react-router-dom";

export default function CognosLinkModal({
  isOpen,
  onClose,
  assistants,
  onSave,
  isSaving,
}) {
  const [selectedAssistant, setSelectedAssistant] = useState("");
  const [cognosLink, setCognosLink] = useState("");
  const { language } = useParams();

  const handleSave = () => {
    if (selectedAssistant && cognosLink) {
      onSave(selectedAssistant, cognosLink); // Passar o assistente e o link
      onClose(); // Fechar o modal após salvar
    } else {
      alert("Selecione um assistente e insira o link do Cognos.");
    }
  };

  return (
    <>
      {isOpen &&
        ReactDOM.createPortal(
          <Modal
            open={isOpen}
            modalHeading={Language[language].CognosLinkModal.text1}
            primaryButtonText={isSaving ? "Salvando..." : "Salvar"}
            secondaryButtonText="Cancelar"
            onRequestClose={onClose}
            onRequestSubmit={handleSave}
            primaryButtonDisabled={
              !selectedAssistant || !cognosLink || isSaving
            }
          >
            <Dropdown
              id="assistant-dropdown"
              titleText={Language[language].CognosLinkModal.title}
              label={Language[language].CognosLinkModal.text2}
              items={assistants.map((assistant) => assistant.SKILL_NAME)}
              selectedItem={selectedAssistant}
              onChange={({ selectedItem }) =>
                setSelectedAssistant(selectedItem)
              }
              required
            />
            <TextInput
              id="cognos-link"
              labelText={Language[language].CognosLinkModal.labelText}
              placeholder={Language[language].CognosLinkModal.placeholder}
              value={cognosLink}
              onChange={(e) => setCognosLink(e.target.value)}
              required
              style={{ marginTop: "1rem" }}
            />
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
              {Language[language].CognosLinkModal.text}
            </p>
          </Modal>,
          document.getElementById("modal-root") || document.body
        )}
    </>
  );
}
