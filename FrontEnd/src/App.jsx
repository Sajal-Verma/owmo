import Main from "./Componets/Main"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContextProvider from "./context/StoreProvider"

function App() {

  return (
    <ContextProvider>
      <Main />
      {/* <Login />
      <Register /> */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </ContextProvider>
    
  )
}

export default App
