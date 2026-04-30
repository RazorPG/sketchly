import { ReactNode } from "react"
import Navbar from "../../sections/Navbar"
import Footer from "../../sections/Footer"
import { HomeProvider } from "@/contexts/HomeContext"

type PropTypes = {
  children: ReactNode
}

function HomeLayout({ children }: PropTypes) {
  return (
    <>
      <HomeProvider>
        <Navbar />
        {children}
        <Footer />
      </HomeProvider>
    </>
  )
}

export default HomeLayout
