import React from 'react'
import './Navbar.css'
import BMI from '../../assets/BMI.png'

const Navbar = () => {
    return (
        <>
            <div className='navbar'>
                <div className='navbar-logo'>
                    <img src={BMI} alt="BMI" />
                </div>
                <div className='navbar-menu'>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">BMI Calculator</a></li>
                        <li><a href="#">About</a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
export default Navbar