import React, { useState, useEffect } from "react";
import { useGlobalState } from "../../hooks/globalState";
import CognosModal from "../CognosModal";
import Language from "../../helpers/languagesConfig";
import { UseFlowModal } from "../UseFlowModal";
import "./style.scss";

import {
  Header,
  HeaderGlobalAction,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderGlobalBar,
  Modal,
} from "@carbon/react";
import {
  Close,
  Menu,
  Add,
  Settings,
  Light,
  Asleep,
  Information,
} from "@carbon/icons-react";
import SideMenu from "../SideNav";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getRoute } from "../../helpers/misc";
import { ManualInputModal } from "../ManualInputModal";
import { updateCognosUrl } from "../../helpers/db2ApiCalls";

export default function HeaderIcc({ renderSave }) {
  const { language } = useParams();
  const {
    lightMode,
    setLightMode,
    languageIcons,
    selectedAssistant,
    setSelectedAssistant,
    assistants,
    setOpenSaveLoadModal,
    setOpenActionInputModal,
    setOpenManualInputModal,
    setAccountModalOpen,
    setPublicDashboardsModalOpen,
  } = useGlobalState();

  const location = useLocation();
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null); // null, 'info', 'cognos', 'useFlow'
  const [isSaving, setIsSaving] = useState(false);
  const [openSidePanel, setOpenSidePanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (assistants && !selectedAssistant) {
      setSelectedAssistant(assistants[0]);
    }
  }, [assistants, selectedAssistant, setSelectedAssistant]);

  const handleSaveCognosLink = async (assistantName, cognosLink) => {
    setIsSaving(true);

    const fullLink = `https://sa1.ca.analytics.ibm.com/bi/?perspective=dashboard&pathRef=${cognosLink}&closeWindowOnLastView=true&ui_appbar=false&ui_navbar=true&shareMode=embedded&action=view&mode=dashboard&subView=model0000017eb1760c6f_00000000`;

    try {
      const response = await updateCognosUrl(assistantName, fullLink);
      if (response.success) {
        console.log("Link atualizado com sucesso!");

        // Atualizar o selectedAssistant com o novo link
        setSelectedAssistant((prev) => ({
          ...prev,
          COGNOSURL: fullLink,
        }));
      } else {
        alert("Erro ao salvar o link. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao salvar o link do Cognos:", error);
    } finally {
      setIsSaving(false);
      setActiveModal(null); // Fechar modal
    }
  };

  return (
    <>
      <Header aria-label="Assistant Curator">
        {location.pathname.includes("login") ||
        location.pathname.includes("view") ? null : (
          <HeaderGlobalAction
            className="navMenu"
            onClick={() => setOpenSidePanel(!openSidePanel)}
          >
            {openSidePanel ? <Close /> : <Menu />}
          </HeaderGlobalAction>
        )}
        <HeaderName
          onClick={() => navigate(`/${language}/lobby`)}
          prefix="Innovation Studio"
          style={{ cursor: "pointer" }}
        >
          Assistant Curator
        </HeaderName>
        {location.pathname.includes("login") ||
        location.pathname.includes("view") ? null : (
          <>
            <HeaderGlobalBar>
              <HeaderNavigation aria-label="language-bar">
                <HeaderMenu
                  aria-label="assistants"
                  menuLinkName={
                    selectedAssistant?.SKILL_NAME ?? "Não há WA cadastrados"
                  }
                >
                  {assistants.length > 0 ? (
                    assistants.map((assistant, index) => (
                      <HeaderMenuItem
                        key={index}
                        onClick={() => setSelectedAssistant(assistant)}
                      >
                        {assistant.SKILL_NAME}
                      </HeaderMenuItem>
                    ))
                  ) : (
                    <HeaderMenuItem disabled>
                      {Language[language].header.assistant}
                    </HeaderMenuItem>
                  )}
                  <HeaderMenuItem
                    onClick={() => setActiveModal("cognos")}
                    style={{ fontWeight: "bold" }}
                  >
                    <Add /> {Language[language].header.linkModal}
                  </HeaderMenuItem>
                </HeaderMenu>
                <HeaderMenu
                  aria-label="language"
                  menuLinkName={languageIcons[language]}
                >
                  {Object.entries(languageIcons).map(([key, value], index) => (
                    <HeaderMenuItem
                      key={index}
                      onClick={() => {
                        navigate(getRoute(location.pathname, key));
                      }}
                    >
                      {value} {` ${key.toUpperCase()}`}
                    </HeaderMenuItem>
                  ))}
                </HeaderMenu>
                {(location.pathname.includes("lobby") ||
                  location.pathname.includes("first-steps")) && (
                  <HeaderGlobalAction
                    aria-label={Language[language].header.menuItem2}
                    onClick={() => {
                      setOpenManualInputModal(true);
                    }}
                  >
                    <Settings />
                  </HeaderGlobalAction>
                )}
              </HeaderNavigation>
              {renderSave && (
                <>
                  <HeaderGlobalAction
                    aria-label={Language[language].header.save}
                    onClick={() => {
                      setOpenSaveLoadModal(true);
                    }}
                  >
                    <Save />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction
                    aria-label={Language[language].header.share}
                    onClick={() => {
                      setPublicDashboardsModalOpen(true);
                    }}
                  >
                    <Share />
                  </HeaderGlobalAction>
                </>
              )}
              {location.pathname.includes("assistants") && (
                <HeaderGlobalAction
                  aria-label={Language[language].header.account}
                  onClick={() => {
                    setAccountModalOpen(true);
                  }}
                >
                  <UserIdentification />
                </HeaderGlobalAction>
              )}
              <HeaderGlobalAction
                aria-label={Language[language].header.theme}
                onClick={() => {
                  setLightMode(!lightMode);
                }}
              >
                {lightMode ? <Asleep /> : <Light />}
              </HeaderGlobalAction>
            </HeaderGlobalBar>
            <SideMenu open={openSidePanel} />
          </>
        )}
      </Header>
      {!(
        location.pathname.includes("login") ||
        location.pathname.includes("view")
      ) && (
        <div id="helpModalToggle" onClick={() => setActiveModal("useFlow")}>
          <Information size={30} color="white" />
          <UseFlowModal
            openModal={activeModal === "useFlow"}
            setOpenModal={(isOpen) => setActiveModal(isOpen ? "useFlow" : null)}
          />
        </div>
      )}

      <ManualInputModal />
      <CognosModal
        isOpen={activeModal === "cognos"}
        onClose={() => setActiveModal(null)}
        assistants={assistants}
        onSave={handleSaveCognosLink}
        isSaving={isSaving}
      />
      <Modal
        open={activeModal === "info"}
        onRequestClose={() => setActiveModal(null)}
      ></Modal>
    </>
  );
}
