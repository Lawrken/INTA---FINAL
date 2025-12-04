/* data.js
   Contains:
   - rules[] (25-30 rules)
   - attractions{} (40+ spots)
   - cityGraph{} (for BFS)
   - cityAttractions{} (map cities -> attractions)
   - chatbotKeywords{} (locations, interests, budget variants)
*/

/* ===== RULES (35 rules) ===== */
const rules = [
  // Interest-based (history)
  { id: 1, conditions: { interest: "history" }, recommendations: ["Paoay Church","Sinking Bell Tower","Ilocos Museum"], reason: "Historical sites and museums" },
  { id: 2, conditions: { interest: "history" }, recommendations: ["Malacañang of the North","Ferdinand E. Marcos Presidential Center"], reason: "Historical museums and presidential sites" },
  { id: 3, conditions: { interest: "history", timeMax: 2 }, recommendations: ["Sinking Bell Tower","St. William's Cathedral","Bacarra Church"], reason: "Short history visits under 2 hours" },
  { id: 4, conditions: { interest: "history", location: "Laoag" }, recommendations: ["Sinking Bell Tower","St. William's Cathedral","Ilocos Museum"], reason: "History in Laoag" },

  // Beach / nature
  { id: 5, conditions: { interest: "beach", location: "Pagudpud" }, recommendations: ["Saud Beach","Blue Lagoon","Dos Hermanos Islands"], reason: "Top Pagudpud beaches" },
  { id: 6, conditions: { interest: "beach" }, recommendations: ["Saud Beach","Gaang Beach Cove","Pangil Beach"], reason: "Beach destinations" },
  { id: 7, conditions: { interest: "nature", timeMax: 4 }, recommendations: ["Kabigan Falls","Paoay Lake National Park","Darna Falls"], reason: "Nature sites fitting a half-day" },
  { id: 8, conditions: { interest: "nature" }, recommendations: ["Kapurpurawan Rock Formation","Bangui Windmills","Patapat Viaduct"], reason: "Natural wonders and scenic views" },
  { id: 9, conditions: { interest: "nature", location: "Vintar" }, recommendations: ["Vintar Dam","Umok ni Siwawer Eco-Tourism Park","Vintar Hidden Falls"], reason: "Nature attractions in Vintar" },

  // Food
  { id: 10, conditions: { interest: "food", location: "Batac" }, recommendations: ["Batac Empanada","Batac Riverside Empanadahan","Lanie's Batac Special Empanada"], reason: "Batac food specialties" },
  { id: 11, conditions: { interest: "food", location: "Laoag" }, recommendations: ["Laoag Public Market","Dawang's Eatery","La Preciosa","Kamalig Restaurant"], reason: "Laoag dining options" },
  { id: 12, conditions: { interest: "food" }, recommendations: ["Batac Empanada","Paoay Cornick","Pasuquin Biscocho","Vintar Bibingka"], reason: "Local food specialties" },
  { id: 13, conditions: { interest: "food", location: "Paoay" }, recommendations: ["Kusina Valentin","Paoay Cornick"], reason: "Paoay food spots" },

  // Adventure
  { id: 14, conditions: { interest: "adventure" }, recommendations: ["La Paz Sand Dunes","Sand Dune ATV Tours","Paoay Sand Dunes"], reason: "Adventure and adrenaline activities" },
  { id: 15, conditions: { interest: "adventure", location: "Vintar" }, recommendations: ["Mount Baguinsuso","Umok ni Siwawer Eco-Tourism Park"], reason: "Adventure in Vintar" },

  // Location-based rules
  { id: 16, conditions: { location: "Laoag" }, recommendations: ["Sinking Bell Tower","La Paz Sand Dunes","Ilocos Museum","Laoag Public Market"], reason: "Top Laoag attractions" },
  { id: 17, conditions: { location: "Paoay" }, recommendations: ["Paoay Church","Malacañang of the North","Paoay Lake National Park"], reason: "Top Paoay attractions" },
  { id: 18, conditions: { location: "Bangui" }, recommendations: ["Bangui Windmills","Bangui Beachfront"], reason: "Bangui highlights" },
  { id: 19, conditions: { location: "Burgos" }, recommendations: ["Cape Bojeador Lighthouse","Kapurpurawan Rock Formation","EDC Burgos Wind Farm"], reason: "Burgos highlights" },
  { id: 20, conditions: { location: "Pagudpud" }, recommendations: ["Saud Beach","Blue Lagoon","Kabigan Falls","Patapat Viaduct"], reason: "Pagudpud must-sees" },
  { id: 21, conditions: { location: "Currimao" }, recommendations: ["Gaang Beach Cove","Pangil Beach","Sitio Remedios Heritage Resort"], reason: "Currimao attractions" },
  { id: 22, conditions: { location: "Vintar" }, recommendations: ["Vintar Dam","Mount Baguinsuso","Umok ni Siwawer Eco-Tourism Park"], reason: "Vintar highlights" },

  // Time-based rules
  { id: 23, conditions: { timeMax: 1 }, recommendations: ["Paoay Church","Sinking Bell Tower","St. William's Cathedral"], reason: "Good 1-hour stops" },
  { id: 24, conditions: { timeMax: 2 }, recommendations: ["Ilocos Museum","Ferdinand E. Marcos Presidential Center","Cape Bojeador Lighthouse"], reason: "2-hour cultural visits" },
  { id: 25, conditions: { timeMax: 3 }, recommendations: ["Paoay Lake National Park","La Paz Sand Dunes","Blue Lagoon"], reason: "3-hour activities" },

  // Combined examples
  { id: 26, conditions: { interest: "beach", timeMax: 4 }, recommendations: ["Saud Beach","Blue Lagoon","Gaang Beach Cove"], reason: "Half-day beach trip" },
  { id: 27, conditions: { interest: "nature", location: "Burgos" }, recommendations: ["Kapurpurawan Rock Formation","Burgos Cliffs","EDC Burgos Wind Farm"], reason: "Nature in Burgos" },
  { id: 28, conditions: { interest: "nature", location: "Dumalneg" }, recommendations: ["Darna Falls","Ballog Grove"], reason: "Nature in Dumalneg" },
  
  // Cultural/heritage focused
  { id: 29, conditions: { interest: "history", location: "San Nicolas" }, recommendations: ["Pagburnayan"], reason: "Pottery heritage in San Nicolas" },
  { id: 30, conditions: { interest: "history", location: "Batac" }, recommendations: ["Ferdinand E. Marcos Presidential Center","Batac Empanada"], reason: "Batac heritage" },
  { id: 31, conditions: { interest: "history", location: "Adams" }, recommendations: ["Adams Indigenous Community"], reason: "Cultural tourism in Adams" },
  
  // Eco-tourism
  { id: 32, conditions: { interest: "nature", location: "Nueva Era" }, recommendations: ["Nueva Era Eco Park"], reason: "Eco park activities" },
  
  // Misc / fallback rules
  { id: 33, conditions: { interest: "food" }, recommendations: ["Laoag Public Market","Batac Empanada","Paoay Cornick"], reason: "Food specialties" },
  { id: 34, conditions: { location: "Pasuquin" }, recommendations: ["Pasuquin Salt Making","Pasuquin Biscocho"], reason: "Pasuquin specialties" },
  { id: 35, conditions: { location: "Badoc" }, recommendations: ["Badoc Island"], reason: "Island getaway" }
];

