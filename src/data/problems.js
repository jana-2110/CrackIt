export const LEETCODE_PROBLEMS = {
    javascript: [
        { id: 101, question: "Two Sum", hint: "Use a Hash Map to store complements.", difficulty: "Easy", solution: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}" },
        { id: 102, question: "Palindrome Number", hint: "Convert to string or reverse the integer.", difficulty: "Easy", solution: "var isPalindrome = function(x) {\n    if (x < 0) return false;\n    const s = String(x);\n    return s === s.split('').reverse().join('');\n};" },
        { id: 103, question: "Valid Parentheses", hint: "Use a Stack data structure.", difficulty: "Easy", solution: "var isValid = function(s) {\n    const stack = [];\n    const map = { '(': ')', '{': '}', '[': ']' };\n    for (const char of s) {\n        if (map[char]) {\n            stack.push(char);\n        } else {\n            if (stack.pop() !== Object.keys(map).find(key => map[key] === char)) return false;\n        }\n    }\n    return stack.length === 0;\n};" },
        { id: 104, question: "Merge Two Sorted Lists", hint: "Recursion or iteration with a dummy head node.", difficulty: "Easy", solution: "var mergeTwoLists = function(l1, l2) {\n    if (!l1) return l2;\n    if (!l2) return l1;\n    if (l1.val < l2.val) {\n        l1.next = mergeTwoLists(l1.next, l2);\n        return l1;\n    } else {\n        l2.next = mergeTwoLists(l1, l2.next);\n        return l2;\n    }\n};" },
        { id: 105, question: "Best Time to Buy and Sell Stock", hint: "Track min_price and max_profit in a single pass.", difficulty: "Easy", solution: "var maxProfit = function(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let price of prices) {\n        if (price < minPrice) minPrice = price;\n        else if (price - minPrice > maxProfit) maxProfit = price - minPrice;\n    }\n    return maxProfit;\n};" },
        { id: 106, question: "Valid Anagram", hint: "Frequency counter or sort both strings.", difficulty: "Easy", solution: "var isAnagram = function(s, t) {\n    if (s.length !== t.length) return false;\n    return s.split('').sort().join('') === t.split('').sort().join('');\n};" },
        { id: 107, question: "Binary Search", hint: "O(log n) with simple mid calculation.", difficulty: "Easy", solution: "var search = function(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n};" },
        { id: 108, question: "Reverse Linked List", hint: "Iterative: prev, curr, next pointers.", difficulty: "Easy", solution: "var reverseList = function(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n};" },
        { id: 109, question: "Maximum Subarray", hint: "Keep local_max and global_max (Kadane's).", difficulty: "Medium", solution: "var maxSubArray = function(nums) {\n    let max = nums[0];\n    let current = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        current = Math.max(nums[i], current + nums[i]);\n        max = Math.max(max, current);\n    }\n    return max;\n};" },
        { id: 110, question: "Climbing Stairs", hint: "Dynamic Programming: dp[i] = dp[i-1] + dp[i-2].", difficulty: "Easy", solution: "var climbStairs = function(n) {\n    if (n <= 2) return n;\n    let dp = [0, 1, 2];\n    for (let i = 3; i <= n; i++) {\n        dp[i] = dp[i - 1] + dp[i - 2];\n    }\n    return dp[n];\n};" },
        { id: 111, question: "Coin Change", hint: "DP: dp[amount] = min(dp[amount], dp[amount-coin] + 1).", difficulty: "Medium" },
        { id: 112, question: "Longest Increasing Subsequence", hint: "DP O(n^2) or Binary Search O(n log n).", difficulty: "Medium" },
        { id: 113, question: "Permutations", hint: "Backtracking: Swap and recurse.", difficulty: "Medium" },
        { id: 114, question: "Subsets", hint: "Backtracking: Include or exclude element.", difficulty: "Medium" },
        { id: 115, question: "Edit Distance", hint: "DP 2D array: insert, delete, replace.", difficulty: "Hard" }
    ],
    python: [
        { id: 201, question: "Two Sum", hint: "prevMap = {} ... return [prevMap[diff], i]", difficulty: "Easy" },
        { id: 202, question: "Longest Substring Without Repeating Characters", hint: "Sliding window with set.", difficulty: "Medium" },
        { id: 203, question: "Container With Most Water", hint: "Two pointers from start and end.", difficulty: "Medium" },
        { id: 204, question: "3Sum", hint: "Sort then two pointers.", difficulty: "Medium" },
        { id: 205, question: "Valid Palindrome", hint: "Filter alphanumeric, visualize pointers.", difficulty: "Easy" },
        { id: 206, question: "Invert Binary Tree", hint: "Recursive swap of left and right children.", difficulty: "Easy" },
        { id: 207, question: "Construct Binary Tree from Preorder and Inorder", hint: "Use root from preorder, split inorder.", difficulty: "Medium" },
        { id: 208, question: "Product of Array Except Self", hint: "Prefix and Suffix products.", difficulty: "Medium" },
        { id: 209, question: "Group Anagrams", hint: "Hash Map key: sorted tuple of characters.", difficulty: "Medium" },
        { id: 210, question: "Validate Binary Search Tree", hint: "Recursion with min/max range limits.", difficulty: "Medium" },
        { id: 211, question: "Binary Tree Level Order Traversal", hint: "BFS with Queue.", difficulty: "Medium" },
        { id: 212, question: "Kth Largest Element in an Array", hint: "Min-Heap or Quickselect.", difficulty: "Medium" },
        { id: 213, question: "Top K Frequent Elements", hint: "Hash Map frequency count + Min-Heap.", difficulty: "Medium" },
        { id: 214, question: "Clone Graph", hint: "DFS/BFS with Hash Map to store visited nodes.", difficulty: "Medium" },
        { id: 215, question: "Course Schedule", hint: "Topological Sort (Kahn's Algo) or DFS cycle detection.", difficulty: "Medium" }
    ],
    cpp: [
        { id: 301, question: "Reverse Integer", hint: "Check overflow before multiplying by 10.", difficulty: "Medium" },
        { id: 302, question: "Pow(x, n)", hint: "Binary Exponentiation (Recursive).", difficulty: "Medium" },
        { id: 303, question: "Rotate Image", hint: "Transpose then reverse rows.", difficulty: "Medium" },
        { id: 304, question: "Search in Rotated Sorted Array", hint: "Modified Binary Search.", difficulty: "Medium" },
        { id: 305, question: "Merge Intervals", hint: "Sort based on start time.", difficulty: "Medium" },
        { id: 306, question: "Word Search", hint: "Backtracking / DFS.", difficulty: "Medium" }
    ],
    java: [
        { id: 401, question: "Longest Palindromic Substring", hint: "Expand around center.", difficulty: "Medium" },
        { id: 402, question: "Regular Expression Matching", hint: "Dynamic Programming hard problem.", difficulty: "Hard" },
        { id: 403, question: "Linked List Cycle", hint: "Floyd's Cycle Detection (Tortoise and Hare).", difficulty: "Easy" },
        { id: 404, question: "LRU Cache", hint: "HashMap + Doubly Linked List.", difficulty: "Medium" },
        { id: 405, question: "Number of Islands", hint: "DFS or BFS to mark visited land.", difficulty: "Medium" },
        { id: 406, question: "Trapping Rain Water", hint: "Two pointers or DP arrays (left_max, right_max).", difficulty: "Hard" },
        { id: 407, question: "Implement Trie (Prefix Tree)", hint: "Tree node with children map/array.", difficulty: "Medium" },
        { id: 408, question: "Word Search II", hint: "Trie + Backtracking (DFS) on board.", difficulty: "Hard" },
        { id: 409, question: "Merge k Sorted Lists", hint: "Min-Heap or Divide and Conquer.", difficulty: "Hard" },
        { id: 410, question: "Serialize and Deserialize Binary Tree", hint: "BFS/DFS string construction.", difficulty: "Hard" }
    ],
    c: [
        { id: 501, question: "String to Integer (atoi)", hint: "Handle whitespace, sign, and overflow.", difficulty: "Medium" },
        { id: 502, question: "Implement strStr()", hint: "KMP algorithm for optimization.", difficulty: "Easy" },
        { id: 503, question: "Remove Duplicates from Sorted Array", hint: "Two pointers, in-place.", difficulty: "Easy" },
        { id: 504, question: "Plus One", hint: "Handle carry propagation.", difficulty: "Easy" }
    ],
    sql: [
        { id: 601, question: "Combine Two Tables", hint: "LEFT JOIN.", difficulty: "Easy", solution: "SELECT firstName, lastName, city, state FROM Person LEFT JOIN Address ON Person.personId = Address.personId;" },
        { id: 602, question: "Second Highest Salary", hint: "LIMIT 1 OFFSET 1 or max < max.", difficulty: "Medium", solution: "SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);" },
        { id: 603, question: "Nth Highest Salary", hint: "Function/Stored Proc logic.", difficulty: "Medium", solution: "CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT BEGIN SET N = N-1; RETURN (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET N); END" },
        { id: 604, question: "Rank Scores", hint: "DENSE_RANK() function.", difficulty: "Medium", solution: "SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as 'Rank' FROM Scores;" },
        { id: 605, question: "Consecutive Numbers", hint: "Self join 3 times or window functions.", difficulty: "Medium", solution: "SELECT DISTINCT l1.Num as ConsecutiveNums FROM Logs l1, Logs l2, Logs l3 WHERE l1.Id = l2.Id - 1 AND l2.Id = l3.Id - 1 AND l1.Num = l2.Num AND l2.Num = l3.Num;" },
        { id: 606, question: "Employees Earning More Than Managers", hint: "Self JOIN on managerId.", difficulty: "Easy", solution: "SELECT e.name as Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;" },
        { id: 607, question: "Duplicate Emails", hint: "GROUP BY email HAVING COUNT(*) > 1.", difficulty: "Easy", solution: "SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1;" },
        { id: 608, question: "Customers Who Never Order", hint: "LEFT JOIN ... WHERE orderId IS NULL.", difficulty: "Easy", solution: "SELECT Name as Customers FROM Customers LEFT JOIN Orders ON Customers.Id = Orders.CustomerId WHERE Orders.CustomerId IS NULL;" },
        { id: 609, question: "Delete Duplicate Emails", hint: "DELETE with self join on logic.", difficulty: "Easy", solution: "DELETE p1 FROM Person p1, Person p2 WHERE p1.Email = p2.Email AND p1.Id > p2.Id;" },
        { id: 610, question: "Rising Temperature", hint: "Self join with DATEDIFF.", difficulty: "Easy", solution: "SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;" }
    ],
    assembly: [
        { id: 701, question: "Hello World Loop", hint: "Loop 5 times printing string.", difficulty: "Easy" },
        { id: 702, question: "Add Two Numbers", hint: "Use ADD instruction.", difficulty: "Easy" },
        { id: 703, question: "Find Max of Array", hint: "Loop compare and update.", difficulty: "Medium" }
    ]
};
