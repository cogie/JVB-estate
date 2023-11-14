import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import SignUp from './pages/Signup'
import About from './pages/about'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/about' element={<About />}/>
      </Routes>
    </BrowserRouter>
  )
}
