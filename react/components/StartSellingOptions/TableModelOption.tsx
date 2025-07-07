import React, { Component } from "react";
import type { ClientData } from "../../typings/types";
import { Button } from "vtex.styleguide";
import * as XLSX from "xlsx";
import { createOrderFormWithItems, getItemsBySku, setImpersonateCustomer } from "../../services/clientServices";

type Props = {
  clientData: ClientData;
};

type State = {
  isCreating: boolean;
  uploadedFile: File | null;
  fileName: string;
  error: boolean
};

export default class TableModelOption extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isCreating: false,
      uploadedFile: null,
      fileName: "",
      error: false
    };
  }

  private handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      this.setState({
        uploadedFile: file,
        fileName: file.name,
        error: true
      });
    }
  };

  private parseXlsxFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler o arquivo"));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  private handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!this.state.uploadedFile) {
      return;
    }

    this.setState({ isCreating: true });

    try {
      const parsedData = await this.parseXlsxFile(this.state.uploadedFile);

      const { items } = await getItemsBySku(parsedData)

      if(!items) {
        this.setState({
          error: true
        })
        return
      }

      const { orderFormId } = await createOrderFormWithItems(this.props.clientData, items)

      if(!orderFormId) {
        this.setState({
          error: true
        })
        return
      }

      await setImpersonateCustomer(this.props.clientData.email)

      window.open(`/?orderFormId=${orderFormId}&sc=2`, 'siteWindow');
    } catch (err) {
      this.setState({
        error: true
      })
      console.error("Erro ao processar arquivo:", err);
    } finally {
      this.setState({ isCreating: false });
    }
  };

  private handleReset = () => {
    this.setState({
      uploadedFile: null,
      fileName: "",
      isCreating: false,
    });

    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  render() {
    const { isCreating, fileName, uploadedFile, error } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        className="w-33 pa6 flex flex-column justify-center items-center bl b--light-gray"
      >
        <h3 className="mt0">Modelo Tabela</h3>

        <div className="w-100 mb4">
          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={this.handleFileChange}
            disabled={isCreating}
            className="w-100 pa2 ba b--light-gray br2"
            required
          />
        </div>

        {fileName && (
          <div className="mb4 pa3 ba b--light-green bg-light-green br2 w-100">
            <span className="f6 c-success">
              ✓ Arquivo selecionado: <strong>{fileName}</strong>
            </span>
          </div>
        )}

        <div className="flex gap3 justify-between w-100">
          <div className={!uploadedFile ? "w-100" : ""}>
            <Button
              children={isCreating ? "Processando..." : "Iniciar"}
              variation={!uploadedFile ? "secondary" : "primary"}
              size={!uploadedFile ? "default" : "small"}
              type="submit"
              disabled={isCreating || !uploadedFile || error}
              className="flex-auto pa3 ba br2 bg-blue white fw6 pointer hover-bg-dark-blue disabled-o-50"
              block
            />
          </div>
          {uploadedFile && (
            <Button
              children="Limpar"
              size="small"
              type="button"
              variation="secondary"
              onClick={this.handleReset}
              disabled={isCreating}
              className="pa3 ba br2 bg-light-gray dark-gray fw6 pointer hover-bg-gray disabled-o-50"
            />
          )}
        </div>

        {isCreating && (
          <div className="mt3 tc">
            <div className="loading-spinner"></div>
            <p className="f6 c-muted-2">Processando arquivo...</p>
          </div>
        )}

        {error && (
          <div className="w-100 t-small pa3 br2 bg-danger--faded active-bg-danger-faded c-danger active-c-danger dib mt3 ba b--danger active-b-danger">
            Erro ao processar arquivo *
          </div>
        )}
      </form>
    );
  }
}