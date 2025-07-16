import React, { Component } from "react"
import type { ClientData } from "../../../typings/types"
import { Input } from "vtex.styleguide"
import { maskCPF } from "../../../masks"

type Props = {
  isNewClient?: boolean,
  formData: ClientData
  handleChange: (field: keyof ClientData, value: string) => void
}

type State = {}

export default class ClientInputs extends Component<Props, State> {
  state = {}

  render() {
    const { formData, handleChange, isNewClient } = this.props

    return (
      <>
        <div className="w-100 mb4">
          <Input
            label="E-mail"
            value={formData.email || ""}
            disabled={!isNewClient}
            onChange={(e: any) => handleChange("email", e.target.value)}/>
        </div>
        <div className="w-50 pr3 mb4">
          <Input
            label="Primeiro Nome *"
            value={formData.firstName || ""}
            placeholder="Não informado"
            onChange={(e: any) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div className="w-50 pl3 mb4">
          <Input
            label="Sobrenome *"
            value={formData.lastName || ""}
            placeholder="Não informado"
            onChange={(e: any) => handleChange("lastName", e.target.value)}
          />
        </div>
        <div className="w-50 pr3 mb4">
          <Input
            label="Telefone *"
            value={formData.homePhone || ""}
            placeholder="Não informado"
            onChange={(e: any) => handleChange("homePhone", e.target.value)}
          />
        </div>
        <div className="w-50 pl3 mb4">
          <Input
            label="CPF"
            value={maskCPF(formData.document!) || ""}
            placeholder="Não informado"
            onChange={(e: any) => handleChange("document", e.target.value)}
          />
        </div>
      </>
    )
  }
}
