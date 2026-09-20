# sparKIT

A mobile-first daily question app for private reflection and conversations with
friends. Everyone receives the same reflective and fun questions each day.
The reflective question appears first; the fun question is one click away.
Answering either one maintains the personal streak.

Answers can be saved just for the writer or shared with one of their circles.
There is no public response wall. Circle answers stay hidden until each member
submits their own answer, and a circle streak continues when at least half of
the members answer either question.

The current prototype includes Today, Circles, History, and Friends views.
There is no pre-created circle: people create their own, invite friends, then
use the circle room for the conversation that follows the daily question.

## Stack

- Static HTML, CSS, and JavaScript frontend
- Supabase Auth, Postgres, Row Level Security, and Realtime
- GitHub for collaboration
- Sites for the current deployment

## Local Setup

Serve the `dist` directory with any static server. To activate shared accounts,
circles, answers, and messages, follow `SUPABASE_SETUP.md`. Never put a Supabase
`service_role` key in this website or commit one to Git.

## Product Loop

1. Open the reflective question.
2. Answer it, or click through to the fun question.
3. Save the answer privately or share it with a circle.
4. Reveal circle answers after submitting your own.
5. Continue the discussion in the circle chat.

## Collaboration

Keep `main` demoable. Use short branches such as `questions`, `database`, and
`web-polish`, then open pull requests for review.