/* ===== ATTRACTIONS (50+ entries) ===== */
/* Each attraction: city, type, price, duration (string), description */
const attractions = {
  // Laoag attractions
  "Sinking Bell Tower": { city: "Laoag", type: "history", price: "Free", duration: "30 min", description: "Historic 45-meter bell tower from 1612 showing visible sinking, partially buried door" },
  "St. William's Cathedral": { city: "Laoag", type: "history", price: "Free", duration: "30 min", description: "Italian Renaissance-style cathedral from 1586, oldest town established by Augustinians" },
  "Ilocos Museum": { city: "Laoag", type: "history", price: "₱50", duration: "1 hour", description: "Provincial museum showcasing Ilocano history, culture, and artifacts" },
  "Fort Ilocandia Resort": { city: "Laoag", type: "beach", price: "Day pass varies", duration: "2-3 hours", description: "77-hectare premier resort with 2-kilometer beachfront, beach activities and dining" },
  "Laoag Public Market": { city: "Laoag", type: "food", price: "₱20-100", duration: "1-2 hours", description: "Main food market selling fresh seafood, local empanadas, biscocho, cornick, and traditional foods" },
  "Dawang's Eatery": { city: "Laoag", type: "food", price: "₱150-300", duration: "1 hour", description: "Popular local restaurant famous for authentic bagnet, pinakbet, and Ilocano specialties" },
  "La Preciosa": { city: "Laoag", type: "food", price: "₱200-400", duration: "1-2 hours", description: "Upscale Ilocano restaurant serving bagnet, longganisa, and traditional dishes" },
  "La Moda Panciteria": { city: "Laoag", type: "food", price: "₱80-150", duration: "45 min", description: "Long-running local institution famous for silky smooth pancit canton guisado" },
  "Kamalig Restaurant": { city: "Laoag", type: "food", price: "₱200-350", duration: "1-2 hours", description: "Local favorite serving Filipino comfort food with Ilocano specialties" },
  "Elvie's Empanada": { city: "Laoag", type: "food", price: "₱30-60", duration: "30 min", description: "Popular empanada vendor known for sweet empanada variations" },
  "La Paz Sand Dunes": { city: "Laoag", type: "adventure", price: "₱200+", duration: "2-3 hours", description: "Sand dune 4x4 and sandboarding adventure" },
  "Sand Dune ATV Tours": { city: "Laoag", type: "adventure", price: "₱500+", duration: "2 hours", description: "Paid ATV experience through sand dunes" },
  
  // Batac attractions
  "Batac Empanada": { city: "Batac", type: "food", price: "₱30-60", duration: "30 min", description: "Iconic orange empanada filled with green papaya, mung beans, longganisa, and egg" },
  "Batac Riverside Empanadahan": { city: "Batac", type: "food", price: "₱30-60", duration: "45 min", description: "Hub of empanada stalls with on-the-spot made empanadas and local specialties" },
  "Lanie's Batac Special Empanada": { city: "Batac", type: "food", price: "₱40-60", duration: "30 min", description: "Traditional empanadas with unique twists including sisaron, moringa, or cheese fillings" },
  "Ferdinand E. Marcos Presidential Center": { city: "Batac", type: "history", price: "₱100-150", duration: "1-2 hours", description: "Museum and mausoleum dedicated to former President Ferdinand Marcos" },
  
  // Paoay attractions
  "Paoay Church": { city: "Paoay", type: "history", price: "₱50", duration: "45 min", description: "UNESCO World Heritage Site featuring Earthquake Baroque architecture with massive buttresses" },
  "Malacañang of the North": { city: "Paoay", type: "history", price: "₱50-100", duration: "1-2 hours", description: "Presidential museum and national park overlooking Paoay Lake with Marcos-era exhibits" },
  "Paoay Lake National Park": { city: "Paoay", type: "nature", price: "₱50-100", duration: "1-3 hours", description: "386-hectare freshwater lake with water sports, picnic areas, and scenic views" },
  "Kusina Valentin": { city: "Paoay", type: "food", price: "₱150-350", duration: "1-2 hours", description: "Restaurant facing Paoay Church famous for Pinakbet Pizza and authentic bagnet" },
  "Paoay Cornick": { city: "Paoay", type: "food", price: "₱50-100", duration: "30 min", description: "Semi-popped fried corn snack made from lime-treated glutinous corn" },
  "Paoay Sand Dunes": { city: "Paoay", type: "adventure", price: "₱200+", duration: "2 hours", description: "Sunset dune tours and 4x4 rides" },
  
  // Pagudpud attractions
  "Blue Lagoon": { city: "Pagudpud", type: "beach", price: "Free", duration: "2-3 hours", description: "Stunning turquoise lagoon with crystal-clear waters and white sand beach" },
  "Saud Beach": { city: "Pagudpud", type: "beach", price: "Free", duration: "2-3 hours", description: "Natural white-sand beach, famous as the 'Boracay of the North'" },
  "Kabigan Falls": { city: "Pagudpud", type: "nature", price: "₱30-50", duration: "1.5-2 hours", description: "87-112 foot waterfall with natural basin surrounded by lush rainforest" },
  "Patapat Viaduct": { city: "Pagudpud", type: "nature", price: "Free", duration: "45 min", description: "Spectacular coastal bridge with panoramic views of Pasaleng Bay and mountains" },
  "Dos Hermanos Islands": { city: "Pagudpud", type: "beach", price: "₱500-1000", duration: "2-3 hours", description: "Twin rock formations featuring white-sand beach, clear waters, and snorkeling" },
  
  // Bangui attractions
  "Bangui Windmills": { city: "Bangui", type: "nature", price: "Free", duration: "45 min", description: "15 iconic wind turbines along Bangui Bay providing 40% of Ilocos Norte electricity" },
  "Bangui Beachfront": { city: "Bangui", type: "beach", price: "Free", duration: "1-2 hours", description: "Beach near the windmills with scenic views" },
  
  // Burgos attractions
  "Kapurpurawan Rock Formation": { city: "Burgos", type: "nature", price: "₱30-50", duration: "1.5-2 hours", description: "Unique white limestone and coral rock formations shaped by wind and water" },
  "Cape Bojeador Lighthouse": { city: "Burgos", type: "history", price: "₱50-100", duration: "1-2 hours", description: "Tallest lighthouse in the country built 1887-1890, Spanish colonial brick structure" },
  "EDC Burgos Wind Farm": { city: "Burgos", type: "nature", price: "₱150-200", duration: "1-2 hours", description: "Largest wind farm in Southeast Asia with 50 wind turbines covering 600 hectares" },
  "Burgos Cliffs": { city: "Burgos", type: "nature", price: "Free", duration: "1-2 hours", description: "Scenic coastal cliffs with ocean views" },
  
  // Pasuquin attractions
  "Pasuquin Salt Making": { city: "Pasuquin", type: "history", price: "Free", duration: "1 hour", description: "Traditional salt-making cottage industry, claimed finest salt in Philippines" },
  "Pasuquin Biscocho": { city: "Pasuquin", type: "food", price: "₱100-200", duration: "30 min", description: "Famous specialty bread made from day-old sweet rolls, popular pasalubong" },
  
  // Currimao attractions
  "Gaang Beach Cove": { city: "Currimao", type: "beach", price: "Free", duration: "1-2 hours", description: "Wide expanse of unpolluted beach with tranquil waters" },
  "Sitio Remedios Heritage Resort": { city: "Currimao", type: "history", price: "₱500+", duration: "2-3 hours", description: "Private village resort with vintage brick and wood villas from salvaged old structures" },
  "Irene's Native Delicacies": { city: "Currimao", type: "food", price: "₱20-100", duration: "30 min", description: "Local delicacies producer selling traditional Ilocano sweets and pasalubong items" },
  "Pangil Beach": { city: "Currimao", type: "beach", price: "Free", duration: "1-2 hours", description: "Beach bordered by extensive coral rock formations with shallow calm waters" },
  
  // Bacarra attractions
  "Bacarra Church": { city: "Bacarra", type: "history", price: "Free", duration: "30 min", description: "Built 1593 with Baroque architecture and prominent red brick exterior, National Cultural Treasure" },
  
  // Badoc attractions
  "Badoc Island": { city: "Badoc", type: "beach", price: "₱1100", duration: "2-3 hours", description: "Privately owned island with white-sand beach, crystal-clear waters, and unique shell rock formations" },
  
  // Dumalneg attractions
  "Darna Falls": { city: "Dumalneg", type: "nature", price: "Free", duration: "1.5-2 hours", description: "Waterfall offering cool refreshing air in unspoiled natural setting" },
  "Ballog Grove": { city: "Dumalneg", type: "nature", price: "Free", duration: "2-3 hours", description: "Scenic picnic grove with unique Aro-o trees and crystal-clear lagoon" },
  
  // Nueva Era attractions
  "Nueva Era Eco Park": { city: "Nueva Era", type: "nature", price: "₱100-200", duration: "2-3 hours", description: "Eco-cultural park featuring swimming pools, museum, dining, and hanging bridge" },
  
  // Vintar attractions
  "Mount Baguinsuso": { city: "Vintar", type: "adventure", price: "Free", duration: "3-4 hours", description: "Active volcano and highest peak in province, hiking destination with cloud views" },
  "Vintar Dam": { city: "Vintar", type: "nature", price: "Free", duration: "1-2 hours", description: "First dam funded by World Bank in Southeast Asia, kayaking and sunset viewing available" },
  "Umok ni Siwawer Eco-Tourism Park": { city: "Vintar", type: "nature", price: "₱50-100", duration: "2-3 hours", description: "Popular picnic resort with hiking, waterfalls, kayaking, zip-lining, and mountain biking" },
  "Vintar Hidden Falls": { city: "Vintar", type: "nature", price: "Free", duration: "1.5-2 hours", description: "Unspoiled waterfall in remote area perfect for rejuvenating hike" },
  "Vintar Bibingka": { city: "Vintar", type: "food", price: "₱30-80", duration: "30 min", description: "Local specialty made from glutinous rice flour, molasses, and coconut" },
  
  // Dingras attractions
  "Dingras Church": { city: "Dingras", type: "history", price: "Free", duration: "30 min", description: "Historic parish church" },
  "Madongan River Diversion Dam": { city: "Dingras", type: "nature", price: "Free", duration: "1-2 hours", description: "Tourist destination with natural charm featuring man-made falls" },
  
  // San Nicolas attractions
  "Pagburnayan": { city: "San Nicolas", type: "history", price: "Free", duration: "1 hour", description: "Pottery and ceramic artisan community with traditional pottery-making demonstrations" },
  
  // Pinili attractions
  "Pinili Basketry": { city: "Pinili", type: "history", price: "varies", duration: "1-2 hours", description: "Municipality known for basketry and rattan crafts, artisan community with traditional woven items" },
  
  // Adams attractions
  "Adams Indigenous Community": { city: "Adams", type: "history", price: "₱150-200", duration: "2-3 hours", description: "Single-barangay municipality with tribal communities and cultural tourism experiences" }
};

