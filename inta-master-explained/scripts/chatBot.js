/* chatbot.js
   Implements processChatMessage(userMessage)
   - Detects location, interest, budget via chatbotKeywords
   - Priority: location > (interest + budget) > interest > fallback
   Returns: { success: boolean, type: "location"|"interest"|"fallback", response: string }
*/

(function(global){
  function normalizeText(s){
    return (s || "").toLowerCase();
  }

  // fuzzy detection: checks if any variant is present in text
  function detectFromVariants(text, variantsMap){
    for(const key in variantsMap){
      const variants = variantsMap[key];
      for(const v of variants){
        if(text.includes(v)) return key;
      }
    }
    return null;
  }

  function detectInterest(text){
    return detectFromVariants(text, chatbotKeywords.interests);
  }

  function detectLocation(text){
    return detectFromVariants(text, chatbotKeywords.locations);
  }

  function getAttractionsForCity(city, filterType){
    const list = cityAttractions[city] || [];
    if(!filterType) return list;
    return list.filter(name => {
      const a = attractions[name];
      return a && a.type === filterType;
    });
  }

  function shortListToText(list){
    if(!list || list.length === 0) return "No matching attractions found.";
    return list.map(n => {
      const a = attractions[n];
      if(a){
        // Show prices only for food-type attractions
        if (a.type === "food") {
          return `• ${n} (${a.price}, ${a.duration}) - ${a.description}`;
        }
        return `• ${n} (${a.duration}) - ${a.description}`;
      }
      return `• ${n}`;
    }).join("\n");
  }

  function processChatMessage(userMessage){
    const text = normalizeText(userMessage);

    // greeting-only messages: respond warmly instead of showing an error
    const greetingWords = ["hi","hello","hey","kumusta","good morning","good afternoon","good evening"];
    const cleaned = text.replace(/[^\w\s]/g, " ").trim();
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    if (tokens.length > 0 && tokens.every(w => greetingWords.includes(w))) {
      return {
        success: true,
        type: "greeting",
        response:
          "Hello! I’m your Ilocos Norte Tourism Assistant.\n" +
          "Tell me a location (like Laoag or Pagudpud) or an interest (like beach, food, or history), and I’ll recommend places for you."
      };
    }

    // detect location first (highest priority)
    const loc = detectLocation(text);
    if(loc){
      // standardize city key to cityAttractions key if possible
      const cityKey = Object.keys(cityAttractions).find(c => c.toLowerCase() === loc) || loc;
      const cityName = capitalizeCityKey(cityKey);
      // show attractions in that city
      const interest = detectInterest(text); // optional filter
      const filtered = getAttractionsForCity(cityName, interest);
      
      // Check if city has limited/no attractions and provide helpful suggestions
      const totalInCity = cityAttractions[cityName] ? cityAttractions[cityName].length : 0;
      const suggestions = nearbyCitySuggestions[cityName] || [];

      if (!interest) {
        if (totalInCity === 0) {
          const suggestionText = suggestions.length > 0
            ? `Try nearby cities: ${suggestions.join(", ")}`
            : "Try cities like Laoag, Pagudpud, or Paoay for more options.";
          return {
            success: true,
            type: "location",
            response: `${cityName} currently has no attractions listed in our database.\n${suggestionText}`
          };
        } else if (totalInCity === 1) {
          const suggestionText = suggestions.length > 0
            ? `For more options, check out nearby cities: ${suggestions.join(", ")}`
            : "";
          return {
            success: true,
            type: "location",
            response: `In ${cityName}, here are some spots:\n${shortListToText(filtered)}\n\n${cityName} has limited options. ${suggestionText}`
          };
        }
        
        const hint = `In ${cityName}, you can explore history, beach, food, nature, or adventure.\n` +
                     `Tell me what you're interested in (for example, "food in ${cityName}" or "beach in ${cityName}").`;
        const base = filtered.length > 0
          ? `In ${cityName}, here are some spots:\n${shortListToText(filtered)}`
          : `I found ${cityName} but no matching attractions listed.`;
        return { success: true, type: "location", response: `${base}\n\n${hint}` };
      }

      // With interest filter
      if (filtered.length === 0) {
        let suggestionText = "";
        if (totalInCity === 0) {
          suggestionText = suggestions.length > 0
            ? `${cityName} has no attractions in our database. Try nearby cities: ${suggestions.join(", ")}`
            : `${cityName} has no attractions in our database. Try cities like Laoag, Pagudpud, or Paoay instead.`;
        } else {
          suggestionText = suggestions.length > 0
            ? `${cityName} doesn't have ${interest} attractions, but you can find them in nearby cities: ${suggestions.join(", ")}`
            : `${cityName} doesn't have ${interest} attractions. Try cities like Laoag, Pagudpud, or Paoay for ${interest} options.`;
        }
        return {
          success: true,
          type: "location",
          response: suggestionText
        };
      }
      
      const resp = `In ${cityName}, here are some ${interest} spots:\n${shortListToText(filtered)}`;
      return { success: true, type: "location", response: resp };
    }

    // interest-only (no budget filtering)
    const interest = detectInterest(text);
    if(interest){
      const matches = [];
      for(const name in attractions){
        if(attractions[name].type === interest) matches.push(name);
      }
      if(matches.length){
        const base = `Here are ${interest} attractions:\n${shortListToText(matches.slice(0,10))}`;
        const hint = `\n\nTo narrow this down, tell me a location too, like "beach in Pagudpud" or "food in Laoag".`;
        return { success: true, type: "interest", response: base + hint };
      }
    }

    // fallback
    return { success: false, type: "fallback", response: "Sorry, I couldn't detect a location or interest in your message. Try: 'food in Batac' or 'beach near Pagudpud'." };

    // helpers
    function parsePrice(priceStr){
      const m = priceStr.replace(/,/g,"").match(/₱\s*([\d]+)/) || priceStr.match(/([\d]+)/);
      if(m) return Number(m[1]);
      return 0;
    }
    function capitalizeCityKey(k){
      if(!k) return k;
      // if k is one of cityAttractions keys already capitalized, return it
      const found = Object.keys(cityAttractions).find(c => c.toLowerCase() === k.toLowerCase());
      return found || k.charAt(0).toUpperCase() + k.slice(1);
    }
  }

  global.processChatMessage = processChatMessage;
})(window);
