import React, { Component } from 'react'
import { ClientData } from '../../../typings/types'
import { Button } from "vtex.styleguide"
import { createOrderForm, setImpersonateCustomer } from '../../../services/clientServices'

type Props = {
  clientData: ClientData
}

type State = {
  isCreating: boolean
}

export default class NewCartOption extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isCreating: false
    }
  }

  private handleNewCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    this.setState({isCreating: true})

    try {
      const { orderFormId, status } = await createOrderForm(this.props.clientData)

      if(status != 200) {
        return
      }

      await setImpersonateCustomer(this.props.clientData.email)

      window.open(`/?orderFormId=${orderFormId}&sc=2`, 'siteWindow');

    } catch (err) {
      console.error('Erro ao criar carrinho')
    } finally {
      this.setState({isCreating: false})
    }
  }


  render() {

    const { isCreating } = this.state

    return (
      <div className='w-33 pa6 h-100 flex flex-column justify-center items-center'>
        <h3 className='mt0'>Novo Carrinho</h3>
        <Button
          children="Iniciar"
          variation="secondary"
          isLoading={isCreating}
          onClick={this.handleNewCart}
          block
        />
      </div>
    )
  }
}
