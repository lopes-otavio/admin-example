import React, { Component, RefObject } from "react"
import type { ClientData, ValidDataFeedBack } from "../../typings/types"
import { Box } from "vtex.styleguide"
import { maskCNPJ, maskCPF } from "../../masks"
import ClientDataForm from "./ClientDataForm"
import { isDataValidToCheckout } from "../../services/clientServices"
import { validateClientData } from "./clientDataValidator"
import ValidDataFeedback from "./ValidDataFeedback"
import StartSellingOptions from "./StartSellingOptions/StartSellingOptions"

type Props = {
  clientData: ClientData
  isNewClient?: boolean
}

type State = {
  isDataValidToCheckout: ValidDataFeedBack
  currentClientData: ClientData
}

export default class StartSellingForm extends Component<Props, State> {
  private feedBackRef: RefObject<any>

  constructor(props: Props) {
    super(props)
    this.feedBackRef = React.createRef();
    this.state = {
      isDataValidToCheckout: {
        isValid: null,
        missingFields: [],
        missingAddressFields: [],
      },
      currentClientData: { ...props.clientData },
    }
  }

  private verifyData = async (clientData?: ClientData) => {
    const dataToVerify = clientData || this.state.currentClientData

    try {
      const {
        data: { isComplete, availableAddresses },
      } = await isDataValidToCheckout(dataToVerify)

      if (isComplete) {
        this.setState({
          isDataValidToCheckout: {
            isValid: true,
            missingFields: [],
            missingAddressFields: [],
          },
          currentClientData: {
            ...dataToVerify,
            availableAddresses,
          },
        })
        return
      }

      const updatedDataToVerify = {
        ...dataToVerify,
        availableAddresses: dataToVerify.availableAddresses?.length ? dataToVerify.availableAddresses : availableAddresses,
      }

      const { isValid, missingFields, missingAddressFields } = validateClientData(updatedDataToVerify)

      this.setState({
        isDataValidToCheckout: { isValid, missingFields, missingAddressFields },
        currentClientData: updatedDataToVerify,
      })

      this.feedBackRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})

    } catch (error) {
      console.error("Erro ao verificar dados:", error)
    }
  }

  private handleVerifyData = async (formData: ClientData): Promise<void> => {
    console.log("Dados recebidos no componente pai:", formData)
    await this.verifyData(formData)
  }

  componentDidMount(): void {
    this.verifyData()
  }

  render() {
    const { isNewClient } = this.props
    const { currentClientData, isDataValidToCheckout } = this.state

    return (
      <section className="mb5">
        <h2 className="mt0 mb5 normal f4">Dados do Cliente</h2>
        <div className="pa bg-muted-4 mt5 pa4 br3">
          <p className="mb3 mt3 t-regular">
            {`${currentClientData.firstName || "Não informado"} ${currentClientData.lastName || ""}`}
          </p>
          <div className="flex mb5">
            <p className="w-50 mv0 t-regular">
              {currentClientData.email || "Não informado"}
            </p>
            <p className="w-50 mv0 t-regular">
              {currentClientData.isCorporate
                ? `CNPJ: ${maskCNPJ(currentClientData?.corporateDocument!) || "Não informado"}`
                : `CPF: ${maskCPF(currentClientData?.document!) || "Não informado"} `}
            </p>
          </div>

          <div id="validFeedBack" ref={this.feedBackRef}>
            <ValidDataFeedback isDataValidToCheckout={isDataValidToCheckout} />
          </div>

          <Box>
            <ClientDataForm
                isNewClient={isNewClient}
                clientData={currentClientData}
                isDataValid={isDataValidToCheckout.isValid}
                hasAddressError={isDataValidToCheckout.missingAddressFields.length > 0}
                onVerifyData={this.handleVerifyData}
              />
          </Box>
          { isDataValidToCheckout.isValid ?
          (
            <div className="mt3">
              <Box
                title="Iniciar atendimento"
              >
                <StartSellingOptions clientData={currentClientData} />
              </Box>
            </div>
            ) : null
          }
        </div>
      </section>
    )
  }
}