/* ===== CITY GRAPH (bidirectional expected) ===== */
const cityGraph = {
  "Laoag": ["Batac","San Nicolas","Bacarra","Paoay","Badoc"],
  "Batac": ["Laoag","Paoay","Currimao"],
  "Paoay": ["Laoag","Batac","Currimao"],
  "Pagudpud": ["Bangui","Dumalneg"],
  "Bangui": ["Pagudpud","Burgos"],
  "Burgos": ["Bangui","Pasuquin"],
  "Sarrat": ["San Nicolas","Dingras"],
  "Bacarra": ["Laoag","Pasuquin"],
  "San Nicolas": ["Laoag","Sarrat","Pinili"],
  "Pasuquin": ["Burgos","Bacarra"],
  "Currimao": ["Batac","Paoay"],
  "Dingras": ["Sarrat","Vintar"],
  "Dumalneg": ["Pagudpud","Adams"],
  "Badoc": ["Laoag"],
  "Vintar": ["Dingras","Nueva Era"],
  "Nueva Era": ["Vintar"],
  "Pinili": ["San Nicolas"],
  "Adams": ["Dumalneg"]
};

/* cityAttractions mapping (city -> array of attraction names) */
const cityAttractions = {
  "Laoag": ["Sinking Bell Tower","St. William's Cathedral","Ilocos Museum","Fort Ilocandia Resort","Laoag Public Market","Dawang's Eatery","La Preciosa","La Moda Panciteria","Kamalig Restaurant","Elvie's Empanada","La Paz Sand Dunes","Sand Dune ATV Tours"],
  "Batac": ["Batac Empanada","Batac Riverside Empanadahan","Lanie's Batac Special Empanada","Ferdinand E. Marcos Presidential Center"],
  "Paoay": ["Paoay Church","Malacañang of the North","Paoay Lake National Park","Kusina Valentin","Paoay Cornick","Paoay Sand Dunes"],
  "Pagudpud": ["Blue Lagoon","Saud Beach","Kabigan Falls","Patapat Viaduct","Dos Hermanos Islands"],
  "Bangui": ["Bangui Windmills","Bangui Beachfront"],
  "Burgos": ["Kapurpurawan Rock Formation","Cape Bojeador Lighthouse","EDC Burgos Wind Farm","Burgos Cliffs"],
  "Pasuquin": ["Pasuquin Salt Making","Pasuquin Biscocho"],
  "Currimao": ["Gaang Beach Cove","Sitio Remedios Heritage Resort","Irene's Native Delicacies","Pangil Beach"],
  "Bacarra": ["Bacarra Church"],
  "Badoc": ["Badoc Island"],
  "Dumalneg": ["Darna Falls","Ballog Grove"],
  "Nueva Era": ["Nueva Era Eco Park"],
  "Vintar": ["Mount Baguinsuso","Vintar Dam","Umok ni Siwawer Eco-Tourism Park","Vintar Hidden Falls","Vintar Bibingka"],
  "Dingras": ["Dingras Church","Madongan River Diversion Dam"],
  "San Nicolas": ["Pagburnayan"],
  "Pinili": ["Pinili Basketry"],
  "Adams": ["Adams Indigenous Community"],
  "Sarrat": []
};

