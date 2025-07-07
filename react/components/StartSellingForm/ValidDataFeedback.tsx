import React, { Component } from 'react'
import { ValidDataFeedBack } from '../../typings/types'
import { Spinner } from "vtex.styleguide"

type Props = {
  isDataValidToCheckout: ValidDataFeedBack
}

type State = {}

export default class ValidDataFeedback extends Component<Props, State> {
  state = {}

  // Mapeamento dos campos para português
  private fieldLabels: { [key: string]: string } = {
    firstName: "Nome",
    lastName: "Sobrenome",
    email: "E-mail",
    phone: "Telefone",
    document: "CPF",
    corporateDocument: "CNPJ",
    corporateName: "Razão Social",
    stateRegistration: "Inscrição Estadual",
    availableAddresses: "Endereço",
    postalCode: "CEP",
    state: "Estado",
    city: "Cidade",
    street: "Rua",
    number: "Número",
    complement: "Complemento remova(: , ; - # *)"
  }

  private formatMissingFields = (missingFields: string[]): string => {
    const translatedFields = missingFields.map((field) => this.fieldLabels[field] || field)

    if (translatedFields.length === 1) {
      return translatedFields[0]
    }

    if (translatedFields.length === 2) {
      return translatedFields.join(" e ")
    }

    const lastField = translatedFields.pop()
    return `${translatedFields.join(", ")} e ${lastField}`
  }

  render() {
    const { isDataValidToCheckout } = this.props

    if (isDataValidToCheckout.isValid === null) {
      return (
        <span className="dib c-muted-1">
          <Spinner color="currentColor" size={20} />
        </span>
      )
    }

    if (isDataValidToCheckout.isValid) {
      return (
        <>
          <div className="flex justify-between br2 bg-success--faded active-bg-success-faded b--success ba c-success active-c-success active-b-success pa4 mb3">
            <p className="mv0">Dados cliente</p>
            <p className="mv0">OK</p>
          </div>
          <div className="flex justify-between br2 bg-success--faded active-bg-success-faded b--success ba c-success active-c-success active-b-success pa4 mb3">
            <p className="mv0">Endereço</p>
            <p className="mv0">OK</p>
          </div>
        </>
      )
    }

    return (
      <>
      {isDataValidToCheckout.missingFields.length ? (
        <div className="br2 bg-warning--faded active-bg-warning-faded c-warning active-c-warning ba b--warning active-b-warning pa4 mb3">
          <div className="flex justify-between items-start">
            <p className="mv0 fw6">Dados cliente</p>
            <p className="mv0 c-danger">Incompleto</p>
          </div>
          <div className="mt3">
            <p className="mv0 f6">
              <strong>Campos obrigatórios: </strong>
              {this.formatMissingFields(isDataValidToCheckout.missingFields)}
            </p>
          </div>
        </div>
      ): null}
      {isDataValidToCheckout.missingAddressFields.length ? (
        <div className="br2 bg-warning--faded active-bg-warning-faded c-warning active-c-warning ba b--warning active-b-warning pa4 mb3">
          <div className="flex justify-between items-start">
            <p className="mv0 fw6">Endereço</p>
            <p className="mv0 c-danger">Incompleto</p>
          </div>
          <div className="mt3">
            <p className="mv0 f6">
              <strong>Campos obrigatórios: </strong>
              {this.formatMissingFields(isDataValidToCheckout.missingAddressFields)}
            </p>
          </div>
        </div>
      ): null}
      </>
    )
  }
}