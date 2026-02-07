
import { testData } from '../data/questions';

// Service to fetch questions from Open Trivia DB API

const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Shared helper to fetch and normalize
// Shared helper to fetch and normalize
const fetchQuestionsFromOpenTDB = async (amount, category, difficulty = 'medium', retry = false) => {
    try {
        const type = 'multiple';
        let url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=${type}`;

        // Only append difficulty if it is set
        if (difficulty) {
            url += `&difficulty=${difficulty}`;
        }

        console.log(`Fetching questions from: ${url}`);

        const response = await fetch(url);
        const data = await response.json();

        if (data.response_code !== 0) {
            console.warn(`API returned code ${data.response_code} for difficulty '${difficulty}'.`);

            // Code 5: Rate Limit
            if (data.response_code === 5) {
                console.warn("Rate limited. Waiting 2 seconds...");
                await new Promise(resolve => setTimeout(resolve, 2000));
                return fetchQuestionsFromOpenTDB(amount, category, difficulty, retry);
            }

            // Code 1: No Results. Try fallback if we haven't already retried.
            if (data.response_code === 1 && !retry && difficulty !== '') {
                console.log("Attempting fallback with ANY difficulty...");
                return fetchQuestionsFromOpenTDB(amount, category, '', true);
            }

            return [];
        }

        return (data.results || []).map((item, index) => {
            // Combine correct and incorrect answers and shuffle
            const allOptions = [...item.incorrect_answers, item.correct_answer];
            const shuffledOptions = shuffleArray([...allOptions]);

            // Find the new index of the correct answer
            const correctIndex = shuffledOptions.indexOf(item.correct_answer);

            // Decode HTML entities in text
            const decodedQuestion = decodeHtml(item.question);
            const decodedOptions = shuffledOptions.map(opt => decodeHtml(opt));

            return {
                id: index + 1, // Assign a temporary ID
                question: decodedQuestion,
                options: decodedOptions,
                correctAnswer: correctIndex
            };
        });

    } catch (error) {
        console.error("Failed to fetch questions:", error);
        return [];
    }
};

import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const getCategoryForTestId = async (testId) => {
    // Static Mappings
    if (testId === "1") return 19; // Math
    if (["2", "5", "8", "9"].includes(testId)) return 18; // Computers

    // Dynamic Lookup from Firestore
    try {
        const docRef = doc(db, 'tests', testId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Map 'type' to API Category
            if (data.type === 'aptitude') return 19; // Math
            if (data.type === 'coding') return 18; // Computers
            if (data.type === 'mixed') return ''; // Any
        }
    } catch (e) {
        console.warn("Error fetching dynamic test category:", e);
    }

    return 18; // Default fallback
};

export const fetchQuestions = async (testId, amount = 10, difficulty = 'medium') => {
    // 1. Try to fetch dynamic test configuration from Firestore
    try {
        const testRef = doc(db, 'tests', String(testId));
        const testSnap = await getDoc(testRef);

        if (testSnap.exists()) {
            const testData = testSnap.data();

            // Check if test has specific question IDs assigned
            if (testData.questions && Array.isArray(testData.questions) && testData.questions.length > 0) {
                console.log(`Loading ${testData.questions.length} assigned questions for test ${testId}`);

                // Fetch the actual question documents
                // Note: Firestore 'in' query supports max 10 items. For more, we need parallel fetching.
                // We'll use parallel individual fetches or chunks.
                const questionPromises = testData.questions.map(qId => getDoc(doc(db, 'questions', qId)));
                const questionSnaps = await Promise.all(questionPromises);

                const loadedQuestions = questionSnaps
                    .filter(snap => snap.exists())
                    .map((snap, index) => {
                        const data = snap.data();

                        // Normalize specific question format to TestPage format
                        // Firestore 'questions' collection usually has: question, options[], correctAnswer(string), explanation

                        // Detect correct answer index
                        const options = data.options || [];
                        let correctIndex = -1;
                        if (data.correctAnswer) {
                            // Try exact match
                            correctIndex = options.indexOf(data.correctAnswer);
                            // Fallback if correctAnswer is stored as 'Option 1' etc? Unlikely based on our form.
                        }

                        return {
                            id: snap.id,
                            question: data.question,
                            options: options,
                            correctAnswer: correctIndex, // TestPage expects index
                            explanation: data.explanation,
                            topic: data.topic
                        };
                    });

                return loadedQuestions;
            }
        }
    } catch (e) {
        console.warn("Error fetching test config, falling back to API logic:", e);
    }

    // 2. Fallback to OpenTDB API logic (Existing Code)
    // Determine Category (Static or Dynamic)
    const category = await getCategoryForTestId(String(testId));

    // Map UI difficulty to API difficulty
    let apiDifficulty = 'medium';
    const lowerDiff = difficulty ? difficulty.toLowerCase() : 'medium';

    if (lowerDiff === 'beginner') apiDifficulty = 'easy';
    else if (lowerDiff === 'advanced') apiDifficulty = 'hard';
    else if (lowerDiff === 'medium') apiDifficulty = 'medium';

    // Pass the mapped apiDifficulty
    return fetchQuestionsFromOpenTDB(amount, category, apiDifficulty);
};
