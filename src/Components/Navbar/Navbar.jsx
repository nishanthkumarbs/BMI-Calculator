import React from 'react'
import './Navbar.css'

const Navbar = () => {
    return (
        <>
            <div className='navbar'>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">BMI Calculator</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </div>
        </>
    )
}
export default Navbar