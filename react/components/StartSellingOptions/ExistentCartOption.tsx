import React, { Component } from "react"
import type { ClientData } from "../../typings/types"
import { Input, Button } from "vtex.styleguide"
import { handleExistentOrderForm, setImpersonateCustomer } from "../../services/clientServices"

type Props = {
  clientData: ClientData
}

type State = {
  isCreating: boolean
  cartId: string
  error: boolean
}

export default class ExistentCartOption extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isCreating: false,
      cartId: "",
      error: false
    }
  }

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      cartId: e.target.value,
      error: false
    })
  }

  private handleExistentCart = async (e: React.FormEvent) => {
    e.preventDefault()
    this.setState({ isCreating: true })

    try {
      const { orderFormId, status } = await handleExistentOrderForm(this.state.cartId, this.props.clientData)

      if(status != 200) {
        this.setState({
          error: true
        })
        return
      }
      await setImpersonateCustomer(this.props.clientData.email)

      window.open(`/?orderFormId=${orderFormId}&sc=2`, 'siteWindow');

    } catch (err) {
      this.setState({
        error: true
      })
      console.error('Erro ao criar carrinho')
    } finally {
      this.setState({isCreating: false})
    }
  }

  render() {
    const { isCreating, cartId, error } = this.state

    return (
      <form onSubmit={this.handleExistentCart} className="w-33 h-100 pa6 flex flex-column justify-center items-center bl b--light-gray">
        <h3 className="mt0">Carrinho Existente</h3>
        <Input
          placeholder="ID do carrinho"
          value={cartId}
          onChange={this.handleInputChange}
          error={error}
          errorMessage={error ? 'ID inválido' : ''}
          disabled={isCreating}
          suffix={isCreating ? "Buscando..." : undefined}
        />
        <div className="mt3 w-100">
          <Button
            children="Inicar"
            isLoading={isCreating}
            disabled={!cartId}
            variation="secondary"
            type="submit"
            block
          />
        </div>
      </form>
    )
  }
}
