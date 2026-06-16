# MathPace 🚶‍♂️📖

## Overview

Reading through raw class notes without a teacher's walkthrough can leave you struggling to understand the "why" behind the material. MathPace is an AI-powered educational web application designed to transform static images of handwritten notes into an interactive, logically ordered progression. By processing notes into sequenced "Moments," MathPace acts as a personal tutor, revealing information step-by-step with contextual explanations.

## Key Features

* 
**Intelligent Sequencing:** Upload note images, and the AI will logically order them into a teaching progression, establishing preamble knowledge before diving into the main material.


* 
**The Moment Architecture:** The learning flow is driven by an array of `Moment` objects, each corresponding to a specific conceptual step.


* 
**Dynamic Focus Polygons:** Unrelated or future context on the note image is blocked out using custom obstruction polygons, drawing focus only to the relevant jottings and current topic.


* 
**Speech-Like Walkthroughs:** Each `Moment` includes plain-English, speech-like text to explain the currently observable portion of the notes.


* 
**Contextual Deep Dives:** For concepts requiring prerequisite knowledge, "learn more" objects provide extra explanation, complete with titles and links for deeper understanding.


* 
**Focused UI:** A low-distraction interface utilizing edge-tapping or simple arrow buttons for next/back navigation.


* 
**Integrated TTS:** Optional Text-to-Speech captions featuring a speaker button toggle, with user preferences saved locally.


* 
**Smart Q&A:** A chat-based question feature maintains past context. If your question is about to be answered in an upcoming `Moment`, the AI will prompt you to wait, though a "force answer" option is always available.


* 
**Collaborative Lessons:** Lesson sets are shareable and extendable; friends can add new images that the AI will process and append as new `Moment` objects to the existing list.



## Tech Stack

* **Framework:** Next.js (React)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **AI Engine:** Google Gemini API (Vision for image processing and context/polygon mapping; Text for generating walkthroughs and Q&A).

## System Architecture & Flow

MathPace operates on a state-driven progression model. The core logic relies on breaking down unstructured image data into a strictly typed array of `Moment` objects.

1. **Ingestion & Processing:** Images are fed to the Gemini API, which identifies the logical flow and returns a structured JSON payload of `Moments`.
2. **State Hydration:** Each `Moment` contains the active image ID, the coordinate array for the obstruction polygons, the spoken text, and optional "learn more" metadata.
3. **UI Rendering:** The Next.js frontend acts as a viewport into the current state. It renders the base image, applies SVG `clip-path` masks based on the polygon coordinates to obscure future data, and displays the walkthrough text.

## Getting Started

### Prerequisites

* Node.js 18+
* A Google Gemini API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MathPace.git

```


2. Navigate into the directory and install dependencies:
```bash
cd MathPace
npm install

```


3. Set up your environment variables by creating a `.env.local` file:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here

```


4. Start the development server:
```bash
npm run dev

```



## Author

**David Uwagbale** (Dev_id)
🌐 [davidtimi.tech](https://davidtimi.tech)