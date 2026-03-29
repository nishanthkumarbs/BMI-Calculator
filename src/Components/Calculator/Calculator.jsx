import React, { useState, useEffect } from 'react'
import './Calculator.css'
import chart from '../../assets/BMI_Chart.pdf'

const Calculator = () => {

    const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
    const [height, setHeight] = useState(''); // cm
    const [weight, setWeight] = useState(''); // kg
    const [heightFeet, setHeightFeet] = useState('');
    const [heightInches, setHeightInches] = useState('');
    
    // New States for Phase 2
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState('1.2');
    const [bmr, setBmr] = useState(null);
    const [tdee, setTdee] = useState(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Results States
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('bmiHistory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('bmiHistory', JSON.stringify(history));
    }, [history]);

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        return "Obesity";
    };

    const getSmartTips = (cat) => {
        switch (cat) {
            case 'Underweight': return "Consider adding nutrient-dense snacks to your day. Focus on strength training to build muscle mass gracefully.";
            case 'Normal': return "Great job! Maintain a balanced diet and aim for 150 minutes of moderate exercise per week.";
            case 'Overweight': return "Focus on a slight caloric deficit. Try swapping sugary drinks for water and add a 30-minute daily walk.";
            case 'Obesity': return "Consult a healthcare provider for a sustainable plan. Aim for steady, progressive lifestyle changes rather than crash diets.";
            default: return "";
        }
    }

    const clearHistory = () => {
        setHistory([]);
    }

    const resetInputs = () => {
        setHeight('');
        setWeight('');
        setHeightFeet('');
        setHeightInches('');
        setAge('');
        setBmi(null);
        setBmr(null);
        setTdee(null);
        setCategory('');
    }

    const toggleUnit = () => {
        setUnit(unit === 'metric' ? 'imperial' : 'metric');
        resetInputs();
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let bmiValue;
        let heightInCM;

        if (unit === 'metric') {
            if (!height || !weight) return;
            heightInCM = parseFloat(height);
            const heightInMeters = heightInCM / 100;
            bmiValue = weight / (heightInMeters * heightInMeters);
        } else {
            if (!heightFeet || (!heightInches && heightInches !== '0') || !weight) return;
            const heightInTotalInches = (parseInt(heightFeet) * 12) + parseInt(heightInches);
            heightInCM = heightInTotalInches * 2.54;
            const heightInMeters = heightInCM / 100;
            bmiValue = weight / (heightInMeters * heightInMeters);
        }

        const finalBmi = parseFloat(bmiValue).toFixed(2);
        const cat = getBMICategory(finalBmi);

        setBmi(finalBmi);
        setCategory(cat);

        // BMR & TDEE Calculation (Mifflin-St Jeor Equation)
        const parsedWeight = parseFloat(weight);
        const parsedAge = parseInt(age);

        if (parsedAge && parsedWeight && heightInCM) {
            let bmrValue = (10 * parsedWeight) + (6.25 * heightInCM) - (5 * parsedAge);
            bmrValue += (gender === 'male' ? 5 : -161);
            setBmr(Math.round(bmrValue));
            setTdee(Math.round(bmrValue * parseFloat(activity)));
        }

        const newRecord = {
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            bmi: finalBmi,
            category: cat
        };
        
        if (history.length > 0 && history[0].bmi === finalBmi) return;

        setHistory([newRecord, ...history].slice(0, 5));
    };

    return (
        <section className={`container-main ${theme === 'dark' ? 'dark-mode-container' : ''}`}>
            {/* Theme Toggle Button */}
            <div className="theme-toggle-container">
                <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
            </div>

            <aside className='container-form'>
                <div className="formContainer2">
                    <h1>Calculate Your <br /> Body Metrics</h1>
                    <p>Body mass index (BMI) is a measure of body fat. Combined with your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE), you can gain a complete picture of your daily caloric needs and overall health status.</p>
                    
                    {history.length > 0 && (
                        <div className="history-section">
                            <h3>Last Results</h3>
                            <ul className="history-list">
                                {history.map((item, idx) => (
                                    <li key={idx}>
                                        <span className="history-date">{item.date}</span>
                                        <span className="history-bmi">{item.bmi}</span>
                                        <span className={`history-cat ${item.category.toLowerCase()}`}>{item.category}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="clear-btn" onClick={clearHistory}>Clear History</button>
                        </div>
                    )}
                </div>

                <div className='fromContainer1'>
                    <div className="unit-toggle">
                        <button type="button" className={unit === 'metric' ? 'active' : ''} onClick={unit !== 'metric' ? toggleUnit : undefined}>Metric</button>
                        <button type="button" className={unit === 'imperial' ? 'active' : ''} onClick={unit !== 'imperial' ? toggleUnit : undefined}>Imperial</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Age & Gender Row */}
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>Age:</label>
                                <input type="number" placeholder="Years" value={age} onChange={(e) => setAge(e.target.value)} required />
                            </div>
                            <div className="form-group half-width">
                                <label>Gender:</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>

                        {/* Height Row */}
                        <div className="form-group">
                            <label>Height: </label>
                            {unit === 'metric' ? (
                                <input type="number" id="height" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} required />
                            ) : (
                                <div className="imperial-height-inputs">
                                    <input type="number" placeholder="Feet" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} required />
                                    <input type="number" placeholder="Inches" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} required />
                                </div>
                            )}
                        </div>

                        {/* Weight Row */}
                        <div className="form-group">
                            <label htmlFor="weight">Weight: </label>
                            <input type="number" id="weight" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                        </div>

                        {/* Activity Row */}
                        <div className="form-group">
                            <label>Activity Level:</label>
                            <select value={activity} onChange={(e) => setActivity(e.target.value)} required>
                                <option value="1.2">Sedentary (office job)</option>
                                <option value="1.375">Lightly Active (1-3 days/wk)</option>
                                <option value="1.55">Moderately Active (3-5 days/wk)</option>
                                <option value="1.725">Very Active (6-7 days/wk)</option>
                                <option value="1.9">Extra Active (physical job)</option>
                            </select>
                        </div>

                        <button className="calc-btn" type="submit">Calculate Metrics</button>
                    </form>

                    {bmi && (
                        <div className="result">
                            <h2>
                                Your BMI: {bmi}
                                <span className={`category ${category.toLowerCase()}`}>
                                    ( {category} )
                                </span>
                            </h2>
                            
                            <div className="gauge-container">
                                <div className="gauge-bar">
                                    <div className={`gauge-segment underweight-bg ${category === 'Underweight' ? 'active-segment' : ''}`}></div>
                                    <div className={`gauge-segment normal-bg ${category === 'Normal' ? 'active-segment' : ''}`}></div>
                                    <div className={`gauge-segment overweight-bg ${category === 'Overweight' ? 'active-segment' : ''}`}></div>
                                    <div className={`gauge-segment obesity-bg ${category === 'Obesity' ? 'active-segment' : ''}`}></div>
                                </div>
                            </div>
                            
                            {bmr && (
                                <div className="metabolic-stats">
                                    <div className="stat-box">
                                        <span className="stat-label">BMR</span>
                                        <span className="stat-value">{bmr} <small>kcal</small></span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-label">TDEE</span>
                                        <span className="stat-value">{tdee} <small>kcal</small></span>
                                    </div>
                                </div>
                            )}

                            <div className="smart-tips">
                                <strong>💡 Tip:</strong> {getSmartTips(category)}
                            </div>
                        </div>
                    )}

                </div>
            </aside>

            <aside className="container-table">
                <div className="tableContainer">
                    <h1>BMI Categories</h1>
                    <table className="bmi-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Range</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Underweight</th>
                                <td>Below 18.5</td>
                            </tr>
                            <tr>
                                <th>Normal</th>
                                <td>18.5 – 24.9</td>
                            </tr>
                            <tr>
                                <th>Overweight</th>
                                <td>25.0 – 29.9</td>
                            </tr>
                            <tr>
                                <th>Obesity</th>
                                <td>30.0 or above</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="containerButton">
                    <h2>To Know More <br /> Click the Below Button</h2>
                    <a href={chart}>Click</a>
                </div>
            </aside>
        </section>
    )
}

export default Calculator
