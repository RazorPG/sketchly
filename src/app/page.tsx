import { Show } from "@clerk/nextjs"
import HomeLayout from "../components/layouts/HomeLayout/HomeLayout"
import HomeView from "../components/views/Home"
import WorkspaceLayout from "../components/layouts/WorkspaceLayout"
import WorkspaceView from "../components/views/Workspace"

export default function Home() {
  return (
    <>
      <Show when="signed-in">
        <HomeLayout>
          <HomeView />
        </HomeLayout>
      </Show>
      <Show when="signed-out">
        <WorkspaceLayout>
          <WorkspaceView />
        </WorkspaceLayout>
      </Show>
    </>
  )
}
