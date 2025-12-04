/* ============================================
   INTA - COMPLETE CODE WALKTHROUGH
   This file contains detailed explanations
   of how all 5 JavaScript files work together
   ============================================ */

// ====================================
// FILE 1: data.js - THE DATABASE
// ====================================

/*
PURPOSE: Store all the data our AI systems need
CONTAINS:
- 35 rules (IF-THEN logic)
- 54 attractions (places to visit)
- City graph (for finding nearest cities)
- Chatbot keywords (what words to detect)
*/

// ---------- RULES ARRAY ----------
// Each rule is an IF-THEN statement
const rules = [
  {
    id: 1,
    conditions: {              // THE "IF" PART
      interest: "history",     // If user likes history
      location: "paoay",       // AND is in Paoay
      timeMax: 2               // AND has max 2 hours
    },
    recommendations: [          // THE "THEN" PART
      "Paoay Church",          // Then recommend these
      "Malacañang of the North"
    ],
    reason: "Historical sites" // Why we recommend this
  }
  // ... 34 more rules like this
];

// HOW IT WORKS:
// When user selects interest="history", location="paoay", time=2
// This rule MATCHES and returns the recommendations

// ---------- ATTRACTIONS OBJECT ----------
// Details about each tourist spot
const attractions = {
  "Paoay Church": {           // Key = attraction name
    city: "Paoay",           // What city it's in
    type: "history",         // What category (history/beach/food/etc)
    price: "Free",           // How much it costs
    duration: "1 hour",      // How long to stay
    description: "UNESCO World Heritage earthquake baroque church"
  }
  // ... 53 more attractions
};

// HOW IT WORKS:
// When we get recommendation "Paoay Church" from a rule,
// We look it up here: attractions["Paoay Church"]
// To get all the details (price, duration, etc)

// ---------- CITY GRAPH ----------
// Shows which cities are connected (neighbors)
const cityGraph = {
  "Laoag": ["Batac", "Paoay", "San Nicolas"],  // Laoag's neighbors
  "Paoay": ["Laoag", "Batac", "Currimao"],      // Paoay's neighbors
  // ... more cities
};

// HOW IT WORKS:
// Used by BFS (Breadth-First Search) to find nearest cities
// Think of it like a road map: which cities are directly connected?

// ---------- CHATBOT KEYWORDS ----------
// Words the chatbot understands
const chatbotKeywords = {
  locations: {
    "laoag": ["laoag", "la union"],      // Different ways to spell/say Laoag
    "pagudpud": ["pagudpud", "pagodpud"] // Handles misspellings!
  },
  interests: {
    "beach": ["beach", "beaches", "sea", "coast"],
    "food": ["food", "eat", "restaurant", "dining"]
  }
};

// HOW IT WORKS:
// If user types "beachs in pagodpud" (misspelled),
// The chatbot still understands:
// - "beachs" matches to "beach" interest
// - "pagodpud" matches to "pagudpud" location


// ====================================
// FILE 2: ruleEngine.js - AI #1
// ====================================

/*
PURPOSE: Match user input to rules (Expert System)
INPUT: { interest: "beach", location: "pagudpud", time: 4 }
OUTPUT: List of recommended attractions with details
*/

function matchRules(userInput) {
  // STEP 1: Setup
  let matchedRules = [];
  
  // STEP 2: Loop through ALL 35 rules
  for (let rule of rules) {
    let score = 0;  // How well does this rule match?
    
    // STEP 3: Check each condition
    
    // Does interest match?
    if (rule.conditions.interest === userInput.interest) {
      score += 10;  // Add 10 points
    }
    
    // Does location match?
    if (rule.conditions.location === userInput.location) {
      score += 10;  // Add 10 points
    }
    
    // Does time fit?
    if (rule.conditions.timeMax && userInput.time <= rule.conditions.timeMax) {
      score += 5;   // Add 5 points
    }
    
    // STEP 4: If rule got ANY points, save it
    if (score > 0) {
      matchedRules.push({
        rule: rule,
        score: score
      });
    }
  }
  
  // STEP 5: Sort by score (best matches first)
  // If rule A has score=20 and rule B has score=10,
  // A comes first
  matchedRules.sort((a, b) => b.score - a.score);
  
  // STEP 6: Build final recommendations
  let recommendations = [];
  
  for (let match of matchedRules) {
    // For each matched rule, get its recommendations
    for (let attractionName of match.rule.recommendations) {
      // Look up full details from attractions object
      let details = attractions[attractionName];
      
      recommendations.push({
        name: attractionName,
        details: details,
        matchScore: match.score,
        reason: match.rule.reason
      });
    }
  }
  
  // STEP 7: Return results
  return {
    recommendations: recommendations,
    matchCount: matchedRules.length
  };
}

