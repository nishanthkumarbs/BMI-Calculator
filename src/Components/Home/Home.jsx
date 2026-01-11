import React from 'react'
import './Home.css'
import health from '../../assets/Healthy.png'
import { FaAppleAlt, FaDumbbell } from "react-icons/fa";
import { MdNightlightRound } from "react-icons/md";


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
                    <div className='container2-back'></div>
                    <div className='container2-img'>
                        <img src={health} alt="health" />
                    </div>
                    <div className='container2-info'>
                        <h1>What your BMI result means</h1>
                        <p>A BMI range of 18.5 to 24.9 is considered a 'healthy weight. Maintaining a healthy weight may lower your chances of experiencing health issues later on, such as obesity and type 2 diabetes. Aim for a nutritious diet with reduced fat and sugar content, incorporating ample fruits and vegetables. Additionally, strive for regular physical activity, ideally about 30 minutes daily for five days a week.</p>
                    </div>
                </aside>

                {/* Conatiner 3 */}
                <aside className='container3'>
                    <div className='container3-child'>
                        <div className="icon pink">
                            <FaAppleAlt />
                        </div>
                        <h2>Healthy eating</h2>
                        <p>Healthy eating promotes weight control, disease prevention, better digestion, immunity, mental clarity, and mood.</p>
                    </div>
                    <div className='container3-child'>
                        <div className="icon orange">
                            <FaDumbbell />
                        </div>
                        <h2>Regular exercise</h2>
                        <p>Exercise improves fitness, aids weight control, elevates mood, and reduces disease risk, fostering wellness and longevity.</p>
                    </div>
                    <div className='container3-child'>
                        <div className="icon teal">
                            <MdNightlightRound />
                        </div>
                        <h2>Adequate sleep</h2>
                        <p>Sleep enhances mental clarity, emotional stability, and physical wellness, promoting overall restoration and rejuvenation.</p>
                    </div>
                </aside>

            </section>

        </>
    )
}
export default Home