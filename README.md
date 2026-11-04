# DataPilot Enterprise

An evolving full-stack data quality application, built incrementally with an emphasis on clear architecture, reviewable changes, and documented engineering decisions.

> **Current status:** Early frontend scaffold. This is not a finished or deployed application.

## Current stack

- React and TypeScript
- Vite
- Git and GitHub
- Oxlint

## Planned stack and engineering work

The following are **planned**, not yet implemented:

- Node.js and Express backend
- PostgreSQL database
- Validation and error handling
- Automated testing
- Secure configuration and deployment
- Documentation, issues, branches, and pull requests as development progresses

## Repository structure

```text
datapilot/
├── client/       # React + TypeScript frontend (initial scaffold)
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## Run the frontend locally

Requirements: Node.js and npm.

```bash
git clone https://github.com/sardarMrashed/datapilot.git
cd datapilot/client
npm install
npm run dev
```

To check code quality or produce a build:

```bash
npm run lint
npm run build
```

## Development approach

Development follows small, reviewable steps. Source code and commit history should make it clear what is actually implemented.

## Developer

**Sardar Mohammed Rashid** · [GitHub](https://github.com/sardarMrashed) · [LinkedIn](https://www.linkedin.com/in/sardar-mohammed-rashid/) · [Portfolio](https://sardar-portfolio.vercel.app/)
