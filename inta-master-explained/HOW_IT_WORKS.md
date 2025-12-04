# 📚 INTA - Complete Code Explanation (Beginner-Friendly)

## 🎯 **Project Overview**

INTA is a tourism assistant website that helps people plan trips in Ilocos Norte. It uses **3 different AI techniques** to give recommendations:

1. **Rule-Based System** (Trip Planner) - Uses IF-THEN rules like "IF user likes beaches AND is in Pagudpud THEN recommend Saud Beach"
2. **Chatbot** (Keyword Detection) - Understands questions like "What beaches are in Pagudpud?"
3. **Graph Search** (BFS - Breadth First Search) - Finds nearest cities using a map/graph structure

---

## 📂 **File Structure & What Each File Does**

```
inta-master/
├── index.html           ← The webpage you see (forms, buttons, chat window)
├── style.css            ← Makes everything look pretty (colors, spacing, animations)
├── scripts/
│   ├── data.js          ← The BRAIN - stores all data (rules, attractions, graph)
│   ├── ruleEngine.js    ← AI #1: Matches user input to rules
│   ├── chatBot.js       ← AI #2: Understands chat messages
│   ├── bfs.js           ← AI #3: Finds nearest cities using graph
│   └── main.js          ← The GLUE - connects HTML buttons to AI logic
└── README.md            ← Project documentation
```

---

## 🔍 **HOW EACH FILE WORKS (Step by Step)**

---

### **1. index.html** - The User Interface

**What it does**: Creates the visual webpage with forms and buttons

**Key Parts**:

```html
<!-- TRIP PLANNER FORM -->
<select id="interestSelect">
  <option value="history">History</option>
  <option value="beach">Beach</option>
  <!-- etc... -->
</select>
<select id="locationSelect">
  <option value="laoag">Laoag</option>
  <!-- etc... -->
</select>
<input id="timeInput" type="number" placeholder="Hours available" />
<button id="recommendBtn">Get Recommendations</button>

<!-- WHERE RESULTS APPEAR -->
<div id="resultsArea"></div>

<!-- CHATBOT -->
<input id="chatInput" type="text" placeholder="Ask me anything..." />
<button id="chatSendBtn">Send</button>
<div id="chatWindow"></div>

<!-- BFS CITY FINDER -->
<select id="bfsSelect">
  <option value="Paoay">Paoay</option>
  <!-- etc... -->
</select>
<button id="bfsBtn">Find Nearest</button>
```

**Think of it like**: A restaurant menu - it shows you all the options (dropdowns, inputs) but doesn't do the cooking (that's JavaScript's job).

---

### **2. style.css** - The Styling

**What it does**: Makes the HTML look good with colors, fonts, spacing

**Key Concepts**:

