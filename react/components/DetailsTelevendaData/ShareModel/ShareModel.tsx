import React, { useState } from "react"
import { Input, Button } from "vtex.styleguide"

type Props = {
  idCart: string
}

export default function ShareModel({ idCart }: Props) {
  const [copy, setCopy] = useState(false)

  // Obtém o host atual da aplicação
  const host = `https://www.superproatacado.com.br/`
  const shareLink = `${host}checkout/?orderFormId=${idCart}#/payment`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopy(true)
      setTimeout(() => {
        setCopy(false)
      }, 3000)
    } catch (error) {
      console.error("Erro ao copiar link:", error)

      // Fallback para navegadores mais antigos
      try {
        const textArea = document.createElement("textarea")
        textArea.value = shareLink
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)

        setCopy(true)
        setTimeout(() => {
          setCopy(false)
        }, 3000)
      } catch (fallbackError) {
        console.error("Erro no fallback de cópia:", fallbackError)
      }
    }
  }

  return (
    <div className="bg-muted-5 pt5 pb5">
      <div className="br2 b--light-gray ba bg-base w-100 pa6">
        <h3 className="normal f5 mt0">Compartilhar link com o cliente</h3>

        <div className="flex items-center w-80">
          <div className="w-80">
            <Input id="inputShare" name="inputShare" value={shareLink} readOnly placeholder="Link será gerado aqui" />
          </div>

          <div className="w-20 pl2">
            <Button
              variation={copy ? "primary" : "secondary"}
              onClick={handleCopyLink}
              block
              style={{
                backgroundColor: copy ? "#23C307" : "#0c389f",
                borderColor: copy ? "#23C307" : "#0c389f",
                color: "white",
              }}
            >
              {copy ? "Link copiado" : "Copiar Link"}
            </Button>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt4">
          <p className="f6 c-muted-1 mt3 mb0">
            Este link direcionará o cliente diretamente para a página de pagamento do orçamento.
          </p>
          <p className="f6 c-muted-1 mt2 mb0">
            <strong>ID do Orçamento:</strong> {idCart}
          </p>
        </div>
      </div>
    </div>
  )
}