// EXAMPLE EXECUTION:
// Input: { interest: "beach", location: "pagudpud", time: 4 }
//
// Rule #5 matches:
//   conditions: { interest: "beach", location: "pagudpud" }
//   Score: 10 + 10 = 20 points ✅
//   Recommendations: ["Saud Beach", "Blue Lagoon"]
//
// Rule #6 matches:
//   conditions: { interest: "beach" }
//   Score: 10 points ✅
//   Recommendations: ["Gaang Beach Cove", "Pangil Beach"]
//
// Result: Returns Saud Beach, Blue Lagoon (score 20) first,
//         then Gaang Beach Cove, Pangil Beach (score 10)


// ====================================
// FILE 3: chatBot.js - AI #2
// ====================================

/*
PURPOSE: Understand user's chat messages
TECHNIQUE: Keyword detection (basic NLP)
*/

// FUNCTION 1: Find location in message
function detectLocation(message) {
  // STEP 1: Convert to lowercase for easier matching
  let lowerMsg = message.toLowerCase();
  // "What beaches in PAGUDPUD?" → "what beaches in pagudpud?"
  
  // STEP 2: Check each city's keywords
  for (let city in chatbotKeywords.locations) {
    let keywords = chatbotKeywords.locations[city];
    // city = "pagudpud"
    // keywords = ["pagudpud", "pagodpud"]
    
    // STEP 3: See if any keyword appears in message
    for (let keyword of keywords) {
      if (lowerMsg.includes(keyword)) {
        return city;  // Found it! Return "pagudpud"
      }
    }
  }
  
  return null;  // No location found
}

// EXAMPLE:
// detectLocation("beaches in pagodpud")
// → Checks "pagodpud" keyword
// → Matches to "pagudpud" city
// → Returns "pagudpud"


// FUNCTION 2: Find interest in message
function detectInterest(message) {
  let lowerMsg = message.toLowerCase();
  
  // Check each interest type
  for (let interest in chatbotKeywords.interests) {
    let keywords = chatbotKeywords.interests[interest];
    
    for (let keyword of keywords) {
      if (lowerMsg.includes(keyword)) {
        return interest;
      }
    }
  }
  
  return null;
}

// EXAMPLE:
// detectInterest("show me beaches")
// → Checks "beaches" keyword
// → Matches to "beach" interest
// → Returns "beach"


// FUNCTION 3: Main chatbot brain
function processChatMessage(message) {
  // STEP 1: Detect what user wants
  let location = detectLocation(message);  // "pagudpud" or null
  let interest = detectInterest(message);  // "beach" or null
  
  // STEP 2: Handle greetings
  if (message.match(/hello|hi|hey/i)) {
    return {
      response: "Hello! Ask me about attractions in Ilocos Norte!"
    };
  }
  
  // STEP 3: If we found BOTH location and interest
  if (location && interest) {
    // Search attractions database
    let matches = [];
    
    for (let name in attractions) {
      let att = attractions[name];
      
      // Check if attraction matches BOTH criteria
      if (att.city.toLowerCase() === location && att.type === interest) {
        matches.push(name);
      }
    }
    
    // STEP 4: Build response
    if (matches.length > 0) {
      return {
        response: `${interest} attractions in ${location}:\n${matches.join(", ")}`
      };
    } else {
      return {
        response: `No ${interest} attractions in ${location}. Try nearby cities!`
      };
    }
  }
  
  // STEP 5: Only location (no interest)
  if (location && !interest) {
    // Show all attractions in that city
    let cityAttractions = [];
    for (let name in attractions) {
      if (attractions[name].city.toLowerCase() === location) {
        cityAttractions.push(name);
      }
    }
    return {
      response: `Attractions in ${location}:\n${cityAttractions.join(", ")}`
    };
  }
  
  // STEP 6: Only interest (no location)
  if (interest && !location) {
    return {
      response: `Looking for ${interest} attractions. Which city? Try: Laoag, Pagudpud, Paoay...`
    };
  }
  
  // STEP 7: Didn't understand
  return {
    response: "Try asking: 'beaches in pagudpud' or 'food in laoag'"
  };
}

