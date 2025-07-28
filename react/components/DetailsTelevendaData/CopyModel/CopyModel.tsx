import React, { useEffect } from 'react'

type Props = {
  idCart: string
}

export default function CopyModel({ idCart }: Props) {
  useEffect(() => {
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(idCart)
      } catch (error) {
        console.error("Erro ao copiar para clipboard:", error)
        // Fallback para navegadores mais antigos
        const textArea = document.createElement("textarea")
        textArea.value = idCart
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }
    }

    copyToClipboard()
  }, [idCart])

  return (
    <div className="bg-muted-5 pt5 pb5">
      <div className="br2 b--light-gray ba bg-base w-100 pa6">
        <h3 className="normal f5 mt0 mb0 c-action-primary">Modelo copiado com sucesso: {idCart}</h3>
      </div>
    </div>
  )
}
