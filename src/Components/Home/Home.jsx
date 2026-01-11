import React from 'react'
import './Home.css'
const Home = () => {
    return (
        <>
            <section className='home'>
                {/* Conatiner 1 */}
                <aside className='container1'>
                    <div className='home-container'>
                        <h1>Body Mass <br /> Index Calculator</h1>
                        <p>Better understand your weight in relation to your height using our body mass index (BM) calculator. While BMI is not the sole determinant of a healthy weight, it offers a valuable starting point to evaluate your overall health and well-being.</p>
                    </div>
                    <div className='home-button'>
                        <h2>Here Calculate Your Body Mass Index</h2>
                        <a href="#">Calculator</a>
                    </div>
                </aside>

                {/* Conatiner 2 */}
                <aside className='container2'>
                    <div className='container2-img'></div>
                    <div className='container2-info'></div>
                </aside>

            </section>

        </>
    )
}
export default Home