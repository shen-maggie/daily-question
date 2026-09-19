# Daily Question

A Discord bot that helps friend groups stay in touch by giving them one small,
shared ritual: a daily question, a place to answer, and a recap of the group's
conversation.

## Hackathon MVP

The demo should prove one complete loop:

1. An admin runs `/setup` to choose a Discord channel.
2. The bot posts a daily question and opens a thread.
3. Friends answer in the thread.
4. `/recap` summarizes the group's answers.
5. `/streak` shows how many days the group has participated.

Themes, anonymous polls, worldwide questions, and a web dashboard are stretch
goals. The default experience should work without choosing a theme.

## Team Ownership

| Area | Owner | First deliverable |
| --- | --- | --- |
| Discord bot | Teammate 1 | Bot connects and `/question` posts a thread |
| Data and scheduling | Teammate 2 | Save server settings, questions, answers, and streaks |
| Questions and recap | Teammate 3 | Seed question bank and `/recap` logic |
| Web and demo | Teammate 4 | Small dashboard, visual polish, and demo script |

Each person should work on a branch and open a pull request. Keep `main`
demoable.

## Suggested Build Order

- [ ] Create a Discord application and test server
- [ ] Connect a bot with `discord.js`
- [ ] Implement `/question` with hardcoded questions
- [ ] Create one thread for each posted question
- [ ] Implement `/setup` and persist the selected channel
- [ ] Track participants and group streaks
- [ ] Implement a template-based recap
- [ ] Add an AI recap if time allows
- [ ] Add themes, submissions, voting, or a dashboard only after the loop works

## Proposed Stack

- Node.js and TypeScript
- `discord.js`
- Supabase/Postgres for shared data
- Optional React/Vite dashboard
- Render or Railway for the always-on bot

## Local Setup

Setup commands will be added when the bot scaffold lands. Never commit `.env`;
copy `.env.example` and add your own credentials.

## Branches

- `bot-commands`
- `database`
- `questions-recap`
- `web-demo`

## Demo Pitch

Group chats fade because starting a conversation takes effort. Daily Question
gives every friend group one tiny ritual: a thoughtful prompt, shared answers,
and a recap that turns ordinary replies into group memory.
