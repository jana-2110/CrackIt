import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

// Assembly language support might need a separate plugin or generic highlighting if not included in standard bundle
// We will try importing 'nasm' if available, otherwise fallback to clike or plain text
import 'prismjs/components/prism-nasm';
import { executeCode } from '../services/piston';
import alasql from 'alasql';
import { LEETCODE_PROBLEMS } from '../data/problems';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const PracticePage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('javascript');
    const [output, setOutput] = useState([]);
    const [sqlResult, setSqlResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [stdin, setStdin] = useState("");
    const [solvedProblems, setSolvedProblems] = useState(new Set());

    useEffect(() => {
        if (currentUser) {
            const fetchSolved = async () => {
                const docRef = doc(db, 'users', currentUser.uid, 'practice', 'solved');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSolvedProblems(new Set(docSnap.data().ids || []));
                }
            };
            fetchSolved();
        }
    }, [currentUser]);

    const markAsSolved = async (problemId) => {
        if (!currentUser) {
            alert("Please login to track progress!");
            return;
        }
        try {
            const newSolved = new Set(solvedProblems);
            newSolved.add(problemId);
            setSolvedProblems(newSolved);

            const docRef = doc(db, 'users', currentUser.uid, 'practice', 'solved');
            await setDoc(docRef, {
                ids: arrayUnion(problemId),
                lastUpdated: new Date()
            }, { merge: true });

        } catch (error) {
            console.error("Error saving progress:", error);
        }
    };

    useEffect(() => {
        // Initialize AlaSQL Database with comprehensive mock data for LeetCode problems
        alasql("CREATE TABLE IF NOT EXISTS Person (personId INT, firstName STRING, lastName STRING)");
        alasql("CREATE TABLE IF NOT EXISTS Address (addressId INT, personId INT, city STRING, state STRING)");
        alasql("CREATE TABLE IF NOT EXISTS Employee (id INT, name STRING, salary INT, managerId INT, departmentId INT)");
        alasql("CREATE TABLE IF NOT EXISTS Department (id INT, name STRING)");
        alasql("CREATE TABLE IF NOT EXISTS Customers (id INT, name STRING)");
        alasql("CREATE TABLE IF NOT EXISTS Orders (id INT, customerId INT)");
        alasql("CREATE TABLE IF NOT EXISTS Scores (id INT, score DECIMAL(5,2))");
        alasql("CREATE TABLE IF NOT EXISTS Logs (id INT, num INT)");
        alasql("CREATE TABLE IF NOT EXISTS Weather (id INT, recordDate DATE, temperature INT)");
        alasql("CREATE TABLE IF NOT EXISTS Cinema (id INT, movie STRING, description STRING, rating DECIMAL(3,1))");
        alasql("CREATE TABLE IF NOT EXISTS World (name STRING, continent STRING, area INT, population INT, gdp INT)");
        alasql("CREATE TABLE IF NOT EXISTS Salary (id INT, name STRING, sex STRING, salary INT)");

        // Populate Person & Address (Combine Two Tables)
        if (alasql("SELECT * FROM Person").length === 0) {
            alasql("INSERT INTO Person VALUES (1, 'Wang', 'Allen'), (2, 'Alice', 'Bob')");
            alasql("INSERT INTO Address VALUES (1, 2, 'New York City', 'New York'), (2, 3, 'Leetcode', 'California')");
        }

        // Populate Employee & Department (High Earner, Managers)
        if (alasql("SELECT * FROM Employee").length === 0) {
            alasql("INSERT INTO Employee VALUES (1, 'Joe', 70000, 3, 1), (2, 'Henry', 80000, 4, 1), (3, 'Sam', 60000, NULL, 1), (4, 'Max', 90000, NULL, 1), (5, 'Janet', 69000, 1, 1), (6, 'Randy', 85000, 1, 1)");
            alasql("INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales')");
        }

        // Populate Customers & Orders (Customers Who Never Order)
        if (alasql("SELECT * FROM Customers").length === 0) {
            alasql("INSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max')");
            alasql("INSERT INTO Orders VALUES (1, 3), (2, 1)");
        }

        // Populate Scores (Rank Scores)
        if (alasql("SELECT * FROM Scores").length === 0) {
            alasql("INSERT INTO Scores VALUES (1, 3.50), (2, 3.65), (3, 4.00), (4, 3.85), (5, 4.00), (6, 3.65)");
        }

        // Populate Logs (Consecutive Numbers)
        if (alasql("SELECT * FROM Logs").length === 0) {
            alasql("INSERT INTO Logs VALUES (1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 2), (7, 2)");
        }

        // Populate Weather (Rising Temperature)
        if (alasql("SELECT * FROM Weather").length === 0) {
            alasql("INSERT INTO Weather VALUES (1, '2015-01-01', 10), (2, '2015-01-02', 25), (3, '2015-01-03', 20), (4, '2015-01-04', 30)");
        }

        // Populate Cinema (Not Boring Movies)
        if (alasql("SELECT * FROM Cinema").length === 0) {
            alasql("INSERT INTO Cinema VALUES (1, 'War', 'great 3D', 8.9), (2, 'Science', 'fiction', 8.5), (3, 'irish', 'boring', 6.2), (4, 'Ice Song', 'Fantacy', 8.6), (5, 'House card', 'Interesting', 9.1)");
        }

        // Populate World (Big Countries)
        if (alasql("SELECT * FROM World").length === 0) {
            alasql("INSERT INTO World VALUES ('Afghanistan', 'Asia', 652230, 25500100, 20343000), ('Albania', 'Europe', 28748, 2831741, 12960000), ('Algeria', 'Africa', 2381741, 37100000, 188681000)");
        }

        // Populate Salary (Swap Salary)
        if (alasql("SELECT * FROM Salary").length === 0) {
            alasql("INSERT INTO Salary VALUES (1, 'A', 'm', 2500), (2, 'B', 'f', 1500), (3, 'C', 'm', 5500), (4, 'D', 'f', 500)");
        }

    }, []);

    // Code State
    const [codeState, setCodeState] = useState({
        javascript: '// Write your JavaScript here\nconsole.log("Hello World!");\n',
        sql: '-- Write your SQL query here\nSELECT * FROM users;',
        python: '# Write your Python code here\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")',
        c: '#include <stdio.h>\n\nint main() {\n    char name[50];\n    printf("Enter your name: ");\n    scanf("%s", name);\n    printf("Hello %s!\\n", name);\n    return 0;\n}',
        cpp: '#include <iostream>\n\nint main() {\n    int num;\n    std::cout << "Enter a number: ";\n    std::cin >> num;\n    std::cout << "You entered: " << num << std::endl;\n    return 0;\n}',
        java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.println("Enter word:");\n        String word = scanner.next();\n        System.out.println("Echo: " + word);\n    }\n}',
        assembly: 'section .data\n    msg db "Hello from Assembly!", 0\n\nsection .text\n    global _start\n\n_start:\n    mov rax, 1      ; sys_write\n    mov rdi, 1      ; stdout\n    mov rsi, msg    ; message to write\n    mov rdx, 20     ; message length\n    syscall         ; call kernel\n\n    mov rax, 60     ; sys_exit\n    xor rdi, rdi    ; exit code 0\n    syscall         ; call kernel'
    });

    const basicsData = {
        javascript: [
            { id: 1, question: "Print 'Hello World' to the console.", hint: "console.log('Hello World');", difficulty: "Beginner" },
            { id: 2, question: "Create a loop that prints 1 to 5.", hint: "for(let i=1; i<=5; i++) console.log(i);", difficulty: "Beginner" },
            { id: 3, question: "Declare a constant variable named PI.", hint: "const PI = 3.14159;", difficulty: "Beginner" },
            { id: 4, question: "Create a function that adds two numbers.", hint: "function add(a, b) { return a + b; }", difficulty: "Beginner" }
        ],
        sql: [
            { id: 1, question: "Select all users with the role 'Admin'.", hint: "SELECT * FROM users WHERE role = 'Admin';", difficulty: "Beginner" },
            { id: 2, question: "Find the email of the user with ID 1.", hint: "SELECT email FROM users WHERE id = 1;", difficulty: "Beginner" },
            { id: 3, question: "Count the total number of users.", hint: "SELECT COUNT(*) FROM users;", difficulty: "Beginner" },
            { id: 4, question: "List users named 'Bob'.", hint: "SELECT * FROM users WHERE name = 'Bob';", difficulty: "Beginner" }
        ],
        python: [
            { id: 1, question: "Print 'Hello Python'.", hint: "print('Hello Python')", difficulty: "Beginner" },
            { id: 2, question: "Create a list with numbers 1, 2, 3.", hint: "my_list = [1, 2, 3]", difficulty: "Beginner" },
            { id: 3, question: "Write a function to square a number.", hint: "def square(n):\n    return n * n", difficulty: "Beginner" },
            { id: 4, question: "Loop through specific range.", hint: "for i in range(5):\n    print(i)", difficulty: "Beginner" }
        ],
        c: [
            { id: 1, question: "Print 'Hello C'", hint: "printf(\"Hello C\");", difficulty: "Beginner" },
            { id: 2, question: "Declare an integer variable.", hint: "int myNum = 15;", difficulty: "Beginner" },
            { id: 3, question: "Create a simple main function.", hint: "int main() {\n  return 0;\n}", difficulty: "Beginner" }
        ],
        cpp: [
            { id: 1, question: "Output 'Hello C++' using cout.", hint: "std::cout << \"Hello C++\";", difficulty: "Beginner" },
            { id: 2, question: "Include the IO stream library.", hint: "#include <iostream>", difficulty: "Beginner" },
            { id: 3, question: "Create a class named 'MyClass'.", hint: "class MyClass {\n  public:\n    int x;\n};", difficulty: "Beginner" }
        ],
        java: [
            { id: 1, question: "Print to system output.", hint: "System.out.println(\"Hello\");", difficulty: "Beginner" },
            { id: 2, question: "Declare a public class Main.", hint: "public class Main {\n}", difficulty: "Beginner" },
            { id: 3, question: "Write a standard main method.", hint: "public static void main(String[] args) {\n}", difficulty: "Beginner" }
        ],
        assembly: [
            { id: 1, question: "Define a data section.", hint: "section .data", difficulty: "Beginner" },
            { id: 2, question: "Move a value into the EAX register.", hint: "mov eax, 1", difficulty: "Beginner" },
            { id: 3, question: "Create a label for the start.", hint: "_start:", difficulty: "Beginner" }
        ]
    };

    // Helper for sorting
    const difficultyOrder = { 'Beginner': 0, 'Easy': 1, 'Medium': 2, 'Hard': 3 };

    // Merge Basics with LeetCode Problems and Sort
    const challengesData = {};
    const allLanguages = [...new Set([...Object.keys(basicsData), ...Object.keys(LEETCODE_PROBLEMS)])];

    allLanguages.forEach(lang => {
        const basics = basicsData[lang] || [];
        const leetcode = LEETCODE_PROBLEMS[lang] || [];
        challengesData[lang] = [...basics, ...leetcode].sort((a, b) => {
            return (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99);
        });
    });

    const handleCodeChange = (newCode) => {
        setCodeState(prev => ({ ...prev, [activeTab]: newCode }));
    };

    const runCode = async () => {
        setOutput([]);
        setSqlResult(null);

        if (activeTab === 'javascript') {
            const originalConsoleLog = console.log;
            const logs = [];
            console.log = (...args) => {
                logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
            };

            try {
                // eslint-disable-next-line no-eval
                const result = eval(codeState.javascript);
                if (result !== undefined) {
                    logs.push(`\nReturn Value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
                }
            } catch (error) {
                logs.push(`Error: ${error.message}`);
            } finally {
                console.log = originalConsoleLog;
                setOutput(logs.length > 0 ? logs : ['Execution completed (No output)']);
            }
        } else if (activeTab === 'sql') {
            runSqlMock();
        } else {
            // Real execution via Piston API
            setIsRunning(true);
            setOutput(['Compiling and executing...']);

            try {
                const result = await executeCode(activeTab, codeState[activeTab], stdin);
                if (result.run) {
                    const logs = [];
                    if (result.run.stdout) logs.push(result.run.stdout);
                    if (result.run.stderr) logs.push(`Error:\n${result.run.stderr}`);
                    if (result.run.output) logs.push(result.run.output); // Fallback

                    setOutput(logs.length > 0 ? logs : ['Execution completed with no output.']);
                } else {
                    setOutput(['Error: Failed to execute code.']);
                }
            } catch (error) {
                setOutput([`Error: ${error.message}`]);
            } finally {
                setIsRunning(false);
            }
        }
    };

    const runSqlMock = () => {
        const query = codeState.sql.trim();
        let result = [];
        let error = null;

        try {
            const rawResult = alasql(query);

            if (Array.isArray(rawResult)) {
                result = rawResult;
            } else if (typeof rawResult === 'object' || typeof rawResult === 'number') {
                result = [{ message: `Query executed successfully. Result: ${JSON.stringify(rawResult)}` }];
            }

        } catch (err) {
            error = err.message;
        }

        setSqlResult(result.length > 0 ? result : null);

        if (error) {
            setOutput([`SQL Error: ${error}`]);
        } else if (result.length === 0) {
            setOutput(['Query executed successfully but returned no results.']);
        }
    };

    const getHighlighter = () => {
        switch (activeTab) {
            case 'javascript': return languages.js;
            case 'sql': return languages.sql;
            case 'python': return languages.python;
            case 'c': return languages.c;
            case 'cpp': return languages.cpp;
            case 'java': return languages.java;
            case 'assembly': return languages.nasm || languages.clike;
            default: return languages.clike;
        }
    };

    const tabs = [
        { id: 'javascript', label: 'JavaScript' },
        { id: 'sql', label: 'SQL' },
        { id: 'python', label: 'Python' },
        { id: 'c', label: 'C' },
        { id: 'cpp', label: 'C++' },
        { id: 'java', label: 'Java' },
        { id: 'assembly', label: 'Assembly' }
    ];

    const resetCode = () => {
        const defaults = {
            javascript: '// Write your JavaScript here\nconsole.log("Hello World!");\n',
            sql: '-- Write your SQL query here\nSELECT * FROM users;',
            python: '# Write your Python code here\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")',
            c: '#include <stdio.h>\n\nint main() {\n    char name[50];\n    printf("Enter your name: ");\n    scanf("%s", name);\n    printf("Hello %s!\\n", name);\n    return 0;\n}',
            cpp: '#include <iostream>\n\nint main() {\n    int num;\n    std::cout << "Enter a number: ";\n    std::cin >> num;\n    std::cout << "You entered: " << num << std::endl;\n    return 0;\n}',
            java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.println("Enter word:");\n        String word = scanner.next();\n        System.out.println("Echo: " + word);\n    }\n}',
            assembly: 'section .data\n    msg db "Hello from Assembly!", 0\n\nsection .text\n    global _start\n\n_start:\n    mov rax, 1      ; sys_write\n    mov rdi, 1      ; stdout\n    mov rsi, msg    ; message to write\n    mov rdx, 20     ; message length\n    syscall         ; call kernel\n\n    mov rax, 60     ; sys_exit\n    xor rdi, rdi    ; exit code 0\n    syscall         ; call kernel'
        };
        handleCodeChange(defaults[activeTab]);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 bg-gray-50 dark:bg-brand-dark container mx-auto transition-colors duration-300">
            {/* Headers and Tabs ... */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">Practice Arena</h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Write code, run queries, and experiment using Piston & AlaSQL.</p>
            </div>

            {/* Scrollable Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap pb-2 px-4 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-brand-primary border-b-2 border-brand-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Challenges Section */}
            {challengesData[activeTab] && (
                <div className="mb-8 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 animate-fade-in">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center capitalize text-sm md:text-base">
                        {activeTab} Challenges
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {challengesData[activeTab].map(challenge => (
                            <div key={challenge.id} className={`bg-white dark:bg-slate-800 p-3 rounded shadow-sm border ${solvedProblems.has(challenge.id) ? 'border-green-500/50 ring-1 ring-green-500/20' : 'border-gray-100 dark:border-gray-700'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex-grow mr-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{challenge.question}</p>
                                            {solvedProblems.has(challenge.id) && (
                                                <span className="text-xs text-green-500 font-bold flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    Solved
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                                            ${challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                            ${challenge.difficulty === 'Easy' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                            ${challenge.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                                            ${challenge.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                                        `}>
                                            {challenge.difficulty || 'Easy'}
                                        </span>

                                        {!solvedProblems.has(challenge.id) && (
                                            <button
                                                onClick={() => markAsSolved(challenge.id)}
                                                className="text-[10px] bg-gray-100 dark:bg-gray-700 hover:bg-green-500 hover:text-white px-2 py-1 rounded transition-colors"
                                            >
                                                Mark Solved
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-1 flex flex-col space-y-1">
                                    <details className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                                        <summary className="hover:text-brand-primary">Show Hint</summary>
                                        <code className="block mt-1 bg-gray-100 dark:bg-slate-900 p-1 rounded font-mono whitespace-pre-wrap">{challenge.hint}</code>
                                    </details>
                                    {challenge.solution && (
                                        <details className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                                            <summary className="hover:text-green-500 text-green-600 dark:text-green-400 font-medium">Show Solution</summary>
                                            <div className="mt-1 bg-gray-900 text-gray-200 p-2 rounded font-mono whitespace-pre-wrap text-[10px] overflow-x-auto border border-gray-700">
                                                {challenge.solution}
                                            </div>
                                        </details>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Editor Section */}
                <div className="flex flex-col h-[500px]">
                    <div className="bg-gray-800 rounded-t-lg p-2 flex justify-between items-center">
                        <span className="text-gray-400 text-xs ml-2 uppercase font-mono">{activeTab}</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={resetCode}
                                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className={`px-4 py-1 rounded text-sm font-bold transition-colors ${isRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white`}
                            >
                                {isRunning ? 'Running...' : 'Run'}
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow bg-[#1d1f21] overflow-auto rounded-b-lg border border-gray-700 shadow-xl font-mono text-sm leading-relaxed relative">
                        <Editor
                            value={codeState[activeTab]}
                            onValueChange={handleCodeChange}
                            highlight={code => highlight(code, getHighlighter())}
                            padding={15}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 14,
                                minHeight: '100%',
                                color: '#c5c8c6'
                            }}
                            className="h-full min-h-full"
                        />
                    </div>
                </div>

                {/* Output Section */}
                <div className="flex flex-col h-[500px]">
                    <div className="bg-gray-100 dark:bg-slate-800 rounded-t-lg p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Output / Terminal</h3>
                    </div>

                    {/* Standard Input Field (Visible only for compiled languages + python) */}
                    {['python', 'c', 'cpp', 'java', 'assembly'].includes(activeTab) && (
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-2 border-b border-gray-200 dark:border-gray-700">
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Standard Input (stdin)</label>
                            <textarea
                                value={stdin}
                                onChange={(e) => setStdin(e.target.value)}
                                placeholder="Enter input for your program here (e.g., numbers, text)..."
                                className="w-full text-xs p-2 rounded bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-brand-primary h-16 font-mono text-gray-700 dark:text-gray-300"
                            />
                        </div>
                    )}

                    <div className="flex-grow bg-white dark:bg-slate-900 overflow-auto rounded-b-lg border border-gray-200 dark:border-gray-700 shadow-inner p-4 font-mono text-sm">
                        {/* SQL Result Table */}
                        {activeTab === 'sql' && sqlResult ? (
                            <div className="overflow-x-auto">
                                <div className="text-xs text-green-600 dark:text-green-400 mb-2">Query successful ({sqlResult.length} rows)</div>
                                <table className="min-w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b dark:border-gray-700">
                                            {Object.keys(sqlResult[0]).map(key => (
                                                <th key={key} className="py-2 px-3 font-semibold text-gray-600 dark:text-gray-400 uppercase">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sqlResult.map((row, i) => (
                                            <tr key={i} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                                {Object.values(row).map((val, j) => (
                                                    <td key={j} className="py-2 px-3 text-gray-800 dark:text-gray-300">{val}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // Console Output
                            output.length > 0 ? (
                                output.map((log, i) => (
                                    <div key={i} className="mb-1 text-gray-800 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-1 last:border-0 whitespace-pre-wrap">
                                        <span className="text-gray-400 select-none mr-2">&gt;</span>
                                        {log}
                                    </div>
                                ))
                            ) : (
                                <div className="space-y-4">
                                    <span className="text-gray-400 italic">Ready to execute...</span>
                                    {activeTab === 'sql' && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-xs text-blue-800 dark:text-blue-300 mt-4">
                                            <p className="font-bold mb-2">Mock Schema: users</p>
                                            <p>Columns: id, name, email, role</p>
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticePage;