// FULL EXAMPLE:
// User: "what beaches are in pagudpud?"
// ↓
// detectLocation() → "pagudpud"
// detectInterest() → "beach"
// ↓
// Search attractions where city="pagudpud" AND type="beach"
// ↓
// Found: Saud Beach, Blue Lagoon, Dos Hermanos Islands
// ↓
// Return: "beach attractions in pagudpud: Saud Beach, Blue Lagoon, Dos Hermanos Islands"


// ====================================
// FILE 4: bfs.js - AI #3
// ====================================

/*
PURPOSE: Find nearest cities using graph search
ALGORITHM: Breadth-First Search (BFS)
ANALOGY: Like ripples spreading in water
*/

function findNearestCities(startCity, limit = 3) {
  // STEP 1: Initialize
  let queue = [{ city: startCity, hops: 0 }];  // Queue = to-do list
  let visited = { [startCity]: true };          // Track what we've seen
  let result = [];                              // Store nearest cities
  
  // STEP 2: BFS main loop
  while (queue.length > 0 && result.length < limit) {
    // Take first city from queue (FIFO - First In First Out)
    let current = queue.shift();
    
    // Don't include the starting city itself
    if (current.hops > 0) {
      result.push(current);
    }
    
    // STEP 3: Find neighbors of current city
    let neighbors = cityGraph[current.city] || [];
    
    // STEP 4: Add unvisited neighbors to queue
    for (let neighbor of neighbors) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;  // Mark as visited
        queue.push({
          city: neighbor,
          hops: current.hops + 1   // One hop further
        });
      }
    }
  }
  
  // STEP 5: Get attractions for each city
  let final = result.map(r => ({
    city: r.city,
    hops: r.hops,
    attractions: cityAttractions[r.city] || []
  }));
  
  return { nearestCities: final };
}

// VISUAL WALKTHROUGH:
// Starting city: Paoay
// cityGraph = {
//   "Paoay": ["Laoag", "Batac", "Currimao"],
//   "Laoag": ["Batac", "San Nicolas"],
//   ...
// }
//
// ITERATION 1:
//   queue = [{ city: "Paoay", hops: 0 }]
//   current = { city: "Paoay", hops: 0 }
//   neighbors = ["Laoag", "Batac", "Currimao"]
//   Add to queue: Laoag(1), Batac(1), Currimao(1)
//   queue = [{ city: "Laoag", hops: 1 }, ...]
//
// ITERATION 2:
//   current = { city: "Laoag", hops: 1 }
//   result = [{ city: "Laoag", hops: 1 }]  ← Added to result!
//   neighbors = ["Batac", "San Nicolas"]
//   Batac already visited, skip
//   Add San Nicolas(2) to queue
//
// ITERATION 3:
//   current = { city: "Batac", hops: 1 }
//   result = [Laoag(1), Batac(1)]  ← Added!
//   ...
//
// FINAL RESULT:
//   [Laoag(1 hop), Batac(1 hop), Currimao(1 hop)]
//
// Why BFS guarantees nearest?
// Because it explores level-by-level:
// - Level 1 (1 hop away) is fully explored before
// - Level 2 (2 hops away) is explored


// ====================================
// FILE 5: main.js - THE CONTROLLER
// ====================================

/*
PURPOSE: Connect HTML buttons to JavaScript functions
ROLE: Event handlers - listen for clicks and respond
*/

// SETUP: Find HTML elements
let recommendBtn = document.getElementById("recommendBtn");
let interestSelect = document.getElementById("interestSelect");
let locationSelect = document.getElementById("locationSelect");
let timeInput = document.getElementById("timeInput");
let resultsArea = document.getElementById("resultsArea");

