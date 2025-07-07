import React, { Component } from "react"
import type { ClientAddressData, ClientData } from "../../typings/types"
import { Button, Checkbox } from "vtex.styleguide"
import CorporateInputs from "./CorporateInputs"
import ClientInputs from "./ClientInputs"
import AddressInputs from "./AddressInputs"
import { maskCNPJ, maskCPF } from "../../masks"

type Props = {
  isNewClient?: boolean
  clientData: ClientData
  isDataValid: boolean | null
  hasAddressError: boolean
  onVerifyData: (formData: ClientData) => Promise<void>
}

type State = {
  formData: ClientData
  isValidating: boolean
  showCorporateFields: boolean
}

export default class ClientDataForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      formData: { ...props.clientData },
      isValidating: false,
      showCorporateFields: props.clientData.isCorporate || false,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.clientData !== this.props.clientData) {
      this.setState({
        formData: { ...this.props.clientData },
        showCorporateFields: this.props.clientData.isCorporate || false,
      })
    }
  }

  private handleChange = (field: keyof ClientData, value: string) => {
    if (field === "document") {
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          [field]: maskCPF(value),
        },
      }))
      return
    }

    if (field === "corporateDocument") {
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          [field]: maskCNPJ(value),
        },
      }))
      return
    }

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
    }))
  }

  private handleAddressChange = (field: keyof ClientAddressData, value: string) => {
    this.setState((prevState) => {
      const currentAddresses = prevState.formData.availableAddresses || [{}]
      const currentAddress = currentAddresses[0] || {}
      currentAddress.country = 'BRA'
      currentAddress.addressType = 'residential'
      currentAddress.addressName = 'Principal'
      currentAddress.isNewAddress = true

      return {
        formData: {
          ...prevState.formData,
          availableAddresses: [
            {
              ...currentAddress,
              [field]: value,
            },
          ],
        },
      }
    })
  }

  private handleCorporateToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    this.setState((prevState) => ({
      showCorporateFields: checked,
      formData: {
        ...prevState.formData,
        isCorporate: checked,
        documentType: checked ? 'cnpj' : 'cpf',
        ...(checked
          ? {}
          : {
              corporateDocument: "",
              corporateName: "",
              stateRegistration: "",
              corporatePhone: "",
            }),
      },
    }))
  }

  private handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    this.setState({ isValidating: true })

    try {
      const formToValidate = {...this.state.formData, isNewClient: this.props.isNewClient}
      await this.props.onVerifyData(formToValidate)
    } catch (error) {
      console.error("Erro ao verificar dados:", error)
    } finally {
      this.setState({ isValidating: false })
    }
  }

  render() {
    const { formData, isValidating, showCorporateFields } = this.state
    const { clientData, hasAddressError, isNewClient, isDataValid } = this.props
    const isCheckboxDisabled = clientData.isCorporate

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="flex flex-wrap">
          <h3 className="mt0">Dados Pessoa Física</h3>
          <ClientInputs formData={formData} handleChange={this.handleChange} isNewClient={isNewClient} />

          <div className="w-100 mv4">
            <Checkbox
              checked={showCorporateFields}
              disabled={isCheckboxDisabled}
              id="corporate-toggle"
              label="Adicionar dados de Pessoa Jurídica"
              name="corporate-toggle"
              onChange={this.handleCorporateToggle}
            />
          </div>

          {showCorporateFields && (
            <>
              <h3>Dados Pessoa Jurídica</h3>
              <CorporateInputs formData={formData} handleChange={this.handleChange} handleAddressChange={this.handleAddressChange} />
            </>
          )}

          {hasAddressError && (
            <>
              <h3>Endereço</h3>
              <AddressInputs formData={formData} handleAddressChange={this.handleAddressChange} />
            </>
          )}

          { !isDataValid && (
            <div className="w-100 flex justify-end">
              <Button type="submit" children={"Verificar Dados"} isLoading={isValidating} variation="secondary" />
            </div>
          )}
        </div>
      </form>
    )
  }
}
