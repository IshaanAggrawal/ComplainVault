import Background from '@/components/Background'
import Chatboticon from '@/components/Chatboticon'
import Features from '@/components/Features'
import Herosection from '@/components/Herosection'
import Numbers from '@/components/Numbers'
import Workflow from '@/components/Workflow'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import React from 'react'

function Homepage() {
  return (
    <div>
      <Background/>
      <Header/>
      <Herosection/>
      <Chatboticon />
      <Workflow/>
      <Features/>
      <Numbers/>
      <Footer/>
    </div>
  )
}

export default Homepage
