import React, { Component, ChangeEvent, FormEvent } from 'react'
import {
  Input,
  // EXPERIMENTAL_Select,
  Button } from 'vtex.styleguide'
import { errorMessages } from './errorMessages'
import { ClientData, DocumentType, FormErrors } from '../../typings/types'
import {
  documentTypeInitial,
  initalError,
  // selectOptions
} from './formInitial'
import { formValidator } from './formValidator'
import { getClientData } from '../../services/clientServices'
import { maskCNPJ, maskCPF } from '../../masks'

type Props = {
  onClientFound: (clientData: ClientData) => void
  onClientClear: () => void
  onNewClient: (isNew: boolean) => void
}

type State = {
  inputValue: string
  documentType: DocumentType
  errors: FormErrors
  isSearching: boolean
  errorOnSearch: boolean
  clientNotFound: boolean
  isNewClient: boolean
}

export default class SearchClientForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      inputValue: "",
      documentType: documentTypeInitial,
      errors: initalError,
      isSearching: false,
      errorOnSearch: false,
      clientNotFound: false,
      isNewClient: false
    }
  }

  private handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value, isNewClient: false, clientNotFound: false })
    this.props.onClientClear()
    this.props.onNewClient(false)
  }

  private handleChangeDocument = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^\d./-]/g, "")
    this.setState({ inputValue: maskCPF(cleanedValue), isNewClient: false, clientNotFound: false })
    this.props.onClientClear()
    this.props.onNewClient(false)
  }

  private handleChangeCorporate = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^\d./-]/g, "")
    this.setState({ inputValue: maskCNPJ(cleanedValue), isNewClient: false, clientNotFound: false })
    this.props.onClientClear()
    this.props.onNewClient(false)
  }

  private handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      this.setState({ errors: initalError, errorOnSearch: false })

      const { inputValue, documentType } = this.state

      const isValid = await formValidator(inputValue, documentType?.value)

      if (isValid.error) {
        this.setState({ errors: isValid.errors })
        return
      }

      this.setState({ isSearching: true })

      const { data, status } = await getClientData(documentType.value, inputValue)

      if (status !== 200 || !data.success) {
        this.setState({ errorOnSearch: true })
        this.props.onClientClear()
        return
      }

      const { result } = data ?? {}

      if(!result.length) {
        this.setState({clientNotFound: true})
        return
      }

      const [clientData] = result

      this.props.onClientFound(clientData)
    } catch (err) {
      console.error(err)
      this.setState({ errorOnSearch: true })
      this.props.onClientClear()
    } finally {
      this.setState({ isSearching: false })
    }
  }

  private getCurrentInput = () => {
    if (this.state.documentType?.value == "corporateDocument") {
      return (
        <Input
          placeholder="CNPJ.."
          value={this.state.inputValue}
          size="regular"
          label="CNPJ do Cliente"
          maxLength={18}
          errorMessage={
            this.state.errors.cnpj.required
              ? errorMessages.requiredMessage
              : this.state.errors.cnpj.invalid
                ? errorMessages.invalidCNPJ
                : ""
          }
          onChange={this.handleChangeCorporate}
        />
      )
    }
    if (this.state.documentType?.value == "document") {
      return (
        <Input
          placeholder="CPF.."
          value={this.state.inputValue}
          size="regular"
          label="CPF do Cliente"
          maxLength={14}
          errorMessage={
            this.state.errors.cpf.required
              ? errorMessages.requiredMessage
              : this.state.errors.cpf.invalid
                ? errorMessages.invalidCPF
                : ""
          }
          onChange={this.handleChangeDocument}
        />
      )
    }
    return (
      <Input
        placeholder="Email.."
        value={this.state.inputValue}
        size="regular"
        label="Email do Cliente"
        errorMessage={
          this.state.errors.email.required
            ? errorMessages.requiredMessage
            : this.state.errors.email.invalid
              ? errorMessages.invalidEmail
              : ""
        }
        onChange={this.handleChange}
      />
    )
  }


  render() {
    const { errorOnSearch, clientNotFound, isNewClient } = this.state
    const { onNewClient } = this.props

    return (
      <form onSubmit={this.handleSubmit}>
        {/* <EXPERIMENTAL_Select
          label="Tipo de documento"
          options={selectOptions}
          multi={false}
          errorMessage={this.state.errors.documentType ? errorMessages.requiredMessage : ""}
          onChange={(value: any) => {
            this.setState({ documentType: value, inputValue: "", isNewClient: false, clientNotFound: false })
            onClientClear()
            onNewClient(false)
          }}
        /> */}
        <div className="mv5">{this.getCurrentInput()}</div>
        <div className={`flex ${(errorOnSearch || isNewClient || clientNotFound) ? 'justify-between' : 'justify-end'} mb5`}>
          {errorOnSearch ? (
            <div style={{alignSelf: 'center'}} className="pa3 br2 bg-warning--faded active-bg-warning-faded c-warning active-c-warning dib ba b--warning active-b-warning ma0">
              Ocorreu um erro, busque os dados novamente *
            </div>
          ) : null}
          {clientNotFound && !isNewClient ? (
            <div className='flex'>
              <div style={{alignSelf: 'center'}} className="pa3 br2 c-action-primary active-c-action-primary dib ba b--action-primary active-b-action-primary ma0">
                Cliente não encontrado *
              </div>
              <div className='ml3'>
                <Button
                  children="Criar cadastro"
                  variation="secondary"
                  onClick={() => {this.setState({isNewClient: true}); onNewClient(true)}}
                />
              </div>
            </div>
          ) : null}
          {isNewClient ? (
            <div style={{alignSelf: 'center'}} className="pa3 br2 c-action-primary active-c-action-primary dib ba b--action-primary active-b-action-primary ma0">
              Cliente Novo *
            </div>
          ) : null}
            <Button type="submit" variation="primary" isLoading={this.state.isSearching}>
              Buscar Dados
            </Button>
        </div>
      </form>
    )
  }
}
