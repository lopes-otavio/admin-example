import React from "react"

import { useState } from "react"
import { Button } from "vtex.styleguide"
import axios from "axios"
import { isEmptyOrNull } from "../../../helpers/validations"
import { TelevendaItem } from "../../../typings/types"

interface CommentsSummaryProps {
  televenda?: TelevendaItem
  sellerEmail: string
  isExpired?: boolean
}

interface NotesState {
  loading: boolean
  success: string
  errors: string
}

export default function CommentsSummary({ televenda, sellerEmail, isExpired = false }: CommentsSummaryProps) {
  const [formValues, setFormValues] = useState({
    notes: televenda?.notedoc || "",
  })

  const [notes, setNotes] = useState<NotesState>({
    loading: false,
    success: "",
    errors: "",
  })

  // Handler para mudanças no textarea
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handler para submissão do formulário
  const handleSubmitNote = async (event?: React.FormEvent) => {
    if (event) event.preventDefault()

    if (isEmptyOrNull(formValues.notes)) {
      setNotes({ ...notes, loading: false, success: "", errors: "Preencha o campo" })
    } else {
      setNotes({ ...notes, loading: true, success: "", errors: "" })
      try {
        await axios.post("/_v/update-note", {
          email: sellerEmail,
          docid: televenda?.id || televenda?.cartid,
          notes: formValues.notes,
        })
        setNotes({ ...notes, loading: false, success: "Observação registrada", errors: "" })
      } catch (error) {
        console.log(error)
        setNotes({ ...notes, loading: false, success: "", errors: "Não foi possível atualizar" })
      }
    }
  }

  return (
    <div className="bg-muted-5 pt5 pb6">
      <div className="br2 b--light-gray ba bg-base w-100 pa6">
        <h3 className="normal f5 mt0 mb4">Comentários</h3>

        {!isExpired ? (
          <form onSubmit={handleSubmitNote}>
            <textarea
              className="w-100 pa3 br2 b--light-gray ba bg-base"
              value={formValues.notes}
              onChange={handleChange}
              name="notes"
              id="notes"
              rows={4}
              placeholder="Adicione observações sobre este atendimento..."
            />
            <div className="mt4 flex items-center">
              <Button variation="primary" isLoading={notes.loading} type="submit">
                Salvar
              </Button>
              {notes.errors && <p className="ml4 c-danger f6">{notes.errors}</p>}
              {notes.success && <p className="ml4 c-success f6">{notes.success}</p>}
            </div>
          </form>
        ) : (
          <div>
            {formValues.notes ? (
              <p className="f6 lh-copy">{formValues.notes}</p>
            ) : (
              <p className="f6 mid-gray">Nenhum comentário adicionado</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
