import { ReactNode } from "react"
import Navbar from "../../sections/Navbar"
import Footer from "../../sections/Footer"

type PropTypes = {
  children: ReactNode
}

function HomeLayout({ children }: PropTypes) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default HomeLayout
