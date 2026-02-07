import { useState } from 'react';

export default function useTestLogic() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState({});
    const [visited, setVisited] = useState({ 0: true }); // Initialize first question as visited
    const [score, setScore] = useState(null);

    const selectAnswer = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const toggleReview = (questionId) => {
        setMarkedForReview(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const handleQuestionChange = (newIndex) => {
        setCurrentQuestionIndex(newIndex);
        setVisited(prev => ({ ...prev, [newIndex]: true }));
    };

    const calculateScore = (questions) => {
        let newScore = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                newScore += 1;
            }
        });
        setScore(newScore);
        return newScore;
    };

    return {
        currentQuestionIndex,
        setCurrentQuestionIndex: handleQuestionChange,
        answers,
        selectAnswer,
        markedForReview,
        toggleReview,
        visited,
        calculateScore,
        score
    };
}
