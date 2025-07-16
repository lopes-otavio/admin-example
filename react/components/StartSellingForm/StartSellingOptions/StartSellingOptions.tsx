import React, { Component } from 'react'
import { ClientData } from '../../../typings/types'
import NewCartOption from './NewCartOption'
import ExistentCartOption from './ExistentCartOption'
import TableModelOption from './TableModelOption'

type Props = {
  clientData: ClientData
}

type State = {}

export default class StartSellingOptions extends Component<Props, State> {
  state = {}

  render() {

    const { clientData } = this.props

    console.log('CLIENTE VALIDO:', clientData)

    return (
      <div className="flex items-top br2 b--light-gray ba bg-base w-100">
        <NewCartOption clientData={clientData} />
        <ExistentCartOption clientData={clientData} />
        <TableModelOption clientData={clientData} />
      </div>
    )
  }
}