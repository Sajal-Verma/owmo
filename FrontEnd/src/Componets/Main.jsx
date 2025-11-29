import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from "../Pages/Home"
import About from "../Pages/About"
import Faq from "../Pages/Faq"
import Layout from './Layout'
import Login from '../Pages/Login'
import Register from '../Pages/Register'
import Request from '../Pages/Request'
import Profile from '../Pages/Profiles'
import ForgotPassword from '../Pages/forgotPassword'
import Quiz from '../Pages/Quiz'
import UserDetails from '../Pages/UserDetails'


function Main() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} /> {/* matches / */}
            <Route path="/about" element={<About />} />
            {/* <Route path="contact" element={<Contact />} /> */}
            <Route path="/faq" element={<Faq />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/Request" element={<Request />} />
            <Route path='/lala' element={<Profile />} />
            <Route path='/forgot' element={<ForgotPassword />} />
            <Route path='/Quiz' element={<Quiz />} />
            <Route path="/user-details/:id" element={<UserDetails />} />
            <Route path="/request-details/:id" element={<requestDetails />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default Main
