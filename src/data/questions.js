export const testData = {
    1: {
        title: "General Aptitude",
        timeLimit: 30, // 30 minutes
        questions: [
            // 1. Numbers
            { id: 101, category: "Numbers", question: "What is the unit digit in the product (784 × 618 × 917 × 463)?", difficulty: "Beginner", options: ["2", "3", "4", "5"], correctAnswer: 0, explanation: "Unit digit of 784 = 4, 618 = 8, 917 = 7, 463 = 3. Product = 4*8*7*3 = 672. Unit digit is 2." },
            { id: 102, category: "Numbers", question: "The sum of two numbers is 25 and their difference is 13. Find their product.", difficulty: "Beginner", options: ["104", "114", "315", "325"], correctAnswer: 1, explanation: "Let numbers be x and y. x+y=25, x-y=13. Adding gives 2x=38 -> x=19. Then y=6. Product = 19*6 = 114." },
            { id: 103, category: "Numbers", question: "Which of the following numbers is divisible by 3?", difficulty: "Medium", options: ["541326", "5967013", "34346", "381"], correctAnswer: 0, explanation: "Sum of digits of 541326 = 5+4+1+3+2+6 = 21, which is divisible by 3." },

            // 2. Percentage
            { id: 201, category: "Percentage", question: "What is 20% of 30% of 500?", difficulty: "Beginner", options: ["30", "50", "3", "300"], correctAnswer: 0, explanation: "20/100 * 30/100 * 500 = 1/5 * 3/10 * 500 = 30." },
            { id: 202, category: "Percentage", question: "If the price of a book is increased by 25%, by how much should it be reduced to restore the original price?", difficulty: "Medium", options: ["20%", "25%", "33%", "15%"], correctAnswer: 0, explanation: "Let price = 100. New price = 125. Reduction needed = 25. % Reduction = (25/125)*100 = 20%." },
            { id: 203, category: "Percentage", question: "In an election, a candidate who gets 84% of the votes is elected by a majority of 476 votes. What is the total number of votes polled?", difficulty: "Advanced", options: ["900", "810", "600", "700"], correctAnswer: 3, explanation: "Winner gets 84%, Loser gets 16%. Difference = 68%. 68% of Total = 476. Total = 476/0.68 = 700." },

            // 3. Profit and Loss
            { id: 301, category: "Profit and Loss", question: "A shopkeeper sells an article at a loss of 10%. If he had sold it for $10 more, he would have gained 10%. What is the cost price?", difficulty: "Medium", options: ["$40", "$50", "$60", "$100"], correctAnswer: 1 },
            { id: 302, category: "Profit and Loss", question: "By selling a watch for $144, a man loses 10%. At what price should he sell it to gain 10%?", difficulty: "Medium", options: ["$168", "$176", "$180", "$192"], correctAnswer: 1 },

            // 4. Average
            { id: 401, category: "Average", question: "The average age of 5 students is 20 years. If a new student aged 26 joins, what is the new average?", difficulty: "Beginner", options: ["21", "22", "20.5", "23"], correctAnswer: 0 },
            { id: 402, category: "Average", question: "The average of first 50 natural numbers is:", difficulty: "Beginner", options: ["25.30", "25.5", "25.00", "12.25"], correctAnswer: 1 },

            // 5. Ratio and Proportion
            { id: 501, category: "Ratio and Proportion", question: "If A:B = 2:3 and B:C = 4:5, then A:C is?", difficulty: "Medium", options: ["8:15", "6:10", "8:10", "2:5"], correctAnswer: 0 },
            { id: 502, category: "Ratio and Proportion", question: "Salaries of Ravi and Sumit are in the ratio 2:3. If the salary of each is increased by $4000, the new ratio becomes 40:57. What is Sumit's salary?", difficulty: "Advanced", options: ["$17000", "$20000", "$25500", "$38000"], correctAnswer: 3 },

            // 6. Mixture and Alligation
            { id: 601, category: "Mixture and Alligation", question: "In what ratio must rice at $9.30 per kg be mixed with rice at $10.80 per kg so that the mixture be worth $10 per kg?", difficulty: "Advanced", options: ["7:8", "8:7", "3:2", "4:3"], correctAnswer: 1 },
            { id: 602, category: "Mixture and Alligation", question: "A vessel contains 60 litres of milk. 12 litres of milk is taken out and replaced by water. Then 12 litres of mixture is taken out and replaced by water. The ratio of milk and water in the resultant mixture is:", difficulty: "Advanced", options: ["16:9", "15:10", "16:10", "9:5"], correctAnswer: 0 },

            // 7. Time and Work
            { id: 701, category: "Time and Work", question: "A and B together can do a piece of work in 15 days and A alone in 20 days. In how many days can B alone do it?", difficulty: "Medium", options: ["30 days", "40 days", "45 days", "60 days"], correctAnswer: 3 },
            { id: 702, category: "Time and Work", question: "A can complete a work in 12 days and B in 15 days. If they work together for 4 days, what fraction of work is left?", difficulty: "Advanced", options: ["2/5", "1/5", "3/5", "1/4"], correctAnswer: 0 },

            // 8. Time Speed Distance
            { id: 801, category: "Time Speed Distance", question: "If a train 100 m long crosses a bridge 200 m long in 20 seconds, what is the speed of the train?", difficulty: "Medium", options: ["36 km/hr", "45 km/hr", "54 km/hr", "60 km/hr"], correctAnswer: 2 },
            { id: 802, category: "Time Speed Distance", question: "A car covers a distance of 150 km in 3 hours. What is its speed?", difficulty: "Beginner", options: ["40 km/hr", "50 km/hr", "60 km/hr", "45 km/hr"], correctAnswer: 1 },

            // 9. Pipes and Cisterns
            { id: 901, category: "Pipes and Cisterns", question: "A pipe can fill a tank in 4 hours. Another pipe can empty it in 5 hours. If both are opened, how long will it take to fill the tank?", difficulty: "Advanced", options: ["10 hrs", "15 hrs", "20 hrs", "25 hrs"], correctAnswer: 2 },
            { id: 902, category: "Pipes and Cisterns", question: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both are used, how long will it take?", difficulty: "Medium", options: ["10 min", "12 min", "15 min", "25 min"], correctAnswer: 1 },

            // 10. Algebra
            { id: 1001, category: "Algebra", question: "If x + 1/x = 4, then x^2 + 1/x^2 is?", difficulty: "Medium", options: ["14", "16", "18", "12"], correctAnswer: 0 },
            { id: 1002, category: "Algebra", question: "The roots of the equation x^2 - 5x + 6 = 0 are:", difficulty: "Medium", options: ["2, 3", "1, 4", "3, 2", "5, 1"], correctAnswer: 0 },

            // 11. Trigonometry, Height, and Distance
            { id: 1101, category: "Trigonometry", question: "What is the value of Sin(30) + Cos(60)?", difficulty: "Beginner", options: ["0", "1", "0.5", "2"], correctAnswer: 1 },
            { id: 1102, category: "Trigonometry", question: "The angle of elevation of the top of a tower from a point on the ground, which is 30m away from the foot of the tower, is 30 degrees. Find the height of the tower.", difficulty: "Advanced", options: ["10m", "30m", "10√3m", "20m"], correctAnswer: 2 },

            // 12. Geometry
            { id: 1201, category: "Geometry", question: "If the perimeter of a square is 40cm, what is its area?", difficulty: "Beginner", options: ["400 sq cm", "100 sq cm", "1600 sq cm", "80 sq cm"], correctAnswer: 1 },
            { id: 1202, category: "Geometry", question: "The sum of interior angles of a triangle is:", difficulty: "Beginner", options: ["180", "360", "90", "270"], correctAnswer: 0 },

            // 13. Probability
            { id: 1301, category: "Probability", question: "What is the probability of picking a King from a deck of cards?", difficulty: "Beginner", options: ["1/13", "4/13", "1/52", "1/4"], correctAnswer: 0 },
            { id: 1302, category: "Probability", question: "In a throw of two dice, what is the probability of getting a sum of 9?", difficulty: "Medium", options: ["1/9", "4/9", "1/3", "1/12"], correctAnswer: 0 },

            // 14. Permutation and Combination(PnC)
            { id: 1401, category: "PnC", question: "In how many ways can the letters of the word 'LEADER' be arranged?", difficulty: "Advanced", options: ["72", "144", "360", "720"], correctAnswer: 2 },
            { id: 1402, category: "PnC", question: "How many ways can a team of 3 people be chosen from 5?", difficulty: "Medium", options: ["10", "20", "60", "15"], correctAnswer: 0 },

            // 15. Age
            { id: 1501, category: "Age", question: "The sum of ages of 3 people is 60. 5 years ago, their ages were in ratio 1:2:3. How old is the youngest now?", difficulty: "Advanced", options: ["10", "12.5", "15", "20"], correctAnswer: 1 },
            { id: 1502, category: "Age", question: "Father is aged three times more than his son Ronit. After 8 years, he would be two and a half times of Ronit's age. After further 8 years, how many times would he be of Ronit's age?", difficulty: "Advanced", options: ["2 times", "2.5 times", "3 times", "4 times"], correctAnswer: 0 },

            // 16. Blood Relations
            { id: 1601, category: "Blood Relations", question: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?", difficulty: "Medium", options: ["His own", "His Son", "His Father", "His Nephew"], correctAnswer: 1 },
            { id: 1602, category: "Blood Relations", question: "If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?", difficulty: "Medium", options: ["Brother", "Sister", "Nephew", "Cannot be determined"], correctAnswer: 3 },

            // 17. Clocks and Calendars
            { id: 1701, category: "Clocks", question: "At what time between 3 and 4 o'clock will the minute hand and the hour hand are on the same straight line but facing opposite directions?", difficulty: "Advanced", options: ["3:49 PM", "3:50 PM", "3:49 1/11 PM", "3:51 PM"], correctAnswer: 2 },
            { id: 1702, category: "Calendars", question: "It was Sunday on Jan 1, 2006. What was the day of the week Jan 1, 2010?", difficulty: "Medium", options: ["Sunday", "Saturday", "Friday", "Wednesday"], correctAnswer: 2 }
        ]
    },
    2: {
        title: "Technical Interview (Common)",
        timeLimit: 15, // 15 minutes
        questions: [
            {
                id: 1,
                question: "What is the time complexity of Binary Search on a sorted array of size N?",
                difficulty: "Beginner",
                options: ["O(N)", "O(N log N)", "O(log N)", "O(1)"],
                correctAnswer: 2
            },
            {
                id: 2,
                question: "Which data structure is used for Breadth First Search (BFS)?",
                difficulty: "Beginner",
                options: ["Stack", "Queue", "Heap", "Tree"],
                correctAnswer: 1
            },
            {
                id: 3,
                question: "Given an array `nums = [2, 7, 11, 15]`, target = 9. Two Sum problem using Hash Map has what time complexity?",
                difficulty: "Medium",
                options: ["O(N^2)", "O(N)", "O(log N)", "O(1)"],
                correctAnswer: 1
            },
            {
                id: 4,
                question: "What is the worst-case time complexity of Quick Sort?",
                difficulty: "Medium",
                options: ["O(N log N)", "O(N^2)", "O(N)", "O(log N)"],
                correctAnswer: 1
            },
            {
                id: 5,
                question: "Which data structure is primarily used to implement a recursive function call stack?",
                difficulty: "Beginner",
                options: ["Queue", "Heap", "Stack", "Binary Tree"],
                correctAnswer: 2
            },
            {
                id: 6,
                question: "What is the time complexity to insert an element into a Binary Search Tree (BST) in the worst case?",
                difficulty: "Medium",
                options: ["O(log N)", "O(1)", "O(N)", "O(N log N)"],
                correctAnswer: 2
            },
            {
                id: 7,
                question: "In a Hash Map, what handles the situation when two keys hash to the same index?",
                difficulty: "Medium",
                options: ["Rehashing", "Collision Resolution", "Resizing", "Sorting"],
                correctAnswer: 1
            },
            {
                id: 8,
                question: "Which sorting algorithm is known to be 'stable'?",
                difficulty: "Medium",
                options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
                correctAnswer: 2
            },
            {
                id: 9,
                question: "What does the 'Two Pointers' technique primarily help optimize?",
                difficulty: "Medium",
                options: ["Space Complexity", "Time Complexity", "Recursion Depth", "Code Readability"],
                correctAnswer: 1
            },
            {
                id: 10,
                question: "What is the space complexity of a recursive implementation of Depth First Search (DFS) on a tree?",
                difficulty: "Advanced",
                options: ["O(N)", "O(W) where W is width", "O(H) where H is height", "O(1)"],
                correctAnswer: 2
            },
            {
                id: 11,
                question: "Which algorithm is used to find the shortest path in a graph with non-negative edge weights?",
                difficulty: "Medium",
                options: ["Bellman-Ford", "Dijkstra's Algorithm", "Floyd-Warshall", "Prim's Algorithm"],
                correctAnswer: 1
            },
            {
                id: 12,
                question: "The 'Floyd's Cycle-Finding Algorithm' is used to detect a cycle in a:",
                difficulty: "Advanced",
                options: ["Array", "Binary Tree", "Linked List", "Hash Map"],
                correctAnswer: 2
            },
            {
                id: 13,
                question: "What is the primary advantage of a Trie data structure?",
                difficulty: "Advanced",
                options: ["Sorting numbers", "Prefix-based string searching", "Finding shortest paths", "Storing binary data"],
                correctAnswer: 1
            },
            {
                id: 14,
                question: "Which design pattern is 'Singleton' related to?",
                difficulty: "Beginner",
                options: ["Structural", "Behavioral", "Creational", "Architectural"],
                correctAnswer: 2
            },
            {
                id: 15,
                question: "In Dynamic Programming, what does 'Memoization' refer to?",
                difficulty: "Advanced",
                options: ["Bottom-up processing", "Top-down approach", "Greedy choice property", "Divide and conquer"],
                correctAnswer: 1
            },
            {
                id: 16,
                question: "What is the time complexity of accessing an element in a Linked List by index?",
                difficulty: "Beginner",
                options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
                correctAnswer: 2
            },
            {
                id: 17,
                question: "Which of these is NOT a principle of Object-Oriented Programming?",
                difficulty: "Beginner",
                options: ["Encapsulation", "Polymorphism", "Compilation", "Inheritance"],
                correctAnswer: 2
            },
            {
                id: 18,
                question: "What characterizes a 'Greedy Algorithm'?",
                difficulty: "Medium",
                options: ["Explores all options", "Makes the locally optimal choice", "Uses dynamic programming", "Backtracks when stuck"],
                correctAnswer: 1
            },
            {
                id: 19,
                question: "The 'N-Queens' problem is classically solved using:",
                difficulty: "Advanced",
                options: ["Greedy Algorithm", "Dynamic Programming", "Backtracking", "Sorting"],
                correctAnswer: 2
            },
            {
                id: 20,
                question: "What is the time complexity of 'finding the max element' in a Max-Heap?",
                difficulty: "Beginner",
                options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                correctAnswer: 0
            },
            {
                id: 21,
                question: "Which traversal matches the natural sorting order of a Binary Search Tree?",
                difficulty: "Beginner",
                options: ["Pre-order", "Post-order", "In-order", "Level-order"],
                correctAnswer: 2
            },
            {
                id: 22,
                question: "In a graph, what is 'Topological Sort' applicable to?",
                difficulty: "Advanced",
                options: ["Undirected Cyclic Graphs", "Directed Acyclic Graphs (DAG)", "Weighted Graphs", "Trees only"],
                correctAnswer: 1
            },
            {
                id: 23,
                question: "What is the definition of a 'Complete Binary Tree'?",
                difficulty: "Medium",
                options: ["Every node has 2 children", "Levels are fully filled except possibly the last", "Left child < Root < Right child", "Height is always log N"],
                correctAnswer: 1
            },
            {
                id: 24,
                question: "Bitwise XOR of a number with itself (x ^ x) results in:",
                difficulty: "Beginner",
                options: ["x", "1", "0", "-1"],
                correctAnswer: 2
            },
            {
                id: 25,
                question: "Which algorithms works best for finding the Minimum Spanning Tree (MST)?",
                difficulty: "Medium",
                options: ["Kruskal's & Prim's", "Dijkstra's & Bellman-Ford", "BFS & DFS", "Merge Sort & Quick Sort"],
                correctAnswer: 0
            },
            {
                id: 26,
                question: "What is the 'Sliding Window' technique mainly used for?",
                difficulty: "Medium",
                options: ["Sorting arrays", "Subarray/Substring problems", "Tree traversal", "Graph cycles"],
                correctAnswer: 1
            },
            {
                id: 27,
                question: "What is the worst-case time complexity of looking up a value in a Hash Table?",
                difficulty: "Beginner",
                options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
                correctAnswer: 2
            },
            {
                id: 28,
                question: "What does SQL stand for?",
                difficulty: "Beginner",
                options: ["Structured Query Language", "Standard Query Level", "Simple Query Logic", "Sequential Question List"],
                correctAnswer: 0
            },
            {
                id: 29,
                question: "Which of the following is an example of an 'In-place' sorting algorithm?",
                difficulty: "Medium",
                options: ["Merge Sort", "Quick Sort", "Counting Sort", "Radix Sort"],
                correctAnswer: 1
            },
            {
                id: 30,
                question: "What is the time complexity of the Fibonacci sequence using simple recursion (without DP)?",
                difficulty: "Medium",
                options: ["O(N)", "O(N^2)", "O(2^N)", "O(log N)"],
                correctAnswer: 2
            },
            {
                id: 31,
                question: "In React, what is the purpose of 'useEffect'?",
                difficulty: "Medium",
                options: ["To manage state", "To handle side effects", "To optimize rendering", "To create routes"],
                correctAnswer: 1
            },
            {
                id: 32,
                question: "What allows JavaScript to handle asynchronous operations?",
                difficulty: "Beginner",
                options: ["The Event Loop", "Multi-threading", "Compiling", "DOM Manipulation"],
                correctAnswer: 0
            },
            {
                id: 33,
                question: "Which data structure is efficient for implementing an LRU Cache?",
                difficulty: "Advanced",
                options: ["Array", "Stack", "HashMap + Doubly Linked List", "Binary Search Tree"],
                correctAnswer: 2
            },
            {
                id: 34,
                question: "What is the main difference between a Process and a Thread?",
                difficulty: "Medium",
                options: ["Threads are independent", "Processes share memory", "Threads share the process's memory space", "Processes are faster"],
                correctAnswer: 2
            },
            {
                id: 35,
                question: "What does ACID stand for in Database systems?",
                difficulty: "Medium",
                options: ["Atomicity, Consistency, Isolation, Durability", "Atomicity, Concurrency, Isolation, Duping", "Automatic, Consistent, Internal, Data", "Advanced, Coding, Input, Data"],
                correctAnswer: 0
            },
            {
                id: 36,
                question: "Which HTTP method is typically used to update an existing resource?",
                difficulty: "Beginner",
                options: ["GET", "POST", "PUT", "DELETE"],
                correctAnswer: 2
            },
            {
                id: 37,
                question: "In the OSI model, which layer is responsible for routing?",
                difficulty: "Medium",
                options: ["Physical", "Data Link", "Network", "Transport"],
                correctAnswer: 2
            },
            {
                id: 38,
                question: "What is 'Polymorphism' in OOP?",
                difficulty: "Medium",
                options: ["Hiding data", "Inheriting attributes", "Ability to take many forms", "Creating objects"],
                correctAnswer: 2
            },
            {
                id: 39,
                question: "Which of the following is NOT a NoSQL database?",
                difficulty: "Beginner",
                options: ["MongoDB", "Cassandra", "PostgreSQL", "Redis"],
                correctAnswer: 2
            }
        ]
    },
    5: {
        title: "LeetCode Challenge (Medium/Hard)",
        timeLimit: 25, // 25 minutes
        questions: [
            {
                id: 1,
                question: "Which data structure is best suited for implementing a 'Valid Parentheses' checker?",
                difficulty: "Beginner",
                options: ["Queue", "Stack", "Hash Map", "Linked List"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "For the 'Merge Intervals' problem (overlapping intervals), what is the primary sorting criteria?",
                difficulty: "Medium",
                options: ["End time", "Duration", "Start time", "None of the above"],
                correctAnswer: 2
            },
            {
                id: 3,
                question: "What technique is commonly used to solve 'Longest Substring Without Repeating Characters' efficiently?",
                difficulty: "Medium",
                options: ["Brute Force (O(n^2))", "Sliding Window (O(n))", "Dynamic Programming", "Recursion"],
                correctAnswer: 1
            },
            {
                id: 4,
                question: "In 'Invert Binary Tree', how do you traverse the tree?",
                difficulty: "Beginner",
                options: ["Level Order", "Post-order or Pre-order", "In-order only", "It's impossible"],
                correctAnswer: 1
            },
            {
                id: 5,
                question: "For 'Climbing Stairs' (finding number of ways to reach top), this problem maps to which sequence?",
                difficulty: "Beginner",
                options: ["Factorial", "Fibonacci", "Prime Numbers", "Geometric Progression"],
                correctAnswer: 1
            },
            {
                id: 6,
                question: "In '3Sum', what is the optimized time complexity to find unique triplets that sum to zero?",
                difficulty: "Medium",
                options: ["O(n^3)", "O(n^2)", "O(n log n)", "O(n)"],
                correctAnswer: 1
            },
            {
                id: 7,
                question: "Detecting a cycle in a Linked List can be done using?",
                difficulty: "Medium",
                options: ["Floyd's Tortoise and Hare", "Binary Search", "Merge Sort", "Kruskal's Algorithm"],
                correctAnswer: 0
            },
            {
                id: 8,
                question: "Which technique is best for 'Course Schedule' (finding if courses can be finished)?",
                difficulty: "Medium",
                options: ["Dijkstra", "Topological Sort", "Bit Manipulation", "Sliding Window"],
                correctAnswer: 1
            },
            {
                id: 9,
                question: "For 'Word Break' problem (checking if string can be segmented), which approach is most efficient?",
                difficulty: "Medium",
                options: ["Recursion", "Dynamic Programming", "Greedy", "Sorting"],
                correctAnswer: 1
            }
        ]
    },
    8: {
        title: "SQL Proficiency",
        timeLimit: 20, // 20 minutes
        questions: [
            { id: 1, question: "Which SQL clause is used to filter records?", difficulty: "Beginner", options: ["GROUP BY", "WHERE", "ORDER BY", "HAVING"], correctAnswer: 1 },
            { id: 2, question: "What does SQL stand for?", difficulty: "Beginner", options: ["Structured Question Language", "Structured Query Language", "Strong Query Language", "Simple Query Language"], correctAnswer: 1 },
            { id: 3, question: "Which statement is used to update data in a database?", difficulty: "Beginner", options: ["UPDATE", "SAVE", "MODIFY", "SAVE AS"], correctAnswer: 0 },
            { id: 4, question: "Which JOIN returns all records when there is a match in either left or right table?", difficulty: "Medium", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correctAnswer: 3 },
            { id: 5, question: "Which function returns the number of records?", difficulty: "Beginner", options: ["COUNT()", "SUM()", "NUM()", "TOTAL()"], correctAnswer: 0 },
            { id: 6, question: "How can you select all columns from a table named 'Users'?", difficulty: "Beginner", options: ["SELECT all FROM Users", "SELECT * FROM Users", "SELECT Users", "SELECT [all] FROM Users"], correctAnswer: 1 },
            { id: 7, question: "Which keyword is used to sort the result-set?", difficulty: "Beginner", options: ["ORDER BY", "SORT", "ORGANIZE", "ALIGN"], correctAnswer: 0 },
            { id: 8, question: "What is the most common type of Join?", difficulty: "Beginner", options: ["INNER JOIN", "INSIDE JOIN", "JOINED", "CROSS JOIN"], correctAnswer: 0 },
            { id: 9, question: "Which operator is used to search for a specified pattern in a column?", difficulty: "Medium", options: ["LIKE", "GET", "FROM", "SEARCH"], correctAnswer: 0 },
            { id: 10, question: "Which constraint uniquely identifies each record in a table?", difficulty: "Medium", options: ["UNIQUE", "PRIMARY KEY", "FOREIGN KEY", "INDEX"], correctAnswer: 1 },
            { id: 11, question: "Which statement is used to delete a table?", difficulty: "Medium", options: ["DROP TABLE", "DELETE TABLE", "REMOVE TABLE", "CLEAR TABLE"], correctAnswer: 0 },
            { id: 12, question: "How do you select all the records from a table named 'Persons' where the value of the column 'FirstName' starts with an 'a'?", difficulty: "Medium", options: ["SELECT * FROM Persons WHERE FirstName LIKE 'a%'", "SELECT * FROM Persons WHERE FirstName LIKE '%a'", "SELECT * FROM Persons WHERE FirstName='%a%'", "SELECT * FROM Persons WHERE FirstName='a'"], correctAnswer: 0 },
            { id: 13, question: "Which SQL constraint ensures that all values in a column are different?", difficulty: "Medium", options: ["UNIQUE", "NOT NULL", "CHECK", "DEFAULT"], correctAnswer: 0 },
            { id: 14, question: "What is the difference between TRUNCATE and DELETE?", difficulty: "Advanced", options: ["TRUNCATE is faster and cannot be rolled back (usually)", "DELETE removes structure", "They are identical", "TRUNCATE deletes specific rows"], correctAnswer: 0 },
            { id: 15, question: "Which group function ignores NULL values?", difficulty: "Advanced", options: ["All aggregate functions except COUNT(*)", "None", "Only SUM", "Only MAX"], correctAnswer: 0 },
            { id: 16, question: "What is a Foreign Key?", difficulty: "Medium", options: ["A primary key of another table", "A unique key", "A random number", "An index"], correctAnswer: 0 },
            { id: 17, question: "Which SQL keyword is used to retrieve unique values?", difficulty: "Medium", options: ["DISTINCT", "DIFFERENT", "UNIQUE", "SEPARATE"], correctAnswer: 0 },
            { id: 18, question: "Which clause is used to filter groups?", difficulty: "Advanced", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correctAnswer: 1 },
            { id: 19, question: "How do you add a new column 'Email' to the 'Customers' table?", difficulty: "Advanced", options: ["ALTER TABLE Customers ADD Email varchar(255)", "INSERT INTO Customers COLUMN Email", "UPDATE Customers ADD Email", "MODIFY TABLE Customers ADD Email"], correctAnswer: 0 },
            { id: 20, question: "What is the default sorting order of ORDER BY?", difficulty: "Beginner", options: ["Ascending", "Descending", "Random", "None"], correctAnswer: 0 }
        ]
    },
    9: {
        title: "Data Structures & Algorithms",
        timeLimit: 25, // 25 minutes
        questions: [
            { id: 1, question: "Which data structure follows LIFO principle?", difficulty: "Beginner", options: ["Queue", "Stack", "Linked List", "Tree"], correctAnswer: 1 },
            { id: 2, question: "Time complexity of accessing an element in an array by index is?", difficulty: "Beginner", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctAnswer: 2 },
            { id: 3, question: "What is the worst case time complexity of Merge Sort?", difficulty: "Medium", options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], correctAnswer: 1 },
            { id: 4, question: "Which traversal of a BST yields sorted elements?", difficulty: "Medium", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correctAnswer: 1 },
            { id: 5, question: "What is a Hash Collision?", difficulty: "Beginner", options: ["Two keys hashing to the same index", "Deleting a key", "Table fullness", "None"], correctAnswer: 0 },
            { id: 6, question: "Which algorithm finds the shortest path in a weighted graph?", difficulty: "Medium", options: ["BFS", "DFS", "Dijkstra", "Kruskal"], correctAnswer: 2 },
            { id: 7, question: "A graph with no cycles is called?", difficulty: "Beginner", options: ["Tree", "Forest", "DAG", "Complete Graph"], correctAnswer: 1 },
            { id: 8, question: "Minimum number of queues needed to implement a stack?", difficulty: "Medium", options: ["1", "2", "3", "4"], correctAnswer: 1 },
            { id: 9, question: "Which sorting algorithm is not stable?", difficulty: "Medium", options: ["Bubble Sort", "Merge Sort", "Quick Sort", "Insertion Sort"], correctAnswer: 2 },
            { id: 10, question: "Height of a balanced binary tree with N nodes is?", difficulty: "Advanced", options: ["O(N)", "O(log N)", "O(N^2)", "O(1)"], correctAnswer: 1 },
            { id: 11, question: "Which data structure is used for recursion?", difficulty: "Beginner", options: ["Queue", "Stack", "Tree", "Graph"], correctAnswer: 1 },
            { id: 12, question: "Time complexity of BFS?", difficulty: "Advanced", options: ["O(V+E)", "O(V^2)", "O(E^2)", "O(V*E)"], correctAnswer: 0 },
            { id: 13, question: "What is a Pivot in Quick Sort?", difficulty: "Medium", options: ["First element", "Last element", "Random element", "Any element used for partitioning"], correctAnswer: 3 },
            { id: 14, question: "Which data structure implements a Priority Queue?", difficulty: "Medium", options: ["Stack", "Array", "Heap", "Tree"], correctAnswer: 2 },
            { id: 15, question: "Floyd-Warshall algorithm computes?", difficulty: "Advanced", options: ["Shortest path between all pairs", "MST", "Topological Sort", "Strongly Connected Components"], correctAnswer: 0 },
            { id: 16, question: "In a Red-Black Tree, the root node is always?", difficulty: "Medium", options: ["Red", "Black", "Either", "White"], correctAnswer: 1 },
            { id: 17, question: "Which searching algorithm doesn't require sorted data?", difficulty: "Beginner", options: ["Binary Search", "Linear Search", "Jump Search", "Interpolation Search"], correctAnswer: 1 },
            { id: 18, question: "The Data Structure used by standard 'Undo' operation is?", difficulty: "Beginner", options: ["Queue", "Stack", "Tree", "Graph"], correctAnswer: 1 },
            { id: 19, question: "What is the average case time complexity of Insertion Sort?", difficulty: "Medium", options: ["O(n)", "O(n^2)", "O(n log n)", "O(1)"], correctAnswer: 1 },
            { id: 20, question: "To check if a graph is Bipartite, usually we use?", difficulty: "Advanced", options: ["BFS with 2-coloring", "Dijkstra", "Kruskal", "Topological Sort"], correctAnswer: 0 }
        ]
    }
};
