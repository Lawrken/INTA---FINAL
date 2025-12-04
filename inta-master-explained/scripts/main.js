/* main.js
   Integration layer - attaches to DOM elements described in the brief.
   Expected element IDs in index.html:
    - interestSelect, budgetSelect, locationSelect, timeInput, recommendBtn
    - chatInput, chatSendBtn, chatWindow (div), bfsSelect, bfsBtn
    - resultsArea (div)
*/

(function(){
  // Helper: get element by id
  const $ = id => document.getElementById(id);

  // DOM elements (may be absent if index.html uses different IDs)
  const interestSelect = $('interestSelect');
  const locationSelect = $('locationSelect');
  const timeInput = $('timeInput');
  const recommendBtn = $('recommendBtn');

  const chatInput = $('chatInput');
  const chatSendBtn = $('chatSendBtn');
  const chatWindow = $('chatWindow');

  const bfsSelect = $('bfsSelect');
  const bfsBtn = $('bfsBtn');

  const resultsArea = $('resultsArea');

  // Keep the last generated plan so we can filter or export without recomputing rules
  let lastPlan = null;

  // Utility to display results
  function showResults(title, lines){
    if(!resultsArea){
      console.log(title, lines);
      return;
    }
    // Remove empty-state message once we have real results
    const emptyState = resultsArea.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'result-block';
    const h = document.createElement('h3');
    h.textContent = title;
    wrapper.appendChild(h);
    const ul = document.createElement('div');
    ul.style.whiteSpace = 'pre-wrap';
    ul.textContent = lines.join("\n");
    wrapper.appendChild(ul);
    // append and scroll
    resultsArea.prepend(wrapper);
  }

  // Helper to build and render the current plan (with optional filters)
  function renderPlan(plan, options){
    if (!plan) return;
    const { ui, res } = plan;
    options = options || {};
    const filterCity = options.city || null;
    const filterType = options.type || null;

    const matched = `Matched rules: ${res.matchedRules.length > 0 ? res.matchedRules.join(", ") : "None"}`;

    // Build context and reasons lines
    const contextParts = [];
    if (ui.interest) contextParts.push(`interest: ${ui.interest}`);
    if (ui.location) contextParts.push(`location: ${ui.location}`);
    if (!Number.isNaN(ui.time) && ui.time !== undefined) {
      contextParts.push(`time: ${ui.time} hours`);
    }
    const contextLine = contextParts.length
      ? `Based on your ${contextParts.join(", ")}.`
      : "Recommendations based on your current selections.";

    const reasonsLine = (res.reasons && res.reasons.length)
      ? `Why these: ${res.reasons.join("; ")}`
      : null;

    // Group recommendations by city and add type badges, applying filters
    const byCity = {};
    res.recommendations.forEach(r => {
      if (filterType && (!r.details || r.details.type !== filterType)) return;
      const city = (r.details && r.details.city) || "Various locations";
      if (filterCity && city.toLowerCase() !== filterCity.toLowerCase()) return;
      if (!byCity[city]) byCity[city] = [];
      byCity[city].push(r);
    });

    const recLines = [];
    const visitedCities = Object.keys(byCity);
    if (visitedCities.length === 0) {
      recLines.push("No attractions match this filter. Try clearing or changing your filters.");
    } else {
      visitedCities.forEach(city => {
        recLines.push(`${city}:`);
        byCity[city].forEach(r => {
          const typeBadge = r.details && r.details.type ? `[${r.details.type}] ` : '';
          if (r.details) {
            // Show prices only for food-type attractions
            if (r.details.type === 'food') {
              recLines.push(
                `• ${typeBadge}${r.name} (${r.details.price}, est. stay: ${r.details.duration}) - ${r.details.description}`
              );
            } else {
              recLines.push(
                `• ${typeBadge}${r.name} (est. stay: ${r.details.duration}) - ${r.details.description}`
              );
            }
          } else {
            // No details: assume default 30-minute stay
            recLines.push(`• ${typeBadge}${r.name} (est. stay: 30 mins)`);
          }
        });
        recLines.push("");
      });
    }

    // Show the user's currently selected time
    const timeLine = ui.time !== undefined && !Number.isNaN(ui.time)
      ? `Time available: ${ui.time} hours`
      : null;
    // Show estimated stay time
    let estimateLine = null;
    if (typeof res.totalTimeHours === 'number' && isFinite(res.totalTimeHours)) {
      estimateLine = `Estimated stay time: ${res.totalTimeHours.toFixed(2)} hours`;
    }

    // Verdict: does the plan fit within the user's time?
    let verdictLine = null;
    if (timeLine && typeof res.totalTimeHours === 'number' && isFinite(res.totalTimeHours)) {
      const diff = res.totalTimeHours - ui.time;
      if (diff <= 0) {
        verdictLine = "This plan fits your available time.";
      } else {
        verdictLine = `This plan is about ${diff.toFixed(2)} hours longer than your available time. Consider removing one stop.`;
      }
    }

    // Itinerary summary: stops, cities, stay and itinerary time
    const uniqueCities = new Set();
    res.recommendations.forEach(r => {
      if (r.details && r.details.city) {
        uniqueCities.add(r.details.city);
      }
    });
    const citiesList = uniqueCities.size ? Array.from(uniqueCities).join(", ") : "various locations";
    const stayTime = (typeof res.totalTimeHours === 'number' && isFinite(res.totalTimeHours))
      ? res.totalTimeHours.toFixed(2)
      : "unknown";
    const summaryLine = `Summary: ${res.recommendations.length} stops across ${citiesList}. Estimated stay time: ${stayTime} hours.`;

    const extraLines = [];
    extraLines.push(contextLine);
    if (reasonsLine) extraLines.push(reasonsLine);
    
    // Show limited city warning if applicable
    if (res.limitedCityWarning) {
      extraLines.push("");
      extraLines.push(`⚠️ ${res.limitedCityWarning}`);
    }
    
    if (timeLine) extraLines.push(timeLine);
    if (estimateLine) extraLines.push(estimateLine);
    if (verdictLine) extraLines.push(verdictLine);
    extraLines.push(summaryLine);

    const lines = extraLines.length > 0
      ? [matched, "", ...recLines, "", ...extraLines]
      : [matched, "", ...recLines];

    // Clear previous results and render
    if (resultsArea) {
      resultsArea.innerHTML = '';
    }
    showResults("Recommendations", lines);

    // Store plain-text version for export
    plan.text = ["Recommendations", "", ...lines].join("\n");
  }

  // Recommendation button handler
  if(recommendBtn){
    recommendBtn.addEventListener('click', ()=>{
      console.log("Recommend button clicked!");
      
      // Show loading state
      recommendBtn.disabled = true;
      recommendBtn.textContent = "Processing...";
      
      const ui = {
        interest: interestSelect ? interestSelect.value : '',
        location: locationSelect ? locationSelect.value : '',
        time: timeInput ? Number(timeInput.value) : undefined
      };
      console.log("User input:", ui);
      
      // Basic validation to guide the user
      const validationMessages = [];
      if (!ui.interest) validationMessages.push("Please choose an interest (history, beach, food, nature, or adventure).");
      if (!ui.location) validationMessages.push("Please choose a starting location.");
      if (!ui.time || ui.time <= 0 || Number.isNaN(ui.time)) {
        validationMessages.push("Please enter how many hours you have (e.g., 3).");
      }
      if (validationMessages.length) {
        console.log("Validation failed:", validationMessages);
        if (resultsArea) {
          resultsArea.innerHTML = '';
        }
        showResults("Need more info", validationMessages);
        // Reset button
        recommendBtn.disabled = false;
        recommendBtn.textContent = "Get Recommendations";
        return;
      }
      
      // Simulate slight delay for better UX
      setTimeout(() => {
        console.log("Calling matchRules...");
        const res = matchRules(ui);
        console.log("matchRules result:", res);
        
        // Check if selected city has limited attractions
        const selectedCity = ui.location.charAt(0).toUpperCase() + ui.location.slice(1).toLowerCase();
        const cityKey = Object.keys(cityAttractions).find(k => k.toLowerCase() === ui.location);
        const attractionsInCity = cityKey ? (cityAttractions[cityKey] || []).length : 0;
        
        // If no recommendations at all, show a friendly message
        if (!res.recommendations || res.recommendations.length === 0) {
          console.log("No recommendations found");
          if (resultsArea) {
            resultsArea.innerHTML = '';
          }
          
          // Check if city has limited attractions and suggest nearby cities
          const suggestions = nearbyCitySuggestions[cityKey] || [];
          const messages = [];
          
          if (attractionsInCity === 0) {
            messages.push(`${selectedCity} currently has no attractions listed in our database.`);
            messages.push(`We couldn't find any ${ui.interest} options starting from ${selectedCity}.`);
          } else {
            // City has attractions but not of the requested type
            messages.push(`No ${ui.interest} attractions found in ${selectedCity}.`);
            messages.push(`${selectedCity} doesn't have ${ui.interest} options that match your interest.`);
          }
          
          // Provide alternatives
          if (suggestions.length > 0) {
            messages.push(`✨ Try these nearby cities instead: ${suggestions.join(", ")}`);
            messages.push(`Or change your interest to see what's available in ${selectedCity}.`);
          } else {
            messages.push("✨ Try popular cities like Laoag (food, adventure), Pagudpud (beach, nature), or Paoay (history) for more options.");
            messages.push(`Or change your interest to see what's available in ${selectedCity}.`);
          }
          
          showResults("No matches found", messages);
          // Reset button
          recommendBtn.disabled = false;
          recommendBtn.textContent = "Get Recommendations";
          return;
        }
        
        // Even if we have recommendations, check if we should warn about limited city options
        if (attractionsInCity <= 1 && res.recommendations.length <= 1) {
          const suggestions = nearbyCitySuggestions[cityKey] || [];
          if (suggestions.length > 0) {
            res.limitedCityWarning = `Note: ${selectedCity} has limited attractions. Consider nearby cities: ${suggestions.join(", ")} for more options.`;
          }
        }
        
        lastPlan = { ui, res };
        console.log("Rendering plan...");
        renderPlan(lastPlan, {});
        
        // Reset button
        recommendBtn.disabled = false;
        recommendBtn.textContent = "Get Recommendations";
        
        // Smooth scroll to results
        if (resultsArea) {
          resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
    });
  }

  // Chatbot handler
  if(chatSendBtn && chatInput){
    const sendMessage = () => {
      const msg = chatInput.value.trim();
      if(!msg) return;
      
      // Disable input while processing
      chatSendBtn.disabled = true;
      chatInput.disabled = true;
      
      // show user message in chat window if present
      if(chatWindow){
        const p = document.createElement('div');
        p.className = 'chat-message chat-user';
        p.innerHTML = `<div class="message-content"><p>${msg}</p><span class="message-time">Just now</span></div>`;
        chatWindow.appendChild(p);
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
      
      // Clear input immediately
      chatInput.value = '';
      
      // Show typing indicator
      let typingIndicator = null;
      if(chatWindow){
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message chat-bot typing-indicator';
        typingIndicator.innerHTML = `<div class="message-avatar">🤖</div><div class="message-content"><p>Typing...</p></div>`;
        chatWindow.appendChild(typingIndicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
      
      // Simulate processing delay
      setTimeout(() => {
        // Remove typing indicator
        if (typingIndicator) {
          typingIndicator.remove();
        }
        
        const resp = processChatMessage(msg);
        if(chatWindow){
          const p2 = document.createElement('div');
          p2.className = 'chat-message chat-bot';
          p2.innerHTML = `<div class="message-avatar">🤖</div><div class="message-content"><p>${resp.response.replace(/\n/g, '<br>')}</p><span class="message-time">Just now</span></div>`;
          chatWindow.appendChild(p2);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        } else {
          showResults("Chatbot", [resp.response]);
        }
        
        // Re-enable input
        chatSendBtn.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
      }, 500);
    };
    
    chatSendBtn.addEventListener('click', sendMessage);
    
    // Enable Enter key to send
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // BFS handler
  if(bfsBtn){
    bfsBtn.addEventListener('click', ()=>{
      const start = bfsSelect ? bfsSelect.value : null;
      
      // Show loading state
      bfsBtn.disabled = true;
      bfsBtn.textContent = "Searching...";
      
      setTimeout(() => {
        // Clear previous results so only nearby-city results are shown
        if (resultsArea) {
          resultsArea.innerHTML = '';
        }
        const res = findNearestCities(start, 3);
        if(res.error){
          showResults("Find Nearby Cities", [
            "I couldn't find that starting city in the map.",
            "Please choose a different city from the list and try again."
          ]);
          bfsBtn.disabled = false;
          bfsBtn.textContent = "Find Nearest";
          return;
        }
        const lines = res.nearestCities.map((n, idx) => {
          const list = (res.attractions[n.city] || []).slice(0,4).map(x => `   • ${x}`).join("\n");
          return `${idx+1}. ${n.city} (hops: ${n.hops})\n${list}`;
        });
        showResults(`Nearest cities from ${start}`, lines);
        
        // Reset button
        bfsBtn.disabled = false;
        bfsBtn.textContent = "Find Nearest";
        
        // Smooth scroll to results
        if (resultsArea) {
          resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
    });
  }

  // Auto-populate selects if present (simple)
  function populateSelect(selectEl, items){
    if(!selectEl) return;
    selectEl.innerHTML = '';
    items.forEach(it => {
      const o = document.createElement('option');
      o.value = it;
      o.textContent = it;
      selectEl.appendChild(o);
    });
  }

  // Populate cities list from cityAttractions keys
  const cityList = Object.keys(cityAttractions);
  populateSelect(locationSelect, cityList);
  populateSelect(bfsSelect, cityList);
  // interest options if elements present
  populateSelect(interestSelect, ["history","beach","food","nature","adventure"]);

  // Testing helpers (console)
  console.log("INTA AI logic loaded. Available functions: matchRules(), processChatMessage(), findNearestCities()");

  // Expose simple filter helpers for future UI integration
  window.filterINTAByCity = function(cityName){
    if (!lastPlan) {
      console.warn("No plan available to filter. Run the Trip Planner first.");
      return;
    }
    renderPlan(lastPlan, { city: cityName });
  };

  window.filterINTAByType = function(type){
    if (!lastPlan) {
      console.warn("No plan available to filter. Run the Trip Planner first.");
      return;
    }
    renderPlan(lastPlan, { type });
  };

  // Export the latest plan as plain text to the clipboard
  window.copyINTAPlanToClipboard = async function(){
    if (!lastPlan || !lastPlan.text) {
      console.warn("No plan available to copy. Run the Trip Planner first.");
      return;
    }
    const text = lastPlan.text;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        console.log("INTA plan copied to clipboard.");
      } else {
        // Fallback: show in a prompt for manual copy
        window.prompt("Copy your trip plan:", text);
      }
    } catch (e) {
      console.error("Failed to copy plan to clipboard:", e);
      window.prompt("Copy your trip plan:", text);
    }
  };
})();
