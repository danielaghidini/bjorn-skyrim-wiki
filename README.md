# Bjorn Skyrim Wiki

[![Live Site](https://img.shields.io/badge/Live-bjorn.wiki-00bcd4?style=for-the-badge)](https://bjorn.wiki/)

An all-in-one interactive platform and community hub for the Bjorn Follower mod in Skyrim, designed to manage dialogues, quests, and media while fostering community engagement through its dedicated forum.

## Project Features

- **AI Dialogue System**: A chatbot interface utilizing LLM technology to simulate interactions with the character.
- **Forum Platform**: A community space for categorized discussions and suggestions.
- **Quest Module**: Documentation and interactive tracking for the mod's questlines.
- **Dialogue Search**: A repository for searching and browsing through over 4,500 lines of dialogue content.
- **Audio Integration**: A media player component for listening to character songs.
- **Media Repository**: A centralized gallery for official screenshots and community fan art submissions.
- **Administrative Dashboard**: A multi-tab management interface for content moderation.
- **Authentication & Security**: Secure user sessions using JWT-based authentication.
- **Access Metrics**: Integrated analytics module for tracking traffic, engagement, and platform usage.

## Tech Stack

**Frontend:**

- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **State Management:** Zustand
- **UI Architecture:** Material UI (@mui/material)
- **Icons:** Lucide React

**Backend:**

- **Runtime:** Node.js & Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **AI Implementation**: NVIDIA NIM (Llama 3.1 70B) via OpenAI-compatible API integration
- **Deployment:** Docker & Railway

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/danielaghidini/bjorn-skyrim-wiki.git
    cd bjorn-skyrim-wiki
    ```

2. **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3. **Backend Setup:**
    ```bash
    cd ../backend
    npm install
    # Configure .env with DATABASE_URL and API keys
    npx prisma migrate dev
    npm run dev
    ```

## Privacy & Data

AI chat history is stored locally on the user's device via browser storage. No conversation data is persisted on the server side.

---

_Bjorn is an original project created and developed by Daniela Ghidini. This wiki is not affiliated with Bethesda Game Studios._