```css
/* CSS Variables - reusable colors */
:root {
  --primary: #0b71ea;        /* Main blue color */
  --background: #f8fafc;      /* Page background */
}

/* Styling the header */
header {
  background: linear-gradient(135deg, ...);  /* Gradient background */
  padding: 24px 20px;                        /* Space inside */
  position: sticky;                          /* Stays at top when scrolling */
}

/* Making buttons look nice */
button {
  background: var(--primary);  /* Use our blue color */
  color: white;
  border-radius: 8px;          /* Rounded corners */
  transition: all 0.2s ease;   /* Smooth hover effect */
}

button:hover {
  transform: translateY(-1px);  /* Lift up slightly on hover */
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Think of it like**: Interior design for a house - the HTML is the structure (walls, doors), CSS is the decoration (paint, furniture).

---

### **3. scripts/data.js** - The Database

**What it does**: Stores ALL the data (rules, attractions, cities, keywords)

**Important Variables**:

#### **A) Rules Array** (35 rules for AI #1)
```javascript
const rules = [
  {
    id: 1,
    conditions: { 
      interest: "history",     // What user is interested in
      location: "paoay",       // Where they are
      timeMax: 2               // Maximum hours they have
    },
    recommendations: [
      "Paoay Church",
      "Malacañang of the North"
    ],
    reason: "Historical sites in Paoay"
  },
  // ... 34 more rules
];
```

**How to read this**: "IF the user likes HISTORY and is in PAOAY and has at most 2 HOURS, THEN recommend Paoay Church and Malacañang"

---

#### **B) Attractions Object** (54 attractions)
```javascript
const attractions = {
  "Paoay Church": {
    city: "Paoay",
    type: "history",
    price: "Free",
    duration: "1 hour",
    description: "UNESCO World Heritage earthquake baroque church from 1710"
  },
  "Saud Beach": {
    city: "Pagudpud",
    type: "beach",
    price: "Free",
    duration: "3-4 hours",
    description: "Long stretch of white sand beach with crystal clear waters"
  },
  // ... 52 more attractions
};
```

**How to read this**: Each attraction has details like a database entry - city, type, price, how long to stay, description.

---

#### **C) City Graph** (for BFS AI #3)
```javascript
const cityGraph = {
  "Laoag": ["Batac", "Paoay", "San Nicolas"],  // Laoag is connected to these cities
  "Paoay": ["Laoag", "Batac", "Currimao"],      // Paoay is connected to these
  "Pagudpud": ["Burgos", "Dumalneg", "Bangui"],
  // ... more cities
};
```

**Think of it like**: A road map showing which cities are neighbors. Used to find "nearest cities" in AI #3.

---

#### **D) Chatbot Keywords** (for AI #2)
```javascript
const chatbotKeywords = {
  locations: {
    "laoag": ["laoag", "la union"],
    "pagudpud": ["pagudpud", "pagudpod", "pagodpud"],
    "paoay": ["paoay", "paoway"]
    // ... more cities with spelling variations
  },
  interests: {
    "history": ["history", "historical", "heritage", "museum", "church"],
    "beach": ["beach", "beaches", "sea", "coast", "swimming"],
    "food": ["food", "eat", "restaurant", "dining", "cuisine"]
    // ... more interests
  }
};
```

**How to read this**: The chatbot looks for these keywords in user messages. If someone types "beachs in pagodpud" (misspelled), it still understands!

---

### **4. scripts/ruleEngine.js** - AI #1 (Rule-Based Expert System)

**What it does**: Takes user input (interest, location, time) and finds matching rules

**Main Function**:

```javascript
function matchRules(userInput) {
  // userInput = { interest: "beach", location: "pagudpud", time: 4 }
  
  let matchedRules = [];
  
  // STEP 1: Loop through all 35 rules
  for (let rule of rules) {
    let score = 0;
    
    // STEP 2: Check if rule matches user's interest
    if (rule.conditions.interest === userInput.interest) {
      score += 10;  // Give points for matching interest
    }
    
    // STEP 3: Check if rule matches user's location
    if (rule.conditions.location === userInput.location) {
      score += 10;  // Give points for matching location
    }
    
    // STEP 4: Check if rule matches user's available time
    if (rule.conditions.timeMax && userInput.time <= rule.conditions.timeMax) {
      score += 5;   // Give points for fitting time constraint
    }
    
    // STEP 5: If rule got any points, it's a match!
    if (score > 0) {
      matchedRules.push({ rule: rule, score: score });
    }
  }
  
  // STEP 6: Sort rules by score (best matches first)
  matchedRules.sort((a, b) => b.score - a.score);
  
  // STEP 7: Get the attraction details for recommendations
  let recommendations = [];
  for (let match of matchedRules) {
    for (let attractionName of match.rule.recommendations) {
      let details = attractions[attractionName];  // Look up in attractions object
      recommendations.push({
        name: attractionName,
        details: details,
        matchScore: match.score
      });
    }
  }
  
  return { recommendations: recommendations };
}
```

**Example Flow**:
1. User selects: **Beach**, **Pagudpud**, **4 hours**
2. System checks all 35 rules
3. Rule #5 matches: `{ interest: "beach", location: "pagudpud" }` → Score: 20 points!
4. Returns: Saud Beach, Blue Lagoon, Dos Hermanos Islands
5. Shows on screen with details (price, duration, description)

---

### **5. scripts/chatBot.js** - AI #2 (Keyword Chatbot)

**What it does**: Reads user's chat message and detects location + interest keywords

**Main Functions**:

#### **Function 1: Detect Location**
```javascript
function detectLocation(message) {
  // message = "what beaches are in pagudpud?"
  
  let lowerMsg = message.toLowerCase();  // Convert to lowercase
  
  // Loop through all location keywords
  for (let city in chatbotKeywords.locations) {
    let keywords = chatbotKeywords.locations[city];
    
    // Check if any keyword appears in the message
    for (let kw of keywords) {
      if (lowerMsg.includes(kw)) {
        return city;  // Found it! Return "pagudpud"
      }
    }
  }
  
  return null;  // No location found
}
```

**Example**: "beachs in pagodpud" → Detects "pagodpud" (misspelling) → Returns "pagudpud"

---

#### **Function 2: Detect Interest**
```javascript
function detectInterest(message) {
  // message = "what beaches are in pagudpud?"
  
  let lowerMsg = message.toLowerCase();
  
  // Loop through interest keywords
  for (let interest in chatbotKeywords.interests) {
    let keywords = chatbotKeywords.interests[interest];
    
    for (let kw of keywords) {
      if (lowerMsg.includes(kw)) {
        return interest;  // Found "beaches" → Return "beach"
      }
    }
  }
  
  return null;  // No interest found
}
```

---

#### **Function 3: Process Message** (Main chatbot brain)
```javascript
function processChatMessage(message) {
  // STEP 1: Detect what user wants
  let location = detectLocation(message);  // e.g., "pagudpud"
  let interest = detectInterest(message);  // e.g., "beach"
  
  // STEP 2: Handle greetings
  if (message.match(/hello|hi|hey/i)) {
    return { response: "Hello! Ask me about attractions in Ilocos Norte!" };
  }
  
  // STEP 3: If we found location AND interest
  if (location && interest) {
    // Get attractions that match both
    let matches = [];
    
    for (let name in attractions) {
      let att = attractions[name];
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
        response: `No ${interest} attractions found in ${location}. Try nearby cities!`
      };
    }
  }
  
  // STEP 5: Fallback if we don't understand
  return {
    response: "I can help you find attractions! Try: 'beaches in pagudpud' or 'food in laoag'"
  };
}
```

**Example Flow**:
1. User types: "what beaches in pagudpud?"
2. Detects location: "pagudpud"
3. Detects interest: "beach"
4. Searches attractions for: city=pagudpud AND type=beach
5. Finds: Saud Beach, Blue Lagoon, Dos Hermanos Islands
6. Returns: "beach attractions in pagudpud: Saud Beach, Blue Lagoon, Dos Hermanos Islands"

---

### **6. scripts/bfs.js** - AI #3 (Graph Search with BFS)

**What it does**: Finds the 3 nearest cities using Breadth-First Search algorithm

**BFS Algorithm Explained** (Like ripples in water):

Imagine you drop a stone in water. The ripples spread outward in circles:
- **Level 0**: Starting city (Paoay)
- **Level 1**: Direct neighbors (Laoag, Batac, Currimao)
- **Level 2**: Neighbors of neighbors (San Nicolas, Vigan, etc.)

```javascript
function findNearestCities(startCity, limit = 3) {
  // STEP 1: Setup
  let queue = [{ city: startCity, hops: 0 }];  // Start with our city
  let visited = { [startCity]: true };         // Mark as visited
  let nearest = [];                            // Results go here
  
  // STEP 2: BFS Loop
  while (queue.length > 0 && nearest.length < limit) {
    // Take first city from queue
    let current = queue.shift();
    
    // Skip the starting city itself
    if (current.hops > 0) {
      nearest.push(current);
    }
    
    // STEP 3: Find neighbors
    let neighbors = cityGraph[current.city] || [];
    
    // STEP 4: Add unvisited neighbors to queue
    for (let neighbor of neighbors) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push({
          city: neighbor,
          hops: current.hops + 1  // One hop further
        });
      }
    }
  }
  
  // STEP 5: Get attractions for each city
  let results = nearest.map(n => ({
    city: n.city,
    hops: n.hops,
    attractions: cityAttractions[n.city] || []
  }));
  
  return { nearestCities: results };
}
```

**Visual Example**:
```
Starting from PAOAY:

