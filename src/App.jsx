

import { RouterProvider } from "react-router-dom"
import { router } from "./Routes/Routes"
import store from "./lib/store"


function App() {

  return (
    <>
      <RouterProvider store={store} router={router} />
    </>
  )
}

export default App
