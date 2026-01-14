import React from "react";
import { FaVenusMars, FaBirthdayCake, FaDumbbell, FaBaby, FaGlobe } from "react-icons/fa";
import "./About.css";

const About = () => {
    return (
        <section className="about-container">

            <aside className="container2">
                <div className="intro">
                    <h2>BMI Introduction</h2>
                    <p>BMI is a measurement of a person's leanness or corpulence based on their height and weight, and is intended to quantify tissue mass. It is widely used as a general indicator of whether a person has a healthy body weight for their height. Specifically, the value obtained from the calculation of BMI is used to categorize whether a person is underweight, normal weight, overweight, or obese depending on what range the value falls between. These ranges of BMI vary based on factors such as region and age, and are sometimes further divided into subcategories such as severely underweight or very severely obese. Being overweight or underweight can have significant health effects, so while BMI is an imperfect measure of healthy body weight, it is a useful indicator of whether any additional testing or action is required. Refer to the table below to see the different categories based on BMI that are used by the calculator.</p>
                </div>

                <div className="adults">
                    <div className="text">
                        <h2>BMI Table For Adults</h2>
                        <p>This is the World Health Organization's (WHO) recommended body weight based on BMI values for adults. It is used for both men and women, age 20 or older.</p>
                    </div>
                    <div className="table-container">
                        <table className="bmi-table">
                            <thead>
                                <tr>
                                    <th>Classification</th>
                                    <th>BMI range (kg/m<sup>2</sup>)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Severe Thinness</td>
                                    <td>&lt; 16</td>
                                </tr>
                                <tr>
                                    <td>Moderate Thinness</td>
                                    <td>16 – 17</td>
                                </tr>
                                <tr>
                                    <td>Mild Thinness</td>
                                    <td>17 – 18.5</td>
                                </tr>
                                <tr>
                                    <td>Normal</td>
                                    <td>18.5 – 25</td>
                                </tr>
                                <tr>
                                    <td>Overweight</td>
                                    <td>25 – 30</td>
                                </tr>
                                <tr>
                                    <td>Obese Class I</td>
                                    <td>30 – 35</td>
                                </tr>
                                <tr>
                                    <td>Obese Class II</td>
                                    <td>35 – 40</td>
                                </tr>
                                <tr>
                                    <td>Obese Class III</td>
                                    <td>&gt; 40</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </aside>

            <aside className="container1">
                <div className="about-header">
                    <h1>Limitations of BMI</h1>
                    <p>
                        Although BMI is often a practical indicator of healthy weight, it is
                        not suited for every person. Specific groups should carefully consider
                        their BMI outcomes, and in certain cases, the measurement may not be
                        beneficial to use.
                    </p>
                </div>

                <div className="about-cards">
                    <div className="about-card">
                        <span className="icon gender"><FaVenusMars /></span>
                        <h3>Gender</h3>
                        <p>
                            The development and body fat composition of girls and boys vary with
                            age. Consequently, a child's age and gender are considered when
                            evaluating their BMI.
                        </p>
                    </div>

                    <div className="about-card">
                        <span className="icon age"><FaBirthdayCake /></span>
                        <h3>Age</h3>
                        <p>
                            In aging individuals, increased body fat and muscle loss may cause
                            BMI to underestimate body fat content.
                        </p>
                    </div>

                    <div className="about-card">
                        <span className="icon muscle"><FaDumbbell /></span>
                        <h3>Muscle</h3>
                        <p>
                            BMI may misclassify muscular individuals as overweight or obese, as
                            it doesn’t differentiate muscle from fat.
                        </p>
                    </div>

                    <div className="about-card">
                        <span className="icon pregnancy"><FaBaby /></span>
                        <h3>Pregnancy</h3>
                        <p>
                            Expectant mothers experience weight gain due to their growing baby.
                            Maintaining a healthy pre-pregnancy BMI is advisable.
                        </p>
                    </div>

                    <div className="about-card">
                        <span className="icon race"><FaGlobe /></span>
                        <h3>Race</h3>
                        <p>
                            Certain health concerns may affect individuals of some Black and
                            Asian origins at lower BMIs than others.
                        </p>
                    </div>
                </div>
            </aside>


        </section>
    );
};

export default About;