Level 0: [Paoay] ← START HERE
         ↓
Level 1: [Laoag, Batac, Currimao] ← 1 hop away
         ↓
Level 2: [San Nicolas, Vigan, Pagudpud] ← 2 hops away

Return: Laoag (1 hop), Batac (1 hop), Currimao (1 hop)
```

---

### **7. scripts/main.js** - The Controller (Connects Everything)

**What it does**: Listens for button clicks and calls the AI functions

#### **Button 1: Trip Planner (Get Recommendations)**
```javascript
// STEP 1: Find the button in HTML
let recommendBtn = document.getElementById("recommendBtn");

// STEP 2: Listen for clicks
recommendBtn.addEventListener('click', () => {
  
  // STEP 3: Get user's selections from form
  let userInput = {
    interest: document.getElementById("interestSelect").value,   // "beach"
    location: document.getElementById("locationSelect").value,   // "pagudpud"
    time: document.getElementById("timeInput").value             // 4
  };
  
  // STEP 4: Validate input
  if (!userInput.interest || !userInput.location || !userInput.time) {
    alert("Please fill all fields!");
    return;
  }
  
  // STEP 5: Show loading state
  recommendBtn.textContent = "Processing...";
  recommendBtn.disabled = true;
  
  // STEP 6: Call AI #1 (Rule Engine)
  setTimeout(() => {
    let result = matchRules(userInput);  // ← Calls ruleEngine.js
    
    // STEP 7: Display results
    displayResults(result.recommendations);
    
    // STEP 8: Reset button
    recommendBtn.textContent = "Get Recommendations";
    recommendBtn.disabled = false;
  }, 300);  // 300ms delay for better UX
});
```

---

#### **Button 2: Chatbot (Send Message)**
```javascript
let chatSendBtn = document.getElementById("chatSendBtn");
let chatInput = document.getElementById("chatInput");
let chatWindow = document.getElementById("chatWindow");

