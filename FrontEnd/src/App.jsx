import Main from "./Componets/Main"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <>
      <Main />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  )
}

export default App
