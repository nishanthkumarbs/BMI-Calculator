import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import Calculator from './Components/Calculator/Calculator'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import About from './Components/About/About'
import Partical from './Components/Partical/Partical'

const App = () => {
    return (
        // <div>
        //     <Navbar />
        //     <Home />
        //     <Calculator />
        // </div>

        <div>
            <BrowserRouter>
                <Partical />
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/calculator' element={<Calculator />}></Route>
                    <Route path='/about' element={<About />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}
export default App