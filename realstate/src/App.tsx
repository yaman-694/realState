import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Headers from './components/Header'
import PrivateRoute from './components/privateRoute'
import CreateList from './pages/createList'
function App() {
  return <BrowserRouter>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&display=swap');
      </style>
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path='/create-list' element={<CreateList />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </BrowserRouter>
}

export default App
