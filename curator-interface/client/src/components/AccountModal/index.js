import React, { useState, useEffect } from "react";
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
  Select,
  SelectItem,
} from "@carbon/react";

import "./style.scss";
import { useGlobalState } from "../../hooks/globalState";
import Language from "../../helpers/languagesConfig";
import {
  listAccounts,
  queryAllResources,
} from "../../helpers/resourcesApiCalls";
import { useParams } from "react-router-dom";

export function AccountModal() {
  const { language } = useParams();
  const {
    accountModalOpen,
    setAccountModalOpen,
    accounts,
    setAccounts,
    account,
    setAccount,
    setResources,
    setLoading,
  } = useGlobalState();

  useEffect(() => {
    saveAccountsToState();
  }, []);

  async function saveAccountsToState() {
    setLoading(true);
    const accounts = await listAccounts();
    setAccounts(accounts);
    setAccount(JSON.stringify(accounts[0]));
    setLoading(false);
  }

  async function getResources() {
    setLoading(true);
    const response = await queryAllResources(account);
    setResources(response);
    setLoading(false);
  }

  return (
    <ComposedModal
      size="lg"
      open={accountModalOpen}
      onRequestClose={() => {
        setAccountModalOpen(false);
      }}
      onClose={() => {
        setAccountModalOpen(false);
      }}
      preventCloseOnClickOutside={true}
    >
      <ModalHeader label={Language[language].accountModal.headerLbl}>
        <p style={{ textAlign: "justify" }}>
          {Language[language].accountModal.header}
        </p>
      </ModalHeader>
      <ModalBody>
        <Select
          labelText={Language[language].accountModal.body}
          onChange={async (e) => {
            const value = e.target.value;
            setAccount(value);
          }}
        >
          {accounts?.map((account, index) => (
            <SelectItem
              key={`account-${index}`}
              text={account.entity.name}
              value={JSON.stringify(account)}
            />
          ))}
        </Select>
      </ModalBody>
      <ModalFooter>
        <Button
          kind="primary"
          disabled={!account}
          onClick={async () => {
            setAccountModalOpen(false);
            await getResources();
          }}
        >
          {Language[language].accountModal.selectBtn}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
}
