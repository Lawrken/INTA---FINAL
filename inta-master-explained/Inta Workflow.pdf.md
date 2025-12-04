# INTA PROJECT BRIEFING

Project Name: INTA - llocos Norte Tourism Assistant

Type: Web-Based Al Application

Language: JavaScript (Frontend) + HTML/CSS

Due Date: Monday

Team Size: 3 people (2 coders + 1 researcher)

# WHAT WE'RE BUILDING

A single-page web application that helps tourists plan their llocos Norte trip using 3 Al techniques:

Rule-Based Expert System - Recommends attractions based on user preferences

Keyword Chatbot -Answers questions using keyword detection

BFS Search Algorithm - Finds nearest attractions using graph traversal

No backend, no database, no server - everything runs in the browser.

# SYSTEM ARCHITECTURE

INTA System

Frontend (User Interface)

Lindex.html (Single HTML file with embedded CSS)

Data Layer

data.js

rules[] - 25-30 IF-THEN rules

attractions{} - 40+ tourist spots with details

cityGraph{} - City connections for BFS

chatbotKeywords{}-Keyword mappings

Al Logic Layer

ruleEngine.js - Matches user input to rules

chatbot.js-Detects keywords and responds

bfs.js - Implements Breadth-First Search

Integration Layer

main.js - Connects UI to Al logic


