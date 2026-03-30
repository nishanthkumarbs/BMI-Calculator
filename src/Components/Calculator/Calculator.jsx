import React, { useState, useEffect, useRef } from 'react'
import './Calculator.css'
import chart from '../../assets/BMI_Chart.pdf'
import html2canvas from 'html2canvas'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const Calculator = () => {

    const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
    const [height, setHeight] = useState(''); // cm
    const [weight, setWeight] = useState(''); // kg
    const [heightFeet, setHeightFeet] = useState('');
    const [heightInches, setHeightInches] = useState('');
    
    // States for Phase 2 & 3
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState('1.2');
    const [targetWeight, setTargetWeight] = useState(''); // Goal Weight (kg)
    
    // Result States
    const [bmr, setBmr] = useState(null);
    const [tdee, setTdee] = useState(null);
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');
    const [goalDays, setGoalDays] = useState(null);

    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('bmiHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const resultRef = useRef(null);

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
        setTargetWeight('');
        setBmi(null);
        setBmr(null);
        setTdee(null);
        setGoalDays(null);
        setCategory('');
    }

    const toggleUnit = () => {
        setUnit(unit === 'metric' ? 'imperial' : 'metric');
        resetInputs();
    }

    const handleDownload = () => {
        if (resultRef.current) {
            html2canvas(resultRef.current, { 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                scale: 2 // Improve quality
            }).then((canvas) => {
                const link = document.createElement('a');
                link.download = 'My_Fitness_Report.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
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
        let finalTdee = null;

        if (parsedAge && parsedWeight && heightInCM) {
            let bmrValue = (10 * parsedWeight) + (6.25 * heightInCM) - (5 * parsedAge);
            bmrValue += (gender === 'male' ? 5 : -161);
            setBmr(Math.round(bmrValue));
            finalTdee = Math.round(bmrValue * parseFloat(activity));
            setTdee(finalTdee);
        }

        // Weight Goal Projection (500 kcal deficit/surplus per day = ~0.45kg change per week)
        if (targetWeight && finalTdee) {
            const target = parseFloat(targetWeight);
            const diffKg = parsedWeight - target; 
            
            // 7700 kcal per kg of body fat.
            // With a safe 500 kcal daily gap, 1kg takes ~15.4 days.
            if (Math.abs(diffKg) > 0.1) {
                const totalKcal = Math.abs(diffKg) * 7700;
                const days = Math.ceil(totalKcal / 500); 
                setGoalDays({
                    days: days,
                    type: diffKg > 0 ? 'Lose' : 'Gain',
                    diff: Math.abs(diffKg).toFixed(1)
                });
            } else {
                setGoalDays({ days: 0, type: 'Maintain', diff: 0 });
            }
        }

        const newRecord = {
            date: new Date().toLocaleDateString(), // simplified date for chart
            fullDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            bmi: parseFloat(finalBmi),
            category: cat
        };
        
        // Prevent duplicate spamming
        if (history.length > 0 && history[0].bmi === parseFloat(finalBmi) && history[0].date === newRecord.date) return;

        setHistory([newRecord, ...history].slice(0, 10)); // Keep last 10 for better charting
    };

    // Data reversed for chart so it flows chronologically left to right
    const chartData = [...history].reverse();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.section 
            className={`container-main ${theme === 'dark' ? 'dark-mode-container' : ''}`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Theme Toggle Button */}
            <motion.div className="theme-toggle-container" variants={itemVariants}>
                <motion.button 
                    className="theme-toggle" 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </motion.button>
            </motion.div>

            <aside className='container-form'>
                <motion.div className="formContainer2" variants={itemVariants}>
                    <h1>Calculate Your <br /> Body Metrics</h1>
                    <p>Body mass index (BMI) is a measure of body fat. Combined with your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE), you can gain a complete picture of your daily caloric needs, track your history, and set precise weight targets.</p>
                    
                    <AnimatePresence>
                        {history.length > 0 && (
                            <motion.div 
                                className="history-section"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h3>Progress Chart</h3>
                                <div className="chart-container" style={{ width: '100%', height: 180 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <Line type="monotone" dataKey="bmi" stroke="#67e5fb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" opacity={0.3} />
                                            <XAxis dataKey="date" tick={{fontSize: 10, fill: theme === 'dark' ? '#cbd5e1' : '#6b7280'}} />
                                            <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: theme === 'dark' ? '#cbd5e1' : '#6b7280'}} />
                                            <RechartsTooltip 
                                                contentStyle={{ backgroundColor: theme === 'dark' ? '#3f3f5a' : '#fff', borderRadius: '8px', border: 'none' }}
                                                itemStyle={{ color: '#67e5fb', fontWeight: 'bold' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <ul className="history-list">
                                    {history.slice(0, 3).map((item, idx) => (
                                        <motion.li 
                                            key={idx}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <span className="history-date">{item.fullDate}</span>
                                            <span className="history-bmi">{item.bmi}</span>
                                            <span className={`history-cat ${item.category.toLowerCase()}`}>{item.category}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                                <motion.button 
                                    className="clear-btn" 
                                    onClick={clearHistory}
                                    whileHover={{ backgroundColor: '#dc2626' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Clear History
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div className='fromContainer1' variants={itemVariants}>
                    <div className="unit-toggle">
                        <motion.button 
                            type="button" 
                            className={unit === 'metric' ? 'active' : ''} 
                            onClick={unit !== 'metric' ? toggleUnit : undefined}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Metric
                        </motion.button>
                        <motion.button 
                            type="button" 
                            className={unit === 'imperial' ? 'active' : ''} 
                            onClick={unit !== 'imperial' ? toggleUnit : undefined}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Imperial
                        </motion.button>
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

                        {/* Weight & Target Row */}
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="weight">Current Weight: </label>
                                <input type="number" id="weight" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                            </div>
                            <div className="form-group half-width">
                                <label>Target Weight (Opt):</label>
                                <input type="number" placeholder="Goal (kg)" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} />
                            </div>
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

                        <motion.button 
                            className="calc-btn" 
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Calculate Metrics
                        </motion.button>
                    </form>

                    <AnimatePresence>
                        {bmi && (
                            <motion.div 
                                className="result-wrapper"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <div className="result" id="calc-result-area" ref={resultRef}>
                                    <h2>
                                        Your BMI: {bmi}
                                        <span className={`category ${category.toLowerCase()}`}>
                                            ( {category} )
                                        </span>
                                    </h2>
                                    
                                    <div className="gauge-container">
                                        <div className="gauge-bar">
                                            <motion.div 
                                                className={`gauge-segment underweight-bg ${category === 'Underweight' ? 'active-segment' : ''}`}
                                                initial={{ scaleY: 0.3 }}
                                                animate={{ scaleY: category === 'Underweight' ? 1.3 : 1 }}
                                            ></motion.div>
                                            <motion.div 
                                                className={`gauge-segment normal-bg ${category === 'Normal' ? 'active-segment' : ''}`}
                                                initial={{ scaleY: 0.3 }}
                                                animate={{ scaleY: category === 'Normal' ? 1.3 : 1 }}
                                            ></motion.div>
                                            <motion.div 
                                                className={`gauge-segment overweight-bg ${category === 'Overweight' ? 'active-segment' : ''}`}
                                                initial={{ scaleY: 0.3 }}
                                                animate={{ scaleY: category === 'Overweight' ? 1.3 : 1 }}
                                            ></motion.div>
                                            <motion.div 
                                                className={`gauge-segment obesity-bg ${category === 'Obesity' ? 'active-segment' : ''}`}
                                                initial={{ scaleY: 0.3 }}
                                                animate={{ scaleY: category === 'Obesity' ? 1.3 : 1 }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                    
                                    {bmr && (
                                        <motion.div 
                                            className="metabolic-stats"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <div className="stat-box">
                                                <span className="stat-label">BMR</span>
                                                <span className="stat-value">{bmr} <small>kcal</small></span>
                                            </div>
                                            <div className="stat-box">
                                                <span className="stat-label">TDEE</span>
                                                <span className="stat-value">{tdee} <small>kcal</small></span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {goalDays && goalDays.days > 0 && (
                                        <motion.div 
                                            className="goal-box"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <div className="goal-icon">🎯</div>
                                            <div className="goal-text">
                                                To <strong>{goalDays.type.toLowerCase()} {goalDays.diff} kg</strong>, it will take roughly <strong>{goalDays.days} days</strong> at a safe pace of 0.45kg/week (500 kcal daily {goalDays.type === 'Lose' ? 'deficit' : 'surplus'}).
                                            </div>
                                        </motion.div>
                                    )}
                                    {goalDays && goalDays.days === 0 && (
                                        <motion.div 
                                            className="goal-box success"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <div className="goal-icon">✅</div>
                                            <div className="goal-text">
                                                You are already at your target weight! Maintain your TDEE of {tdee} kcal to stay here.
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.div 
                                        className="smart-tips"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <strong>💡 Tip:</strong> {getSmartTips(category)}
                                    </motion.div>
                                </div>

                                <motion.button 
                                    className="download-btn" 
                                    onClick={handleDownload}
                                    whileHover={{ scale: 1.05, backgroundColor: '#16a34a' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    📷 Download Report
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </aside>

            <aside className="container-table">
                <motion.div className="tableContainer" variants={itemVariants}>
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
                </motion.div>

                <motion.div className="containerButton" variants={itemVariants}>
                    <h2>To Know More <br /> Click the Below Button</h2>
                    <motion.a 
                        href={chart}
                        whileHover={{ scale: 1.1, backgroundColor: 'white' }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Click
                    </motion.a>
                </motion.div>
            </aside>
        </motion.section>
    )
}

export default Calculator