// EVENT HANDLER 1: Trip Planner Button
recommendBtn.addEventListener('click', () => {
  // This function runs when user clicks "Get Recommendations"
  
  // STEP 1: Collect user input
  let userInput = {
    interest: interestSelect.value,   // "beach"
    location: locationSelect.value,   // "pagudpud"
    time: Number(timeInput.value)     // 4
  };
  
  // STEP 2: Validate (make sure they filled everything)
  if (!userInput.interest) {
    alert("Please select an interest!");
    return;  // Stop here
  }
  if (!userInput.location) {
    alert("Please select a location!");
    return;
  }
  if (!userInput.time || userInput.time <= 0) {
    alert("Please enter time available!");
    return;
  }
  
  // STEP 3: Show loading state
  recommendBtn.disabled = true;          // Disable button
  recommendBtn.textContent = "Processing...";  // Change text
  
  // STEP 4: Call AI after short delay (better UX)
  setTimeout(() => {
    // Call the rule engine (AI #1)
    let result = matchRules(userInput);
    
    // STEP 5: Display results
    resultsArea.innerHTML = '';  // Clear previous results
    
    if (result.recommendations.length === 0) {
      resultsArea.innerHTML = '<p>No recommendations found. Try different options.</p>';
    } else {
      // Create HTML for each recommendation
      for (let rec of result.recommendations) {
        let div = document.createElement('div');
        div.className = 'recommendation-card';
        div.innerHTML = `
          <h3>${rec.name}</h3>
          <p><strong>City:</strong> ${rec.details.city}</p>
          <p><strong>Duration:</strong> ${rec.details.duration}</p>
          <p><strong>Price:</strong> ${rec.details.price}</p>
          <p>${rec.details.description}</p>
        `;
        resultsArea.appendChild(div);
      }
    }
    
    // STEP 6: Reset button
    recommendBtn.disabled = false;
    recommendBtn.textContent = "Get Recommendations";
  }, 300);  // 300 milliseconds = 0.3 seconds
});

// EVENT HANDLER 2: Chatbot Send Button
let chatSendBtn = document.getElementById("chatSendBtn");
let chatInput = document.getElementById("chatInput");
let chatWindow = document.getElementById("chatWindow");