/* Nearby suggestions for cities with limited attractions */
const nearbyCitySuggestions = {
  "Sarrat": ["San Nicolas", "Dingras"],
  "San Nicolas": ["Laoag", "Sarrat"],
  "Pinili": ["San Nicolas", "Laoag"],
  "Adams": ["Dumalneg", "Pagudpud"],
  "Bacarra": ["Laoag", "Pasuquin"],
  "Badoc": ["Laoag", "Batac"],
  "Nueva Era": ["Vintar"],
  "Dingras": ["Sarrat", "Vintar"]
};

/* ===== CHATBOT KEYWORDS (variants + typos) ===== */
const chatbotKeywords = {
  locations: {
    "laoag": ["laoag","laog","la0ag","laoag city"],
    "pagudpud": ["pagudpud","pagudpod","pagupud"],
    "batac": ["batac","batak","batac city"],
    "paoay": ["paoay","paway","paoay church"],
    "bangui": ["bangui","banguey","bangi","bange","bangay"],
    "burgos": ["burgos","burguz","burg0s"],
    "currimao": ["currimao","kurimao","currimau","currimao beach"],
    "bacarra": ["bacarra","bakarra","bacara"],
    "san nicolas": ["san nicolas","sannicolas","san-nicolas"],
    "pasuquin": ["pasuquin","pasukin","pasuquin salt"],
    "vintar": ["vintar","binter"],
    "dumalneg": ["dumalneg","dumaleng"],
    "badoc": ["badoc","badok"],
    "nueva era": ["nueva era","nueva"],
    "dingras": ["dingras","dingraz"],
    "pinili": ["pinili","penili"],
    "adams": ["adams","adam"],
    "sarrat": ["sarrat","sarat"]
  },
  interests: {
    "history": ["history","historical","heritage","museum","church","cultural"],
    "beach": ["beach","dagat","swimming","sea","shore","island"],
    "food": ["food","kain","restaurant","eat","empanada","carinderia","delicacies"],
    "nature": ["nature","waterfall","lake","falls","viewpoint","park","eco","dam"],
    "adventure": ["adventure","sand","atv","kitesurf","dune","hike","hiking","climbing","mountain"]
  }
};
