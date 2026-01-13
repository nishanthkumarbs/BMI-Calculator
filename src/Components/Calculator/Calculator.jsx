import React, { useState } from 'react'
import './Calculator.css'

const Calculator = () => {

    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        return "Obesity";
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!height || !weight) return;

        const heightInMeters = height / 100;
        const bmiValue = weight / (heightInMeters * heightInMeters);

        const finalBmi = bmiValue.toFixed(2);

        setBmi(finalBmi);
        setCategory(getBMICategory(finalBmi));
    };



    return (
        <>
            <section className='container-main'>
                <aside className='container-form'>

                    <div className="formContainer2">
                        <h1>Calculate Your <br /> Body Mass Index</h1>
                        <p>Body mass index (BMI) is a measure of body fat based on height and weight that applies to adult men and women. Your BMI is just one piece of the puzzle. It’s based on height and weight but doesn’t take into account your muscle mass, bone density, or body composition. Your healthcare provider will consider whether your BMI is too high or too low for you.</p>
                    </div>

                    <div className='fromContainer1'>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="height">Height: </label>
                            <input type="number" id="height" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} required />

                            <br />

                            <label htmlFor="weight">Weight: </label>
                            <input type="number" id="weight" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />

                            <br />

                            <button type="submit">Calculate Your BMI</button>
                        </form>

                        {bmi && (
                            <div className="result">
                                <h2>
                                    Your BMI: {bmi} kg/m<sup>2</sup>
                                    <span className={`category ${category.toLowerCase()}`}>
                                        ( {category} )
                                    </span>
                                </h2>
                            </div>
                        )}




                    </div>
                </aside>

                <aside className="container-table">
                    <div className="tableContainer">
                        <h1>TABLE</h1>
                    </div>
                </aside>
            </section>
        </>
    )
}

export default Calculator