chatSendBtn.addEventListener('click', () => {
  // STEP 1: Get user's message
  let message = chatInput.value.trim();
  
  // STEP 2: Show user's message in chat
  let userBubble = document.createElement('div');
  userBubble.className = 'chat-user';
  userBubble.innerHTML = `<p>${message}</p>`;
  chatWindow.appendChild(userBubble);
  
  // STEP 3: Clear input
  chatInput.value = '';
  
  // STEP 4: Show typing indicator
  let typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = '<p>Typing...</p>';
  chatWindow.appendChild(typingIndicator);
  
  // STEP 5: Process message with AI #2
  setTimeout(() => {
    // Remove typing indicator
    typingIndicator.remove();
    
    // Call chatbot
    let response = processChatMessage(message);  // ← Calls chatBot.js
    
    // STEP 6: Show bot's response
    let botBubble = document.createElement('div');
    botBubble.className = 'chat-bot';
    botBubble.innerHTML = `<div class="message-avatar">🤖</div>
                           <div class="message-content"><p>${response.response}</p></div>`;
    chatWindow.appendChild(botBubble);
    
    // STEP 7: Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 500);
});
```

---

#### **Button 3: BFS City Finder**
```javascript
let bfsBtn = document.getElementById("bfsBtn");
let bfsSelect = document.getElementById("bfsSelect");

bfsBtn.addEventListener('click', () => {
  // STEP 1: Get selected city
  let startCity = bfsSelect.value;  // "Paoay"
  
  // STEP 2: Show loading
  bfsBtn.textContent = "Searching...";
  bfsBtn.disabled = true;
  
  // STEP 3: Call AI #3 (BFS)
  setTimeout(() => {
    let result = findNearestCities(startCity, 3);  // ← Calls bfs.js
    
    // STEP 4: Display results
    displayNearestCities(result.nearestCities);
    
    // STEP 5: Reset button
    bfsBtn.textContent = "Find Nearest";
    bfsBtn.disabled = false;
  }, 300);
});
```

---

## 🔄 **COMPLETE FLOW: User Journey Example**

### **Scenario: User wants beach recommendations in Pagudpud with 4 hours**

```
1. USER ACTION:
   - Opens index.html in browser
   - Selects "Beach" from interest dropdown
   - Selects "Pagudpud" from location dropdown
   - Types "4" in time input
   - Clicks "Get Recommendations" button

2. main.js (Event Handler):
   ↓ Gets button click
   ↓ Reads form values: { interest: "beach", location: "pagudpud", time: 4 }
   ↓ Changes button to "Processing..."
   ↓ Calls matchRules(userInput)

3. ruleEngine.js (AI #1):
   ↓ Loops through 35 rules
   ↓ Finds rule #5: { interest: "beach", location: "pagudpud" }
   ↓ Score: 20 points (matches both interest AND location)
   ↓ Gets recommendations: ["Saud Beach", "Blue Lagoon", "Dos Hermanos Islands"]
   ↓ Looks up details in attractions object
   ↓ Returns full recommendation data

4. main.js (Display):
   ↓ Receives recommendations
   ↓ Creates HTML elements for each attraction
   ↓ Shows: Name, Description, Duration, Price
   ↓ Inserts into <div id="resultsArea">
   ↓ Resets button to "Get Recommendations"

5. USER SEES:
   ✅ Saud Beach - Free, 3-4 hours, Long stretch of white sand...
   ✅ Blue Lagoon - ₱50, 2-3 hours, Scenic lagoon with...
   ✅ Dos Hermanos Islands - ₱200, 2-3 hours, Twin islands...
```

---

## 🧠 **AI Concepts Explained (For Your Professor)**

### **1. Rule-Based Expert System** (ruleEngine.js)
- **Type**: Symbolic AI / Knowledge-Based System
- **How it works**: Uses IF-THEN rules to encode human expertise
- **Example**: IF (interest=beach AND location=pagudpud) THEN recommend (Saud Beach)
- **Advantage**: Transparent, explainable, easy to modify rules
- **Real-world use**: Medical diagnosis systems, troubleshooting guides

### **2. Keyword-Based Chatbot** (chatBot.js)
- **Type**: Natural Language Processing (NLP) - Basic level
- **How it works**: Pattern matching with keyword dictionaries
- **Example**: "beaches" → matches to "beach" interest type
- **Advantage**: Simple, fast, works offline, handles misspellings
- **Real-world use**: FAQ bots, command recognition systems

### **3. Breadth-First Search (BFS)** (bfs.js)
- **Type**: Graph Traversal Algorithm
- **How it works**: Explores graph level-by-level (like ripples in water)
- **Example**: Find 3 nearest cities by exploring neighbors first
- **Advantage**: Guaranteed to find shortest path, systematic exploration
- **Real-world use**: GPS navigation, social network connections, network routing

---

## 💡 **Key Programming Concepts Used**

### **1. Data Structures**
- **Arrays**: `rules = [...]` - Lists of items
- **Objects**: `attractions = { "Name": {...} }` - Key-value pairs like dictionaries
- **Graphs**: `cityGraph = { "City": ["Neighbor1", "Neighbor2"] }` - Connections between nodes

### **2. Control Flow**
- **Loops**: `for (let rule of rules)` - Go through each item
- **Conditionals**: `if (interest === "beach")` - Make decisions
- **Functions**: `function matchRules(input) {...}` - Reusable code blocks

### **3. DOM Manipulation** (Document Object Model)
- `document.getElementById("recommendBtn")` - Find HTML elements
- `element.addEventListener('click', ...)` - Listen for user actions
- `element.innerHTML = "..."` - Change what's displayed

### **4. Asynchronous Programming**
- `setTimeout(() => {...}, 300)` - Delay execution for better UX
- Creates "loading state" illusion while processing

---

## 🎤 **How to Explain to Your Professor**

### **Opening**:
> "Our project is INTA, a tourism assistant for Ilocos Norte that uses 3 different AI techniques to help visitors plan trips."

### **AI Technique #1 - Rule Engine**:
> "The first AI is a rule-based expert system. We created 35 rules that encode tourism knowledge. For example, IF someone likes beaches AND is in Pagudpud, THEN recommend Saud Beach. The system matches user input against all rules, scores them, and returns the best matches. This demonstrates symbolic AI and knowledge representation."

### **AI Technique #2 - Chatbot**:
> "The second AI is a keyword detection chatbot. It uses natural language processing at a basic level - detecting location and interest keywords in user messages. For example, if someone types 'beaches in pagudpud', it detects 'pagudpud' as location and 'beaches' as interest type, then searches our database. It handles misspellings by having multiple keyword variations per concept."

### **AI Technique #3 - BFS**:
> "The third AI uses Breadth-First Search, a graph traversal algorithm. We modeled Ilocos Norte cities as a graph where edges represent proximity. When users select a city, BFS explores neighbors level-by-level to find the 3 nearest cities. This demonstrates graph algorithms and pathfinding, similar to how GPS finds routes."

### **Technical Implementation**:
> "We used pure JavaScript without frameworks to show we understand the fundamentals. The architecture separates data (data.js), logic (AI files), and presentation (HTML/CSS). We have 54 attractions across 18 cities, all researched from official sources."

### **Edge Case Handling**:
> "We also handle edge cases - some cities have limited attractions, so the system suggests nearby alternatives. The UI provides loading states and smooth animations for better user experience."

---

## 🐛 **Common Questions & Answers**

### **Q: Why JavaScript instead of Python?**
A: Web-based deployment. No server needed, runs in any browser. Python would require backend setup.

### **Q: Is this real AI?**
A: Yes! These are classical AI techniques:
- Rule-based systems = 1970s AI (expert systems era)
- Keyword matching = Basic NLP (still used in Alexa/Siri for command recognition)
- BFS = Graph algorithms (core CS/AI curriculum)

### **Q: How is this different from ChatGPT?**
A: ChatGPT uses deep learning (neural networks, billions of parameters). Our system uses symbolic AI (explicit rules, keywords, algorithms). Both are AI, different approaches. Ours is more transparent and explainable.

### **Q: Can it learn from user feedback?**
A: Current version: No (static rules). Could be extended with machine learning to:
- Track which recommendations users click
- Adjust rule scores based on popularity
- Add collaborative filtering (users like you also liked...)

---

## 📊 **Project Statistics**

- **Total Lines of Code**: ~2,500 lines
- **Data Coverage**: 54 attractions, 18 cities, 35 rules
- **File Structure**: 7 files (HTML, CSS, 5 JS files)
- **AI Techniques**: 3 (Rule-based, Keyword chatbot, BFS)
- **Development Time**: Organized in phases (data collection, integration, testing, polish)

---

## ✅ **Final Checklist for Demo**

1. ✅ Open `index.html` in browser
2. ✅ Test Trip Planner: Select beach + Pagudpud + 4 hours → See recommendations
3. ✅ Test Chatbot: Type "food in laoag" → See chatbot response
4. ✅ Test BFS: Select Paoay → See nearest cities (Batac, Laoag, Currimao)
5. ✅ Show edge case: Select Sarrat (empty city) → See helpful message
6. ✅ Explain code flow using this document

---

**Good luck with your presentation! 🚀**

*If professor asks "show me the code", open the specific JS file and walk through the commented sections above.*
