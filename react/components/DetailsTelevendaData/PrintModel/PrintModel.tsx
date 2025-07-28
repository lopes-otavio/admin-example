import  React from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { useState } from "react"
import { Button, Checkbox } from "vtex.styleguide"
import { formatCurrency, showOff } from "../../../helpers/formaters"
import { pdfStyles } from "../../../constants/pdf"

type Props = {
  idCart: string
  orderFormData: any
  televenda: any
  sellerEmail: string
}

interface FormValues {
  oc: string
  nameSeller: string
  check1: boolean // Exibir dados de entrega
  check2: boolean // Exibir formas de pagamento
  check3: boolean // Exibir descontos
}

export default function PrintModel({ idCart, orderFormData, televenda, sellerEmail }: Props) {
  const [isLoadPrint, setIsLoadPrint] = useState(false)
  const [blockSeller] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>({
    oc: "",
    nameSeller: "Nome Televendedor",
    check1: true,
    check2: true,
    check3: true,
  })

  // Dados extraídos do orderForm
  const profile = orderFormData?.clientProfileData || {}
  const address = orderFormData?.shippingData?.address || {}
  const products = orderFormData?.items || []
  const totalizers = orderFormData?.totalizers || []
  const shipping = orderFormData?.shippingData?.logisticsInfo || []
  const paymentData = orderFormData?.paymentData || {}
  const benefits = orderFormData?.ratesAndBenefitsData?.rateAndBenefitsIdentifiers || []
  const totalValue = orderFormData?.value || 0

  // Configurações da empresa
  const companyData = {
    logo: "https://spro.vtexassets.com/arquivos/app-spro.jpg",
    razaoSocial: "Super Pro Atacado<br/>CNPJ: 00.000.000/0001-00",
    fraseRodape: "Empresa comprometida com a qualidade e satisfação do cliente.",
    matriz: "Matriz: Rod. BR 470 Ingo Hering, 1277 São Domingos - Navegantes - SC - CEP 88370-888",
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getValidityDate = () => {
    const creationDate = new Date(televenda?.datedoc || Date.now())
    const validityDate = new Date(creationDate)
    validityDate.setDate(validityDate.getDate() + 2)
    return validityDate.toLocaleDateString("pt-BR")
  }

  const strTimeShipping = (estimate: string) => {
    if (!estimate) return ""
    if (estimate === "0") return "Hoje"
    if (estimate === "1") return "1 dia útil"
    const cleanEstimate = estimate.replace(/bd|d|h/gi, "")
    const days = Number.parseInt(cleanEstimate)
    if (!isNaN(days)) {
      return `${days} dias úteis`
    }
    return estimate
  }

  const nameFile = () => {
    const clientName = profile.isCorporate
      ? profile.corporateName?.replace(/[^a-zA-Z0-9]/g, "_")
      : `${profile.firstName}_${profile.lastName}`.replace(/[^a-zA-Z0-9]/g, "_")
    const date = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")
    const oc = formValues.oc ? `_OC_${formValues.oc}` : ""
    return `Orcamento_${idCart}_${clientName}_${date}${oc}.pdf`
  }

  // Versão melhorada da geração de PDF
  const handlePrint = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (typeof window === "undefined") {
      console.error("Ambiente não suporta geração de PDF")
      return
    }

    setIsLoadPrint(true)

    try {
      const element = document.getElementById("orcamento-pdf")
      if (!element) {
        console.error("Elemento 'orcamento-pdf' não encontrado")
        setIsLoadPrint(false)
        return
      }

      // Método alternativo usando html2canvas + jsPDF
      const canvas = await html2canvas(element, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(nameFile())
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
    } finally {
      setIsLoadPrint(false)
    }
  }

  const RenderShipping = () => {
    if (!shipping.length) return <div>Dados de entrega não disponíveis</div>

    const [firstShipping] = shipping
    if (!firstShipping || !firstShipping.slas || !firstShipping.slas.length) {
      return <div>Dados de entrega não disponíveis</div>
    }

    const [selectedSLA] = firstShipping.slas.filter((item: any) => item.id == firstShipping.selectedSla)
    const estimate = selectedSLA?.shippingEstimate ?? ""
    const name = selectedSLA?.name ?? ""
    const strEstimate = strTimeShipping(estimate)

    const shippingObject = totalizers.find((item: any) => item.id === "Shipping")
    const price = shippingObject ? shippingObject.value : "Calcular"

    let strPrice = ""
    if (price !== "Calcular") {
      strPrice = formatCurrency(price)
    }
    if (price === 0) {
      strPrice = "Grátis"
    }

    if (firstShipping?.selectedDeliveryChannel === "delivery") {
      return (
        <div style={{ marginBottom: "10px" }}>
          <div>Receber</div>
          <div>{name}</div>
          <div>
            Em até {strEstimate} - {strPrice}
          </div>
        </div>
      )
    } else {
      return (
        <div style={{ marginBottom: "10px" }}>
          <div>Retirar</div>
          <div>
            {strTimeShipping(estimate)} após aprovação do pagamento - {strPrice}
          </div>
          <div style={{ fontSize: "10px", marginTop: "5px" }}>
            <strong>{selectedSLA?.deliveryIds?.[0]?.courierName || "Loja"}</strong>
            <br />
            {selectedSLA?.pickupStoreInfo?.address?.street}, {selectedSLA?.pickupStoreInfo?.address?.number}
            <br />
            {selectedSLA?.pickupStoreInfo?.address?.neighborhood}
            <br />
            {selectedSLA?.pickupStoreInfo?.address?.city} - {selectedSLA?.pickupStoreInfo?.address?.state}
          </div>
        </div>
      )
    }
  }

  const RenderPayment = () => {
    if (!paymentData || !paymentData.payments || !paymentData.payments.length) {
      return <div>Formas de pagamento não disponíveis</div>
    }

    const pay = paymentData.payments[0]
    if (!pay) return <div>Dados de pagamento não disponíveis</div>

    const id = Number.parseInt(pay.paymentSystem)
    const paymentSystems = paymentData.paymentSystems || []
    const index = paymentSystems.findIndex((item: any) => item.id === id)
    const name = paymentSystems[index]?.name || "Não identificado"
    const installments = pay.installments || 1

    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ marginBottom: "5px" }}>
          <strong>Forma de pagamento:</strong> {name}
        </div>
        <div>
          <strong>Condição:</strong>{" "}
          {installments > 1 ? (
            <span>
              {pay?.merchantSellerPayments?.[0]?.installments || installments}x de{" "}
              {formatCurrency(pay?.merchantSellerPayments?.[0]?.installmentValue || pay.value / installments)}
            </span>
          ) : (
            <span style={{ color: "#007bff", fontWeight: "bold" }}>À vista já com 10% off</span>
          )}
        </div>
      </div>
    )
  }

  if (!orderFormData) {
    return (
      <div className="bg-muted-5 pt5 pb5">
        <div className="br2 b--light-gray ba bg-base w-100 pa6">
          <h3 className="normal f5 mt0 mb0 c-muted-1">Carregando dados do orçamento...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted-5 pt5 pb5">
      <div className="br2 b--light-gray ba bg-base w-100 pa6">
        <div className="flex items-center">
          <h3 className="normal f5 mt0 w-70">Pré visualizar</h3>
          <h3 className="normal f5 mt0 w-30 pl4">Configuração</h3>
        </div>
        <div className="flex items-top">
          {/* Preview do Orçamento */}
          <div className="w-70 pa3 ba b--near-black">
            <div id="orcamento-pdf" style={pdfStyles.container}>
              {/* Header */}
              <div style={pdfStyles.header}>
                <img
                  src={companyData.logo || "/placeholder.svg"}
                  alt="Logo da empresa"
                  style={{ maxWidth: "150px", height: "auto" }}
                />
                <div style={{ marginTop: "10px", fontSize: "10px" }}>
                  <div dangerouslySetInnerHTML={{ __html: companyData.razaoSocial }} />
                  <div style={{ marginTop: "5px" }}>{companyData.matriz}</div>
                </div>
              </div>

              {/* Infos form */}
              <div style={pdfStyles.section}>
                <h4 style={pdfStyles.sectionTitle}>Orçamento: #{idCart}</h4>
                <table style={pdfStyles.table}>
                  <tbody>
                    <tr>
                      <td style={pdfStyles.tableCell}>
                        <strong>Vendedor:</strong> {formValues.nameSeller || "Nome do Vendedor"}
                        <br />
                        <strong>Email:</strong> {sellerEmail}
                      </td>
                      <td style={{ ...pdfStyles.tableCell, textAlign: "right" }}>
                        <strong>Data:</strong> {formatDate(televenda?.datedoc)}
                        <br />
                        <strong>OC:</strong> {formValues.oc || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Profile */}
              <div style={pdfStyles.section}>
                <h4 style={pdfStyles.sectionTitle}>Dados do cliente</h4>
                <table style={pdfStyles.table}>
                  <tbody>
                    {profile.isCorporate ? (
                      <>
                        <tr>
                          <td style={pdfStyles.tableCell}>
                            <strong>Razão Social:</strong> {profile.corporateName}
                          </td>
                          <td style={pdfStyles.tableCell}>
                            <strong>CNPJ:</strong> {profile.corporateDocument}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td style={pdfStyles.tableCell}>
                            <strong>Nome:</strong> {profile.firstName} {profile.lastName}
                          </td>
                          <td style={pdfStyles.tableCell}>
                            <strong>CPF:</strong> {profile.document}
                          </td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td style={pdfStyles.tableCell}>
                        <strong>Telefone:</strong> {profile.phone}
                      </td>
                      <td style={pdfStyles.tableCell}>
                        <strong>Email:</strong> {profile.email}
                      </td>
                    </tr>
                    <tr>
                      <td style={pdfStyles.tableCell}>
                        <strong>Endereço:</strong> {address.street}, {address.number}
                      </td>
                      <td style={pdfStyles.tableCell}>
                        <strong>Bairro:</strong> {address.neighborhood}
                      </td>
                    </tr>
                    <tr>
                      <td style={pdfStyles.tableCell}>
                        <strong>Cidade:</strong> {address.city}, {address.state}
                      </td>
                      <td style={pdfStyles.tableCell}>
                        <strong>CEP:</strong> {address.postalCode}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Produtos */}
              <div style={pdfStyles.section}>
                <h4 style={pdfStyles.sectionTitle}>Itens</h4>
                <table style={pdfStyles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...pdfStyles.tableHeader, width: "40%", textAlign: 'start' }}>Produto</th>
                      <th style={{ ...pdfStyles.tableHeader, width: "20%", textAlign: 'start' }}>Preço</th>
                      <th style={{ ...pdfStyles.tableHeader, width: "20%", textAlign: 'start' }}>Quantidade</th>
                      <th style={{ ...pdfStyles.tableHeader, width: "20%", textAlign: 'start' }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item: any, i: number) => (
                      <tr key={i}>
                        <td style={pdfStyles.tableCell}>
                          <div style={{ fontWeight: "bold", marginBottom: "3px" }}>{item.name}</div>
                          <div style={{ fontSize: "9px", color: "#666" }}>
                            Ref: {item.refId} | SKU: {item.id}
                          </div>
                        </td>
                        <td style={pdfStyles.tableCell}>
                          {item.sellingPrice < item.listPrice && (
                            <div style={{ fontSize: "9px", textDecoration: "line-through", color: "#999" }}>
                              {formatCurrency(item.listPrice)}
                            </div>
                          )}
                          <div style={{ fontWeight: "bold" }}>{formatCurrency(item.sellingPrice)}</div>
                          {item.sellingPrice < item.listPrice && (
                            <span style={pdfStyles.discountBadge}>{showOff(item.listPrice, item.sellingPrice)}</span>
                          )}
                        </td>
                        <td style={pdfStyles.tableCell}>{item.quantity}</td>
                        <td style={pdfStyles.tableCell}>
                          <strong>{formatCurrency(item.quantity * item.sellingPrice)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Entrega */}
              {formValues.check1 && (
                <div style={pdfStyles.section}>
                  <h4 style={pdfStyles.sectionTitle}>Entrega</h4>
                  <RenderShipping />
                </div>
              )}

              {/* Descontos */}
              {formValues.check3 && benefits.length > 0 && (
                <div style={pdfStyles.section}>
                  <h4 style={pdfStyles.sectionTitle}>Descontos</h4>
                  {benefits.map((item: any, i: number) => (
                    <div key={i} style={{ marginBottom: "5px", fontWeight: "bold", color: "#007bff" }}>
                      ✓ {item.name || item.description || `Desconto ${i + 1}`}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagamento */}
              {formValues.check2 && (
                <div style={pdfStyles.section}>
                  <h4 style={pdfStyles.sectionTitle}>Pagamento</h4>
                  <RenderPayment />
                  <table style={{ ...pdfStyles.table, marginTop: "15px", border: "1px solid #333" }}>
                    <tbody>
                      {totalizers.map((item: any, i: number) => (
                        <tr key={i}>
                          <td style={{ ...pdfStyles.tableCell, borderRight: "1px solid #ccc" }}>{item.name}</td>
                          <td style={{ ...pdfStyles.tableCell, textAlign: "right" }}>{formatCurrency(item.value)}</td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: "#f0f0f0" }}>
                        <td style={{ ...pdfStyles.tableCell, fontWeight: "bold", borderRight: "1px solid #333" }}>
                          Valor Final
                        </td>
                        <td style={{ ...pdfStyles.tableCell, fontWeight: "bold", textAlign: "right" }}>
                          {formatCurrency(totalValue)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              <div style={pdfStyles.footer}>
                <div style={{ color: "#d32f2f", marginBottom: "10px" }}>
                  Preços válidos somente pelo Televendas, não poderão ser praticados em lojas físicas.
                  <br />
                  Preços exclusivos para consumidor final, para Revendedores será acrescido Substituição Tributária.
                </div>
                <div style={{ fontWeight: "bold", fontSize: "11px", color: "#d32f2f", marginBottom: "10px" }}>
                  Válido até {getValidityDate()}
                </div>
                <div style={{ color: "#d32f2f", marginBottom: "10px" }}>Sujeito a análise e aprovação de crédito</div>
                <div style={{ color: "#666" }}>{companyData.fraseRodape}</div>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="w-30 pl4">
            <div className="mb3">
              <input
                placeholder="(OC) Ordem de Compra"
                className="w-100 pa3 br2 b--light-gray ba bg-base"
                onChange={handleChange}
                maxLength={15}
                type="text"
                value={formValues.oc}
                name="oc"
                id="oc"
              />
            </div>
            <div className="mb3">
              <input
                placeholder="Nome do vendedor"
                className="w-100 pa3 br2 b--light-gray ba bg-base"
                onChange={handleChange}
                maxLength={50}
                type="text"
                readOnly={blockSeller}
                value={formValues.nameSeller}
                name="nameSeller"
                id="nameSeller"
              />
            </div>
            <div className="mb3">
              <Checkbox
                checked={formValues.check3}
                id="check3"
                label="Exibir descontos"
                name="check3"
                onChange={handleCheck}
                value="discount"
              />
            </div>
            <div className="mb3">
              <Checkbox
                checked={formValues.check1}
                id="check1"
                label="Exibir dados de entrega"
                name="check1"
                onChange={handleCheck}
                value="shipping"
              />
            </div>
            <div className="mb3">
              <Checkbox
                checked={formValues.check2}
                id="check2"
                label="Exibir formas de pagamento"
                name="check2"
                onChange={handleCheck}
                value="payment"
              />
            </div>
            <div className="mt6">
              <Button block variation="primary" onClick={handlePrint} isLoading={isLoadPrint}>
                GERAR PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
