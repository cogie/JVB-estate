import {BrowserRouter, Routes,Route} from 'react-router-dom' // need for routing
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import About from './pages/about'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'



export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route element = {<PrivateRoute/>}> 
          {/* make profile priveate */}
            <Route path='/profile' element={<Profile />}/>
            <Route path='/create-listing' element={<CreateListing />}/>
            <Route path='/update-listing/:listingId' 
            element={<UpdateListing/>} />
          </Route>
          <Route path='/about' element={<About />}/>
      </Routes>
    </BrowserRouter>
  )
}
