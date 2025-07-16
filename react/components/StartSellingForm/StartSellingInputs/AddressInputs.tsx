import React, { Component } from "react"
import type { ClientAddressData, ClientData } from "../../../typings/types"
import { Input } from "vtex.styleguide"
import { getAddressDataByCep } from "../../../services/clientServices"

type Props = {
  formData: ClientData
  handleAddressChange: (field: keyof ClientAddressData, value: string) => void
}

type State = {
  isLoadingCep: boolean
}

export default class AddressInputs extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isLoadingCep: false,
    }
  }

  private handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "")

    if (cep.length !== 8) {
      return
    }

    this.setState({ isLoadingCep: true })

    try {
      const { addressData } = await getAddressDataByCep(cep)

      if (addressData) {
        const { handleAddressChange } = this.props

        if (addressData.postalCode) {
          handleAddressChange("postalCode", addressData.postalCode)
        }
        if (addressData.state) {
          handleAddressChange("state", addressData.state)
        }
        if (addressData.city) {
          handleAddressChange("city", addressData.city)
        }
        if (addressData.street) {
          handleAddressChange("street", addressData.street)
        }
        if (addressData.neighborhood) {
          handleAddressChange("neighborhood", addressData.neighborhood)
        }

        handleAddressChange("complement", addressData.complement || "")
        handleAddressChange("number", addressData.number || "")
      }
    } catch (error) {
      console.error("Erro ao buscar dados do CEP:", error)
    } finally {
      this.setState({ isLoadingCep: false })
    }
  }

  render() {
    const { formData, handleAddressChange } = this.props
    const { isLoadingCep } = this.state
    const address = formData.availableAddresses?.[0] || {}

    return (
      <>
        <div className="w-100 mb4">
          <Input
            label="CEP *"
            value={address.postalCode || ""}
            placeholder="00000-000"
            onChange={(e: any) => handleAddressChange("postalCode", e.target.value)}
            onBlur={this.handleCepBlur}
            disabled={isLoadingCep || formData.isCorporate}
            suffix={isLoadingCep ? "Buscando..." : undefined}
          />
        </div>
        <div className="w-50 pr3 mb4">
          <Input
            label="Rua *"
            value={address.street || ""}
            placeholder="Nome da rua"
            onChange={(e: any) => handleAddressChange("street", e.target.value)}
            disabled={isLoadingCep || formData.isCorporate}
          />
        </div>
        <div className="w-50 pl3 mb4">
          <Input
            label="Número *"
            value={address.number || ""}
            placeholder="123"
            onChange={(e: any) => handleAddressChange("number", e.target.value)}
            disabled={isLoadingCep || formData.isCorporate}
          />
        </div>
        <div className="w-100 mb4">
          <Input
            label="Complemento"
            value={address.complement || ""}
            placeholder="Apartamento, bloco, etc."
            onChange={(e: any) => handleAddressChange("complement", e.target.value)}
            disabled={isLoadingCep}
          />
        </div>
        <div className="w-50 pr3 mb4">
          <Input
            label="Bairro"
            value={address.neighborhood || ""}
            placeholder="Nome do bairro"
            onChange={(e: any) => handleAddressChange("neighborhood", e.target.value)}
            disabled={isLoadingCep || formData.isCorporate}
          />
        </div>
        <div className="w-50 pl3 mb4">
          <Input
            label="Cidade *"
            value={address.city || ""}
            placeholder="Nome da cidade"
            onChange={(e: any) => handleAddressChange("city", e.target.value)}
            disabled={isLoadingCep || formData.isCorporate}
          />
        </div>
        <div className="w-50 pr3 mb4">
          <Input
            label="Estado *"
            value={address.state || ""}
            placeholder="Estado"
            onChange={(e: any) => handleAddressChange("state", e.target.value)}
            disabled={isLoadingCep || formData.isCorporate}
          />
        </div>
        <div className="w-50 pl3 mb4">
          <Input
            label="Referência"
            value={address.reference || ""}
            placeholder="Ponto de referência"
            onChange={(e: any) => handleAddressChange("reference", e.target.value)}
            disabled={isLoadingCep}
          />
        </div>
        <div className="w-100 mb4">
          <Input
            label="Nome do Destinatário"
            value={address.receiverName || ""}
            placeholder="Nome completo"
            onChange={(e: any) => handleAddressChange("receiverName", e.target.value)}
            disabled={isLoadingCep}
          />
        </div>
      </>
    )
  }
}
