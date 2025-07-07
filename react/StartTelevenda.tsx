import React, { useEffect } from 'react'
import { useState } from "react"
import { Layout, PageBlock, PageHeader, Spinner  } from "vtex.styleguide"

import "./styles.global.css"
import SearchClientForm from "./components/SearchClientForm/SearchClientForm"
import { ClientData } from './typings/types'
import StartSellingForm from './components/StartSellingForm/StartSellingForm'
import { initialClientData } from './constants/clientDataInitial'
import { getCurrentSeller } from './services/clientServices'

type Props = {}

function StartTelevenda({}: Props) {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [isNewClient, setIsNewClient] = useState<boolean>(false)
  const [sellerEmail, setSellerEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const setCurrentSeller = async () => {
      const { sellerEmail } = await getCurrentSeller()
      setSellerEmail(sellerEmail)
      setIsLoading(false)
    }
    setCurrentSeller()
  }, [])

  const handleClientFound = (data: ClientData) => {
    setClientData(data)
  }

  const handleNewClient = (isNew: boolean) => {
    setIsNewClient(isNew)
  }

  const handleClientClear = () => {
    setClientData(null)
  }

  const SubTitle = () => {
    return (
      <>
        <b>Vendedor:</b> {sellerEmail}
      </>
    )
  }

  if(isLoading) {
    return (
      <Layout pageHeader={<PageHeader title="Novo Atendimento" />}>
        <Spinner />
      </Layout>
    )
  }

  if(isNewClient) {
    return (
      <Layout pageHeader={<PageHeader title="Novo Atendimento" subtitle={<SubTitle/>} />} fullWidth>
        <PageBlock variation="full">
          <SearchClientForm onClientFound={handleClientFound} onClientClear={handleClientClear} onNewClient={handleNewClient} />
          <StartSellingForm clientData={initialClientData} isNewClient={isNewClient}/>
        </PageBlock>
      </Layout>
    )
  }


  return (
    <Layout pageHeader={<PageHeader title="Novo Atendimento" subtitle={<SubTitle/>} />} fullWidth>
      <PageBlock variation="full">
        <SearchClientForm onClientFound={handleClientFound} onClientClear={handleClientClear} onNewClient={handleNewClient} />
        {clientData ? (
          <StartSellingForm clientData={clientData}/>
        ): null}
      </PageBlock>
    </Layout>
  )
}

export default StartTelevenda
