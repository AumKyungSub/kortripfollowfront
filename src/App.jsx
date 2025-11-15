import React from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router";

//Components
import Homepage from './components/indexPage/Homepage'
import Location from './components/locationPage/Location'
import Region from './components/region/Region'
import SeasonPage from './components/season/SeasonPage'
import Theme from './components/theme/Theme';
import ThemeDetail from './components/themeDetail/ThemeDetail';
import About from './components/about/About'

// Page css
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/location/:id' element={<Location />} />
        <Route path='/region' element={<Region />} />
        <Route path='/season' element={<SeasonPage />} />
        <Route path='/theme' element={<Theme />} />
        <Route path='/themeDetail/:id' element={<ThemeDetail />} />
        <Route path='/about' element={<About />} />
      </Routes>        
    </BrowserRouter>
    </>
  )
}

export default App
