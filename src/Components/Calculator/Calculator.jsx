import React from 'react'
import './Calculator.css'

const Calculator = () => {
    return (
        <>
            <section className='container-main'>
                <aside className='container-form'>
                    <div className='fromContainer1'>
                        <h1>BMI Calculator</h1>
                        <form action="">
                            <label htmlFor="age">Age: </label>
                            <input type="number" id='age'  required />
                            <br />
                            <label htmlFor="height">Height: </label>
                            <input type="number" id='height' required />
                            <br />
                            <label htmlFor="weight">Weight: </label>
                            <input type="number" id='weight'/>
                            <br />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    <div className="formContainer2">
                        <h1>Form 2</h1>
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