![](https://web-api.textin.com/ocr_image/external/6232efb1bda246c4.jpg)

# FILE STRUCTURE

<!-- INTA/ index.html scripts/ -->
![](https://web-api.textin.com/ocr_image/external/99e2c6f4f654b99a.jpg)

# Main page (UI)

data.js

# All data (rules, attractions, graph)

-ruleEngine.js # Rule matching algorithm

-chatbot.js# Keyword detection logic

bfs.js

# Graph search algorithm

main.js

# UI event handlers

Total: 6 files (simple and organized)

# TECHNOLOGIES & LANGUAGES

ComponentTechnologyWhyFrontendHTML5+CSS3For layout and stylingLogicJavaScript

(ES6)For Al algorithmsData StorageJavaScript ObjectsNo database

neededDeploymentNoneJust open HTML file in browser

No frameworks needed - Pure vanilla JavaScript (easier to understand and debug)


![](https://web-api.textin.com/ocr_image/external/5d2b51feda044396.jpg)

# THE 3 AI COMPONENTS EXPLAINED

1. RULE-BASED EXPERT SYSTEM

What it does:

Recommends attractions by matching IF-THEN rules.

How it works:

IF userinterest = "history" AND userbudget = "low"

THEN recommend ["Paoay Church", "Sinking Bell Tower", "Museo llocos Norte"]

User inputs:

Interest (history/beach/food/nature/adventure)

Budget (low/medium/high)

Location (city name)

Available time (in hours)

System output:

List of recommended attractions

Which rules were matched

Details (price, duration, description)

Function signature:

javascriptfunction matchRules(userlnput) {

// Input: { interest, budget, location, time }

// Output: { matchedRules[], recommendations[]}

}

---

## ### **2. KEYWORD CHATBOT**

**What it does :**

Answers tourist questions by detecting keywords.

**How it works :**

、、、

User: "Where can I eat in Batac?"

↓

Detect: locatic $on="Batac",$ $,interest="food"$ 

↓

Return: $"In$ Batac, try Batac Empanada, Riverside Empanadaan..."

Features:

Detects location keywords (Laoag, Pagudpud, Batac, etc.)

Detects interest keywords (history, beach, food, etc.)

Detects budget keywords (cheap, expensive, etc.)

Handles typos (fuzzy matching: $"Laog"\rightarrow "Laoag")$ 

Fallback response if no keywords detected

Priority logic:

Location (highest priority) - If detected, show attractions in that city

Interest +Budget- Show attractions matching both

Interest only - Show all attractions of that type

No match - Show fallback message

Function signature:

javascriptfunction processChatMessage(userMessage){

// Input: "cheap food in Laoag"

// Output: { success, type, response }

}

...

---

###**3. BFS (BREADTH-FIRST SEARCH) ALGORITHM**

**What it does :**

Finds the nearest cities from a starting point using graph traversal.

**How it works :**

、、、

City Graph:

Laoag --- Batac

-

-

Bacarra Paoay

User starts in: Paoay

BFS order: Paoay → Batac → Laoag → Bacarra

Data structure:

javascriptcityGraph ={

"Laoag": ["Batac", "Bacarra", "San Nicolas", "Paoay"],

"Batac": ["Laoag", "Paoay", "Currimao"],

"Paoay": ["Laoag", "Batac", "Currimao"],

//...more cities

}

Algorithm steps:

Start at selected city

Visit all direct neighbors first (breadth-first)

Then visit neighbors of neighbors

Return 3 nearest cities

Show attractions from those cities

Function signature:

javascriptfunction findNearestCities(startCity,limit=3){

// Input: "Paoay", 3

// Output: { nearestCities[], attractions[] }

}


![](https://web-api.textin.com/ocr_image/external/bef0442cbb0284bd.jpg)

DATA STRUCTURES

1. Rules Array

javascriptconst $\text {rules=[}$ 

{

id:1,

conditions: {

interest: "history",

budget: $"low"$ 

},

recommendations: ["Paoay Church", "Sinking Bell Tower"],

reason: "Free historical sites"

},

{

id:2,

conditions: {

location: "Pagudpud",

interest: "beach"

},

recommendations: ["Saud Beach", "Blue Lagoon"],

reason: "Top beaches in Pagudpud"

了

// ... 23-28 more rules

];

Rule categories needed:

Interest-based rules (8-10 rules)

Budget-based rules (5-7 rules)

Location-based rules (8-10 rules)

Time-based rules (4-5 rules)

2. Attractions Object

javascriptconst attractions ={

"Paoay Church":{

city:"Paoay",

type:"history",

price:"free",

duration: "1 hour",

description:"UNESCO World Heritage baroque church"

},

"Saud Beach": {

city: "Pagudpud",

type:"beach",

price:"free",

duration: "3-4 hours",

description: "Pristine white sand beach"

},

"Batac Empanada": {

city:"Batac",

type:"food",

price: "P30-50",

duration: "30 min",

description: "Famous orange empanada"

｝了

// ... 37+ more attractions

};

Required fields:

city - Which city it's in

type - history/beach/food/nature/adventure

price - Free, P50, P100-200, etc.

duration - How long to spend there

description - 1 sentence

# 3. City Graph

javascriptconst cityGraph ={

"Laoag": ["Batac", "San Nicolas", "Bacarra", "Paoay"],

"Batac": ["Laoag", "Paoay", "Currimao"],

"Paoay": ["Laoag", "Batac", "Currimao"],

"Pagudpud": ["Bangui", "Dumalneg"],

"Bangui": ["Pagudpud", "Burgos"],

"Burgos": ["Bangui", "Pasuquin"],

"Sarrat": ["San Nicolas", "Dingras"],

"Bacarra": ["Laoag", "Pasuquin"],

"San Nicolas": ["Laoag", "Sarrat"],

"Pasuquin": ["Burgos", "Bacarra"],

"Currimao": ["Batac", "Paoay"],

"Dingras": ["Sarrat"],

"Dumalneg": ["Pagudpud"]

};

const cityAttractions = {

"Laoag": ["Sinking Bell Tower", "La Paz Sand Dunes", "Museo llocos Norte"],

"Batac": ["Batac Empanada", "Marcos Museum"],

"Paoay": ["Paoay Church", "Malacañang of the North", "Paoay Lake"],

"Pagudpud": ["Saud Beach", "Blue Lagoon", "Kabigan Falls"]

// ... more cities

};

# 4. Chatbot Keywords

javascriptconst chatbotKeywords = {

locations: {

"laoag": ["laoag", "laog", "la0ag"], // Typo variants

"pagudpud": ["pagudpud","pagudpod","pagupud"],

"batac": ["batac", "batak"],

"paoay": ["paoay", "paway"]

// ... more cities

},

interests: {

"history": ["history", "historical", "heritage", "museum", "church"],

"beach": ["beach", "dagat", "swimming","sea"],

"food": ["food", "kain", "restaurant","eat", "empanada"]

// ... more interests

},

budget: {

"low": ["cheap", "budget", "affordable", "mura", "free"],

"high": ["expensive", "luxury", "mahal"]

｝了

};

---

## SYSTEM WORKFLOW

### **Feature 1: Recommendation Form Flow**

.、、

# 1. User fills form:

- Interest: "history"

- Budget: "low"

- Location: "Laoag"

- Time: "3 hours"

2. User clicks "Get Recommendations"

3. System calls: matchRules(userlnput)

4. Rule engine checks all 30 rules:

- Rule #5 matches: history + low budget✓

- Rule #12 matches: Laoag location✓

- Rule #18 matches: time &lt;=3 hours✓

5. System combines recommendations:

- Removes duplicates

- Adds attraction details

- Calculates total time

6. Display results:

"Matched 3 rules. Recommended attractions:

·Sinking Bell Tower (Free, 1 hour)

·Museo llocos Norte (P20, 1.5 hours)

Total time: 2.5 hours (fits your 3-hour schedule)"

---

### **Feature 2: Chatbot Flow**

...

1. User types: "cheap food in Batac"

2. System calls: processChatMessage("cheap food in Batac")

# 3. Keyword detection:

- Scans for location keywords → Found "Batac"

- Scans for interest keywords → Found "food"

- Scans for budget keywords → Found "cheap"

# 4. Priority logic:

-Location detected (highest priority)✓

5. Lookup cityAttractions["Batac"] → Filter by type="food"

6. Response:

"In Batac, affordable food spots:

· Batac Empanada (P30-50)

·Riverside Empanadaan (P40-60)

·Local carinderias (P50-100)"

---

**###** **Feature 3: BFS Flow**

、、、

1. User selects: "Starting from Paoay"

2. User clicks: "Find Nearest"

3. System calls: findNearestCities("Paoay", 3)

4. BFS algorithm:

Queue: [Paoay]

Visited: []

Step 1: Process Paoay

- Mark as visited

- Add neighbors to queue: [Laoag, Batac, Currimao]

Step 2: Process Laoag (next in queue)

- Mark as visited

- Add neighbors: [Batac, Bacarra, San Nicolas]

Step 3: Process Batac

-Already visited, skip

Result: [Paoay, Laoag, Currimao]

# 5. Get attractions from these 3 cities

6. Display:

"Nearest cities from Paoay:

1. Paoay (current) - Paoay Church, Malacañang

2. Laoag (1 hop) - Sinking Bell Tower, Sand Dunes

3. Currimao (1 hop) - Currimao Beach, Fort"

---

# ## USER INTERFACE COMPONENTS

# ### **Required UI Elements :**

1. **Header Section **

- Title: "INTA - Ilocos Norte Tourism Assistant"

- Subtitle: "Your Al-Powered Travel Guide"

# 2. **Feature 1:Recommendation Form**

- Dropdown: Interest (5 options)

- Dropdown: Budget (3 options)

- Dropdown: Location (8-10 cities)

- Input field: Time (number)

- Button: "Get Recommendations"

3.**Feature 2: Chatbot**

- Chat window (scrollable, 250px height)

- Text input: "Type your question ..."

- Button: "Send"

4. **Feature 3: BFS Finder**

- Dropdown: Starting city

- Button: "Find Nearest"

5. **Results Display Area**

- Shows output from any of the 3 features

- Formatted with bullet points

- Can show/hide dynamically

---

<!-- ## -->

<!--  -->

<!-- TEAM TASK BREAKDOWN -->

### ** CODER 1 (Other Coder) - Frontend & UI**

**Responsibilities :**

- Create 'index.html' with all UI elements

- Write CSS styling (make it look good)

- Create form inputs and dropdowns

- Design chatbot window layout

- Style results display area

**Files to create :**

- 'index.html' (everything in one file is fine)

**Estimated time:** 4-6 hours

**Skills needed :**

- Basic HTML

- Basic CSS (flexbox, colors, borders)

- No JavaScript needed (I'll handle that)

---

###** RESEARCHER (Non-Coder) - Data Collection **

**Responsibilities :**

- Research 40+ llocos Norte attractions

- Document details (city, type, price, duration, description)

- Create 25-30 recommendation rules

- List keyword variants for chatbot

- Map city connections for graph

**Deliverable format :**

Google Sheet or text file with:

、、、

ATTRACTIONS:

Name | City | Type | Price | Duration | Description

Paoay Church | Paoay | history | Free | 1 hour | UNESCO baroque church

...

## RULES:

Rule 1: IF interest=history AND budget=low THEN recommend [Paoay Church, Museo]

Rule 2: IF location=Pagudpud AND interest=beach THEN recommend [Saud Beach, Blue Lagoon]

<!-- ... -->

## CITY CONNECTIONS:

Laoag connects to: Batac, Bacarra, San Nicolas, Paoay

Batac connects to: Laoag, Paoay, Currimao

...

KEYWORDS:

Laoag variants: laoag, laog, la0ag

Beach keywords: beach, dagat, swimming, sea

...

Estimated time: 6-8 hours

Skills needed:

Google search

Basic spreadsheet skills

Attention to detail


![](https://web-api.textin.com/ocr_image/external/4bb0ed45a18e5021.jpg)

# CODER 2 (You) - Al Logic & Integration

Responsibilities:

Write data.js (convert researcher's data to JavaScript)

Write ruleEngine.js (rule matching algorithm)

Write chatbot.js (keyword detection logic)

Write bfs.js (graph traversal algorithm)

Write main.js (connect everything to UI)

Test and debug entire system

# Files to create:

data.js

ruleEngine.js

chatbot.js

bfs.js

main.js

Estimated time: 12-16 hours

Skills needed:

JavaScript (arrays, objects, loops, functions)

Algorithm implementation (IF-THEN, BFS)

DOM manipulation

Debugging

Verify fallback message works

# BFS returns empty:

Check if starting city exists in graph

Verify graph connections are bidirectional

Console.log the queue and visited set

Testing Strategy:

javascript// Test each function individually

console.log("Testing matchRules:");

console.log(matchRules({

interest: "history",

budget:"low",

location: "Laoag",

time:3

}));