chatSendBtn.addEventListener('click', () => {
  // STEP 1: Get user's message
  let message = chatInput.value.trim();
  if (!message) return;  // Don't send empty messages
  
  // STEP 2: Display user's message in chat
  let userDiv = document.createElement('div');
  userDiv.className = 'chat-user';
  userDiv.innerHTML = `<p>${message}</p>`;
  chatWindow.appendChild(userDiv);
  
  // STEP 3: Clear input box
  chatInput.value = '';
  
  // STEP 4: Show "typing..." indicator
  let typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.innerHTML = '<p>Typing...</p>';
  chatWindow.appendChild(typingDiv);
  
  // STEP 5: Process message after delay
  setTimeout(() => {
    // Remove typing indicator
    typingDiv.remove();
    
    // Call chatbot (AI #2)
    let response = processChatMessage(message);
    
    // Display bot's response
    let botDiv = document.createElement('div');
    botDiv.className = 'chat-bot';
    botDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <p>${response.response}</p>
      </div>
    `;
    chatWindow.appendChild(botDiv);
    
    // Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 500);
});

// EVENT HANDLER 3: BFS Button
let bfsBtn = document.getElementById("bfsBtn");
let bfsSelect = document.getElementById("bfsSelect");

bfsBtn.addEventListener('click', () => {
  // STEP 1: Get selected city
  let startCity = bfsSelect.value;
  
  // STEP 2: Show loading
  bfsBtn.disabled = true;
  bfsBtn.textContent = "Searching...";
  
  // STEP 3: Call BFS (AI #3)
  setTimeout(() => {
    let result = findNearestCities(startCity, 3);
    
    // STEP 4: Display results
    resultsArea.innerHTML = '<h2>Nearest Cities</h2>';
    
    for (let city of result.nearestCities) {
      let div = document.createElement('div');
      div.innerHTML = `
        <h3>${city.city} (${city.hops} hop${city.hops > 1 ? 's' : ''})</h3>
        <p>Attractions: ${city.attractions.slice(0, 3).join(", ")}</p>
      `;
      resultsArea.appendChild(div);
    }
    
    // STEP 5: Reset button
    bfsBtn.disabled = false;
    bfsBtn.textContent = "Find Nearest";
  }, 300);
});

// WHY USE setTimeout()?
// - Makes the app feel more responsive
// - Shows loading states (Processing..., Typing...)
// - Gives browser time to update UI before heavy computation
// - Without it, button would appear to "freeze" briefly


// ====================================
// COMPLETE FLOW DIAGRAM
// ====================================

/*
USER CLICKS "Get Recommendations"
         ↓
main.js detects click event
         ↓
Collects: interest="beach", location="pagudpud", time=4
         ↓
Validates input (all fields filled?)
         ↓
Shows loading state (button disabled, text="Processing...")
         ↓
Calls: matchRules({ interest: "beach", location: "pagudpud", time: 4 })
         ↓
ruleEngine.js runs:
  - Loops through 35 rules
  - Rule #5 matches (score=20): beach + pagudpud
  - Gets recommendations: ["Saud Beach", "Blue Lagoon"]
  - Looks up details in attractions object
  - Returns: [{ name: "Saud Beach", details: {...} }, ...]
         ↓
Back to main.js:
  - Receives recommendations array
  - Creates HTML elements for each
  - Inserts into resultsArea
  - Resets button (enabled, text="Get Recommendations")
         ↓
USER SEES:
  ✅ Saud Beach - Free, 3-4 hours, Long stretch of white sand...
  ✅ Blue Lagoon - ₱50, 2-3 hours, Scenic lagoon with crystal waters...
*/


// ====================================
// KEY PROGRAMMING CONCEPTS
// ====================================

// 1. ARRAYS (Lists)
let cities = ["Laoag", "Paoay", "Pagudpud"];
console.log(cities[0]);  // "Laoag" (first item)
console.log(cities.length);  // 3 (how many items)

// 2. OBJECTS (Key-Value Pairs)
let attraction = {
  name: "Paoay Church",
  city: "Paoay",
  price: "Free"
};
console.log(attraction.city);  // "Paoay"
console.log(attraction["price"]);  // "Free" (alternative syntax)

// 3. LOOPS
for (let city of cities) {
  console.log(city);  // Prints each city
}

// 4. CONDITIONALS
if (interest === "beach") {
  console.log("Looking for beaches!");
} else {
  console.log("Not beaches");
}

// 5. FUNCTIONS
function greet(name) {
  return "Hello " + name;
}
let message = greet("INTA");  // "Hello INTA"

// 6. DOM MANIPULATION
let button = document.getElementById("myBtn");  // Find element
button.textContent = "Click me!";               // Change text
button.addEventListener('click', () => {        // Listen for clicks
  alert("Clicked!");
});


// ====================================
// COMMON QUESTIONS & ANSWERS
// ====================================

// Q: What's the difference between = and === ?
// A: = assigns a value: let x = 5
//    === compares values: if (x === 5)

// Q: What does .push() do?
// A: Adds item to end of array
//    cities.push("Vigan") → cities = ["Laoag", "Paoay", "Pagudpud", "Vigan"]

// Q: What's the difference between let and const?
// A: let = can change later: let score = 10; score = 20;
//    const = can't change: const PI = 3.14; PI = 4; ← ERROR!

// Q: What's an API?
// A: API = Application Programming Interface
//    In our case, our "API" is the functions:
//    - matchRules() is the Rule Engine API
//    - processChatMessage() is the Chatbot API
//    - findNearestCities() is the BFS API

// Q: Why use objects instead of arrays for attractions?
// A: Objects let us look up by name instantly:
//    attractions["Paoay Church"]  ← Fast!
//    vs. searching through array to find matching name ← Slow!

// Q: What's async/await vs setTimeout?
// A: setTimeout = simple delay
//    async/await = for complex operations (database, API calls)
//    We use setTimeout because our operations are fast

// ====================================
// END OF WALKTHROUGH
// ====================================
