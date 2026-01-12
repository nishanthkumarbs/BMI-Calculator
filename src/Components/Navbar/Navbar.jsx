import React from 'react'
import './Navbar.css'
import BMI from '../../assets/BMI.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <>
            <div className='navbar'>
                <div className='navbar-logo'>
                    <img src={BMI} alt="BMI" />
                </div>
                <div className='navbar-menu'>
                    <ul>
                        <li><Link id='navLink' to={'/'}>Home</Link></li>
                        <li><Link id='navLink' to={'/calculator'}>Calculator</Link></li>
                        <li><Link id='navLink' to={'/about'}>About</Link></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
export default Navbar