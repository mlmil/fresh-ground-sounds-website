/* ============================================
   FRESH GROUND SOUND — Gemini Booking Assistant
   Powered by Google Gemini API
   
   SETUP: Replace GEMINI_API_KEY below with the
   studio's key from aistudio.google.com (free).
   ============================================ */

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const STUDIO_SYSTEM_PROMPT = `You are the booking assistant for Fresh Ground Sound, a professional recording studio in Ventura, California. You are warm, knowledgeable, and helpful. Keep responses concise but complete.

ABOUT THE STUDIO:
- Name: Fresh Ground Sound / Fresh Ground Records
- Address: 3740 Transport Street, Ventura, California 93003
- Phone: (805) 644-2579
- Email: Freshgroundsound@gmail.com
- Founded: 2012 (originally Valley Center Studios, Van Nuys, 1983 by Mark Antaky)

SERVICES & RATES:
RECORDING:
- Rate: $60/hr (includes assistant engineer; producer NOT included)
- Ask about project & block rates for discounts
- System: SSL-XL console, Chandler 16 mixer, Pro Tools 12, Universal Audio UAD-2 Satellite TB3 Octo Core
- Monitors: Barefoot MM27, KRK Rokit 5
- Processing: Neve 1272 (x4), API 512 (x2), Neve 33609J, UA 6176, Focusrite ISA2 (x2), Distressors EL8-X (x2), Retro Sta-level, MAAG EQ4 (x2), and more
- Microphones: Extensive collection including Royer R121, Rode Classic II tube, Cascade ribbons, Shure SM7, SM57, and more

REHEARSAL:
- $30/hr, 3-hour minimum on weeknights
- 3 hrs: $90 | 4 hrs: $110 | 5 hrs: $130 | Day Lockout (12 hrs): $240
- Hours: 11am–10pm bookings
- Cancellation: 48-hour notice required or full payment due
- Room: 20ft x 15ft, 16ft ceiling
- PA: 16x4x2 Mackie mixer w/EFX, 2 mains/monitors, 4 mics
- Included: 5-piece Sonar drum kit (bring own cymbals, snare, kick pedal, throne), Albion 300W bass cabinet, music/guitar stands

STUDIO DIMENSIONS:
- Tracking & Mixing Room: 16' x 20' x 16'
- Vocal Room: 4' x 10'
- Piano Room: 16' x 10'
- Lobby: 8' x 16'

NOTABLE CLIENTS:
Kanye West, Carti B., Howard Leese, David Lombardo, Kevin Schreutelka, Sabina Chantouria, Ratta Blanca, Heaven and Earth, Katja Rieckerman, Rip Carson, Roni Lee, Dillinger Steele, Jamie Kime, Danny Nova, Mighty Cash Cats, Jeremiah Samuels, Doug Pettibone

BOOKING:
- To check availability, visitors can view the studio calendar on this page
- To book, fill out the contact form or call/text (805) 644-2579
- Email: Freshgroundsound@gmail.com

IMPORTANT: You don't have real-time calendar access. For specific date availability, always direct users to check the calendar embed or contact the studio directly. Never quote prices not listed above. Be friendly and encourage them to reach out.`;

let conversationHistory = [];

// ── Chat UI state
const chatWidget    = document.getElementById('chat-widget');
const chatToggle    = document.getElementById('chat-toggle');
const chatClose     = document.getElementById('chat-close');
const chatMessages  = document.getElementById('chat-messages');
const chatInput     = document.getElementById('chat-input');
const chatSend      = document.getElementById('chat-send');

chatToggle.addEventListener('click', () => {
  chatWidget.classList.toggle('open');
  if (chatWidget.classList.contains('open') && conversationHistory.length === 0) {
    setTimeout(() => addMessage('assistant', "Hey! I'm the Fresh Ground Sound booking assistant. Ask me anything about recording sessions, rehearsal rates, gear, or availability. Ready to help you make something great. 🎙️"), 400);
  }
});

chatClose.addEventListener('click', () => chatWidget.classList.remove('open'));

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// Quick reply chips
document.querySelectorAll('.quick-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chatInput.value = chip.textContent;
    sendMessage();
  });
});

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg--${role}`;
  div.innerHTML = `<div class="chat-bubble">${text}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'chat-msg chat-msg--assistant typing-indicator';
  div.id = 'typing';
  div.innerHTML = `<div class="chat-bubble"><span></span><span></span><span></span></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing');
  if (el) el.remove();
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  addMessage('user', text);

  conversationHistory.push({ role: 'user', parts: [{ text }] });

  addTypingIndicator();
  chatSend.disabled = true;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: STUDIO_SYSTEM_PROMPT }] },
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
      removeTypingIndicator();
      addMessage('assistant', reply);
    } else {
      throw new Error('No response from Gemini');
    }
  } catch (err) {
    removeTypingIndicator();
    addMessage('assistant', "Sorry, I'm having trouble connecting right now. Please call us at <a href='tel:8056442579'>(805) 644-2579</a> or email Freshgroundsound@gmail.com.");
    console.error('Gemini error:', err);
  }

  chatSend.disabled = false;
  chatInput.focus();
}
