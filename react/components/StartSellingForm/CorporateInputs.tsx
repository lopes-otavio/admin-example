import React, { Component } from 'react'
import { ClientAddressData, ClientData } from '../../typings/types'
import { Input, EXPERIMENTAL_Select } from "vtex.styleguide"
import { maskCNPJ } from '../../masks'
import { getJuridicPersonDataByCnpj } from '../../services/clientServices'

type Props = {
  formData: ClientData
  handleChange: (field: keyof ClientData, value: string) => void
  handleAddressChange: (field: keyof ClientAddressData, value: string) => void
}

type State = {
  isLoadingCnpj: boolean
  isMultipleRegistrations: boolean
  registrationOptions: {label: string, value: string}[]
}

export default class CorporateInputs extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isLoadingCnpj: false,
      isMultipleRegistrations: false,
      registrationOptions: []
    }
  }

  private handleCnpjBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cnpj = e.target.value.replace(/\D/g, "")

    if (cnpj.length !== 14) {
      return
    }

    this.setState({ isLoadingCnpj: true })

    try {

      const { corporateData } = await getJuridicPersonDataByCnpj(cnpj)
      const { address } = corporateData || {}

      if(corporateData) {
        const { handleChange, handleAddressChange } = this.props

        if(corporateData.corporateName) {
          handleChange('corporateName', corporateData.corporateName)
        }

        if(corporateData.stateRegistration) {

          if(Array.isArray(corporateData.stateRegistration)) {
            const formatedOptions = corporateData.stateRegistration.map((item: any) => {
              return {
                label: `${item.state} - ${item.number}`,
                value: item.number
              }
            })

            this.setState({
              isMultipleRegistrations: true,
              registrationOptions: [...formatedOptions]
            })
            return
          }

          handleChange('stateRegistration', corporateData.stateRegistration)
        }

        if(address) {
          if(address.state) {
            handleAddressChange('state', address.state)
          }
          if(address.city) {
            handleAddressChange('city', address.city)
          }
          if(address.postalCode) {
            handleAddressChange('postalCode', address.postalCode)
          }
          if(address.neighborhood) {
            handleAddressChange('neighborhood', address.neighborhood)
          }
          if(address.street) {
            handleAddressChange('street', address.street)
          }
          if(address.number) {
            handleAddressChange('number', address.number)
          }
          if(address.receiverName) {
            handleAddressChange('receiverName', address.receiverName)
          }
        }
      }

    } catch (error) {
      console.error("Erro ao buscar dados do CNPJ:", error)
    } finally {
      this.setState({ isLoadingCnpj: false })
    }
  }

  render() {
    const { isLoadingCnpj, isMultipleRegistrations, registrationOptions } = this.state
    const { formData, handleChange } = this.props

    return (
    <>
      <div className="w-100 mb4">
        <Input
          label="Razão Social *"
          value={formData.corporateName || ""}
          disabled
          placeholder="Não informado" />
      </div>
      <div className="w-50 pr3 mb4">
        <Input
          label="CNPJ *"
          value={maskCNPJ(formData.corporateDocument!) || ""}
          placeholder="Não informado"
          onChange={(e: any) => handleChange("corporateDocument", e.target.value)}
          onBlur={this.handleCnpjBlur}
          disabled={isLoadingCnpj}
          suffix={isLoadingCnpj ? "Buscando..." : undefined}
        />
      </div>
      <div className="w-50 pl3 mb4">
        {isMultipleRegistrations ? (
          <EXPERIMENTAL_Select
            label="Inscrição Estadual *"
            options={registrationOptions}
            multi={false}
            onChange={(item: any) => handleChange('stateRegistration', item.value)}
          />
        ) : (
        <Input
          label="Inscrição Estadual *"
          value={formData.stateRegistration || ""}
          disabled
          placeholder="Não informado"
        />
      )}
      </div>
      <div className="w-100 mb4">
        <Input
          label="Nome Fantasia"
          value={formData.tradeName || ""}
          placeholder="Não informado"
          disabled={isLoadingCnpj}
          onChange={(e: any) => handleChange("tradeName", e.target.value)}
        />
      </div>
    </>
    )
  }
}