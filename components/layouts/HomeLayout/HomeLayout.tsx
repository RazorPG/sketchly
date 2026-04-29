import { ReactNode } from "react"
import Navbar from "../../sections/Navbar"
import Footer from "../../sections/Footer"

type PropTypes = {
  children: ReactNode
}

function HomeLayout({ children }: PropTypes) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default HomeLayout
