# Dominoes Cards Application

A dynamic web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui** for managing, sorting, flipping, and filtering domino cards using React's `useReducer` state management.

---

## 🚀 Features

- **Domino Cards Visualization**: Displays domino card pairs `[top, bottom]` as interactive UI cards.
- **Source & Statistics Panel**: Displays raw card data and counts total double numbers (e.g., `[4, 4]`).
- **Sort Ascending (SORT_ASC)**: Sorts cards by total sum ascending; breaks ties by prioritizing the card with the smaller individual number.
- **Sort Descending (SORT_DESC)**: Sorts cards by total sum descending; breaks ties by prioritizing the card with the larger individual number.
- **Flip Cards (FLIP)**: Flips each card's top and bottom values (e.g., `[6, 1]` becomes `[1, 6]`).
- **Remove Duplicates (REMOVE_DUP)**: Removes duplicate domino combinations regardless of orientation (e.g. treats `[1, 2]` and `[2, 1]` as duplicates).
- **Remove by Total (REMOVE_BY_TOTAL)**: Validated input form built with **React Hook Form** + **Zod** to remove all cards matching a target sum.
- **Reset State (RESET)**: Resets cards back to the initial dataset.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: `useReducer` pattern (`cardsReducer`)
- **Form & Validation**: React Hook Form + Zod (`zodResolver`)

---

## 📂 Project Structure

```text
dominoes/
├── src/
│   ├── components/       # UI components (DominoCards, RemoveItemForm, SourcePanel)
│   ├── data/             # Initial dataset (cardNumbersData)
│   ├── lib/              # Utility helpers for class names (cn)
│   ├── types/            # TypeScript type definitions (Card, Action)
│   ├── utils/            # Helper functions & reducer logic (helpers.ts, cardsReducer.ts)
│   ├── validation/       # Zod schemas (removeCard.validator.ts)
│   ├── App.tsx           # Main application view & reducer integration
│   └── main.tsx          # Application entry point
├── package.json
└── README.md
```

## ⚡ Getting Started

Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

Installation
```bash
# Install Dependencies
npm install

# Run Development Server
npm run dev

# Build for Production
npm run build
```
