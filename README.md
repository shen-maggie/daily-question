# Sidequest (working title)

An installable, mobile-first daily question app that helps friend groups stay
in touch. The daily question is global; answers, reveals, and discussion prompts
are private to each friend group. Discord and Messages bring the conversation
back to the chat people already use.

Each daily answer defaults to the person's private friend circle. A person can
instead make that day's answer public on the worldwide response wall or keep it
entirely private. The visibility choice resets for every new question.

Every day offers two paths: a playful worldwide question and a small reflective
question. Completing either one keeps the same daily streak; people can choose
based on their mood or answer both. History records the selected path, answer,
and audience by calendar date.

Streaks work at two levels. A personal streak continues after answering either
daily question. A circle streak continues once at least half of the members
have answered one of the two questions that day, even when the group splits
between the fun and reflective prompts.

Circles can also subscribe to up to two optional weekly rituals: Most Likely
To, Would You Rather, or Sunday Reflection. Each ritual can be assigned to a
weekday and appears as the circle's next scheduled conversation prompt. Rituals
are separate from the worldwide questions and do not affect personal streaks.

Sidequest does not replace a group chat. Circles handle mutual answer reveals;
each daily reveal opens a focused conversation room with reactions and replies.
The native share action can still send the prompt or conversation spark into an
existing Messages or Discord chat as a reminder.

The current prototype includes working Today, Circles, History, and Friends
views. Local demo state supports creating circles, choosing members, adding
friends, posting circle messages, reacting, and revisiting past responses.
Circle answers remain locked until a person submits their own response. The
current chat is a local prototype; shared accounts and real-time delivery are
the next backend step.

## Current Prototype

Open `dist/index.html` or serve the `dist` directory locally. The prototype
includes today's global question, answer-before-reveal, realistic friend
responses, a group streak, and native sharing back to a group chat.

## Hackathon MVP

The demo should prove one complete loop:

1. A friend opens the global daily question from the app or group-chat reminder.
2. They answer without seeing friends' responses.
3. Their private group responses are revealed.
4. The app creates a follow-up designed to start a conversation.
5. They share it back to Messages or Discord.

Themes, anonymous polls, public responses, and journaling tools are stretch
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
