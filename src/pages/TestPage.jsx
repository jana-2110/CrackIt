import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import QuestionPalette from '../components/QuestionPalette';
import TestStartScreen from '../components/TestStartScreen';
import useTestLogic from '../hooks/useTestLogic';
import { testData } from '../data/questions';

const TestPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const difficultyLevel = queryParams.get('level');


    // State for test initialization
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [testTitle, setTestTitle] = useState("");
    const [timeLimit, setTimeLimit] = useState(30);
    const [hasStarted, setHasStarted] = useState(false);

    // Initial load of test data
    useEffect(() => {
        const loadTest = async () => {
            setLoading(true);
            try {
                // Import dynamically
                const { fetchQuestions } = await import('../services/questionService');

                // Determine difficulty (default to medium if not set)
                const level = difficultyLevel || 'Medium';

                // Fetch from API
                // We pass testId (e.g. "1", "2") and the service maps it to API categories
                const fetchedQuestions = await fetchQuestions(testId, 15, level);

                // Get static metadata for Title/Time (fallback)
                const staticData = testData[testId];
                const baseTitle = staticData ? staticData.title : `Test ${testId}`;
                let baseTime = staticData ? staticData.timeLimit : 20;

                // Fetch Global Override
                try {
                    const settingsRef = doc(db, 'settings', 'globalTestSettings');
                    const settingsSnap = await getDoc(settingsRef);
                    if (settingsSnap.exists() && settingsSnap.data().defaultTimeLimit) {
                        baseTime = settingsSnap.data().defaultTimeLimit;
                    }
                } catch (settingsErr) {
                    console.warn("Could not fetch global settings, using default time.", settingsErr);
                }

                if (fetchedQuestions.length > 0) {
                    setQuestions(fetchedQuestions);
                    setTestTitle(`${baseTitle} - ${level}`);
                    setTimeLimit(baseTime);
                } else {
                    console.warn("API returned no questions.");
                    // Optional: Fallback or Error state
                    setTestTitle(`${baseTitle} (Error loading)`);
                    setQuestions([]);
                }

            } catch (err) {
                console.error("Error loading test:", err);
            } finally {
                setLoading(false);
            }
        };

        loadTest();
    }, [testId, difficultyLevel]);

    const {
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        selectAnswer,
        calculateScore,
        markedForReview,
        toggleReview,
        visited
    } = useTestLogic();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Keyboard Shortcuts
    useEffect(() => {
        if (!hasStarted || isSubmitting) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'm' || e.key === 'M') toggleReview(currentQuestionIndex);

            const num = parseInt(e.key);
            const currentOptions = questions[currentQuestionIndex]?.options;
            if (!isNaN(num) && num >= 1 && num <= 4 && currentOptions && num <= currentOptions.length) {
                handleOptionSelect(num - 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasStarted, isSubmitting, currentQuestionIndex, questions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-800">
                <div className="text-center">
                    <svg className="animate-spin h-10 w-10 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your test...</p>
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return <div className="text-gray-800 dark:text-white text-center mt-20">Test not found or no questions available.</div>;
    }

    const handleOptionSelect = (optionIndex) => {
        selectAnswer(currentQuestionIndex, optionIndex);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishTest();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }

    const finishTest = async () => {
        if (isSubmitting) return; // Prevent double clicks

        setIsSubmitting(true);
        const score = calculateScore(questions);
        const total = questions.length;

        // Navigate immediately to result page. The ResultPage will handle saving the score.
        navigate('/result', { state: { score, total, testId, questions, answers } });
        // No need to set isSubmitting false as we are unmounting
    };

    const handleManualFinish = () => {
        if (window.confirm("Are you sure you want to end the test early?")) {
            finishTest();
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 py-8 max-w-7xl min-h-screen bg-white dark:bg-slate-800 transition-colors duration-300">
            <div className="sticky top-0 z-30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm py-4 border-b border-gray-200 dark:border-gray-700 transition-all">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{testTitle}</h1>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Test ID: {testId}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleManualFinish}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-md"
                    >
                        End Test
                    </button>
                    <Timer initialMinutes={timeLimit || 30} onTimeUp={finishTest} isRunning={hasStarted} />
                </div>
            </div>

            {!hasStarted && (
                <TestStartScreen
                    title={testTitle}
                    onStart={() => setHasStarted(true)}
                    rules={[
                        `You have ${timeLimit} minutes to complete the test.`,
                        "There is no negative marking.",
                        "You can flag questions for review and return to them later.",
                        "Use Arrow keys to navigate and Number keys (1-4) to answer.",
                        "Don't refresh the page or you may lose progress."
                    ]}
                />
            )}

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Question Area */}
                <div className="flex-grow">
                    <div className="mb-6">
                        <div className="flex space-x-2 mb-4">
                            {questions.map((_, idx) => {
                                let colorClass = 'bg-gray-200 dark:bg-slate-700';
                                if (idx === currentQuestionIndex) colorClass = 'bg-brand-primary ring-2 ring-brand-primary/40';
                                else if (markedForReview[idx]) colorClass = 'bg-yellow-400';
                                else if (answers[idx] !== undefined) colorClass = 'bg-green-500';

                                return (
                                    <div
                                        key={idx}
                                        className={`h-2 flex-grow rounded transition-all duration-300 ${colorClass}`}
                                    />
                                );
                            })}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">Question {currentQuestionIndex + 1} / {questions.length}</span>
                    </div>

                    <QuestionCard
                        question={questions[currentQuestionIndex].question}
                        options={questions[currentQuestionIndex].options}
                        selectedOption={answers[currentQuestionIndex]}
                        onOptionSelect={handleOptionSelect}
                        isMarked={markedForReview[currentQuestionIndex]}
                        onToggleReview={() => toggleReview(currentQuestionIndex)}
                    />

                    <div className="mt-8 flex justify-between">
                        <button
                            disabled={currentQuestionIndex === 0 || isSubmitting}
                            onClick={handlePrevious}
                            className="px-6 py-2 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 font-medium"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="px-6 py-2 rounded bg-brand-primary text-white hover:opacity-90 font-semibold shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'
                            )}
                        </button>
                    </div>
                </div>

                {/* Question Palette Sidebar - Hidden on mobile, or collapsible? For now, stacked at bottom on mobile */}
                <div className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0 order-last lg:order-none">
                    <div className="lg:sticky lg:top-24">
                        <QuestionPalette
                            totalQuestions={questions.length}
                            currentQuestionIndex={currentQuestionIndex}
                            onQuestionSelect={setCurrentQuestionIndex}
                            answers={answers}
                            markedForReview={markedForReview}
                            visited={visited}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPage;
