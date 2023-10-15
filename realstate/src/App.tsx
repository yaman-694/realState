import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Headers from './components/Header'
import PrivateRoute from './components/privateRoute'
import CreateList from './pages/createList'
import UpdateList from './pages/updateList'
import Listing from './pages/Listing'
import Search from './pages/Search'
function App() {
  return <BrowserRouter>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap');
    </style>
    <Headers />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/listing/:listingId" element={<Listing />} />
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path='/create-list' element={<CreateList />} />
      </Route>
      <Route path='/search' element={<Search />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path='/about' element={<About />} />
      <Route path='/update-listing/:listId' element={<UpdateList />} />
    </Routes>
  </BrowserRouter>
}

export default App
