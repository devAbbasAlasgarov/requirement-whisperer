# Requirement Whisperer

**We don't replace Project Managers or Product Owners. We translate them.**

Paste messy requirements → get clean **User Stories** + **Acceptance Criteria** + **Detected ambiguities**.

Built for Product Managers, Business Analysts, and dev leads. One clear flow: input raw text, click **Clarify**, see structured output.

---

## What it does

- **Input:** Raw requirement text (paste anything messy).
- **Output:**
  - **User Story** in "As a … I want … So that …" format
  - **3–5 Acceptance Criteria**
  - **Detected ambiguities** (highlighted so you can fix them)

No infra drama: frontend + one backend endpoint. Cursor does the heavy lifting.

---

## Quick start

### 1. API key

Create a '.env' file in the **server** folder:

'''bash
cd server
echo OPENAI_API_KEY=your-openai-api-key-here > .env
'''

(Get a key from [OpenAI API](https://platform.openai.com/api-keys).)

### 2. Install and run

'''bash
cd server
npm install
npm start
'''

Server runs at **http://localhost:3000**. Open that URL in a browser.

### 3. Use it

1. Paste messy requirement text in the box.
2. Click **Clarify**.
3. Read the User Story, Acceptance Criteria, and Ambiguities.

---

## Project layout
``
requirement-whisperer/
├── public/           # Static frontend
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server/
│   ├── index.js      # Express app + /clarify API
│   ├── package.json
│   └── .env          # OPENAI_API_KEY (you create this)
└── README.md
``

---

## API

- **POST /clarify**  
  Body: '{ "text": "raw requirement string" }' 
  Response: '{ userStory, acceptanceCriteria[], ambiguities[] }'

---

## Tech

- **Frontend:** Vanilla HTML/CSS/JS, single page.
- **Backend:** Express, one '/clarify' route calling OpenAI (gpt-4o-mini).
- **Env:** 'dotenv' for 'OPENAI_API_KEY'.
=======
# requirement-whisperer
