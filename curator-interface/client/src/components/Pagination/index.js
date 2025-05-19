import { Pagination } from "@carbon/react";
import { useGlobalState } from "../../hooks/globalState";
import Language from "../../helpers/languagesConfig";
import { useParams } from "react-router-dom";

export function PaginationFooter() {
  const { language } = useParams();
  const {
    logs,
    setLogs,
    itensPerPage,
    setItensPerPage,
    currentPage,
    setCurrentPage,
  } = useGlobalState();

  return (
    <Pagination
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 8001,
      }}
      backwardText={Language[language].pagination.backwardTxt}
      size="lg"
      forwardText={Language[language].pagination.forwardTxt}
      itemsPerPageText={Language[language].pagination.pageTxt}
      onChange={(data) => {
        setCurrentPage(data.page);
      }}
      page={currentPage}
      pageSize={itensPerPage}
      pageSizes={[itensPerPage]}
      totalItems={logs ? Object.keys(logs).length : 0}
    />
  );
}
