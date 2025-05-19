import { useState } from "react";

import {
  DataTable,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch,
  Button,
  TableSelectAll,
  TableSelectRow,
} from "@carbon/react";

import { TrashCan, Save, Download } from "@carbon/icons-react";

import "./style.scss";
import { useGlobalState } from "../../hooks/globalState";
import Language from "../../helpers/languagesConfig";
import { sendScore } from "../../helpers/db2ApiCalls";
import { useParams } from "react-router-dom";

export default function DefaultTable({ rowData }) {
  const { language } = useParams();
  const { logs, setLogs, selectedAssistant } = useGlobalState();

  const headerData = [
    {
      header: Language[language].table.header1,
      key: "logId",
    },
    {
      header: Language[language].table.header2,
      key: "clientMessage",
    },
    {
      header: Language[language].table.header3,
      key: "assistantMessage",
    },
    {
      header: Language[language].table.header4,
      key: "intent",
    },
    {
      header: Language[language].table.header5,
      key: "score",
    },
  ];

  return (
    <DataTable
      useStaticWidth
      rows={rowData ?? []}
      headers={headerData}
      useZebraStyles={true}
    >
      {({
        rows,
        headers,
        getHeaderProps,
        onInputChange,
        getRowProps,
        getBatchActionProps,
        getSelectionProps,
      }) => (
        <TableContainer title="">
          <TableToolbar>
            <TableToolbarContent>
              <Button
                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                onClick={async () => {
                  setLogs(
                    await sendScore(
                      logs,
                      selectedAssistant.ENVIRONMENT_ID
                        ? selectedAssistant.ENVIRONMENT_ID.replace(/-/g, "")
                        : selectedAssistant.WORKSPACE_ID.replace(/-/g, "")
                    )
                  );
                }}
                size="sm"
                kind="primary"
              >
                {Language[language].table.sendBtn}
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
}
