import HomeActionBlank from "./HomeActionBlank"
import HomeWorkspaceItem from "./HomeWorkspaceItem"
import HomeHeader from "./HomeHeader"

function Home() {
  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
      <HomeHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <HomeActionBlank />
        <HomeWorkspaceItem />
        <HomeWorkspaceItem />
        <HomeWorkspaceItem />
      </div>
    </main>
  )
}

export default Home
