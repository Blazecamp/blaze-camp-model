# ADR-008: Exercise videos are optional

A plan does not need a video for every exercise. People can look an exercise up on their own, and Blaze Camp's own videos are added when they exist. The coach decided this in round 2. It replaced the round-1 plan of a video for every exercise before launch. The video links in his original sheets are not his own videos.

| | |
|---|---|
| **Status** | Accepted. The link mechanics are PROPOSED. |
| **Decided by** | Coach: R2-GEN-02 (round 2, 2026-10-08) |
| **Replaces** | A video for every exercise as a launch requirement (GEN-06, round 1) |

## Decision (the rule)

- No phase of the project waits for filming.
- Where Blaze Camp has its own video, show it.
- Where it does not, the person looks the exercise up. A line invites people to send a video.

## Why

> "They can just look up the videos on their own on YouTube. No need to have the videos on there." (R2-GEN-02)

> "We haven't built our video library." (R2-GEN-02)

## Context

In round 1 we asked whether every exercise should have a video. He said yes, and that he did not have all the links: "thats a lot of work but needs to get done" (GEN-06). In round 2 he made it optional. He has also said that the exercise videos linked in his sheets are not his (conversation, 2026-10-07 to 2026-10-09).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Film every exercise before launch | Hundreds of clips first | Retired (R2-GEN-02) |
| B. Embed other people's videos found by search | Looks like Blaze Camp endorses them | Set aside (team) |
| C. Optional: own video if it exists, otherwise the person looks it up | Nothing blocks the launch | **Chosen** |

## Consequences

- PROPOSED: each exercise shows a "Watch how" link that opens a video search for its name. Nothing is embedded.
- PROPOSED: a small note says the videos are not made by Blaze Camp and gives a contact for sending one. The contact is still open (N-PROD-14).
- Third-party links in the source sheets are for reference only and are not owned or endorsed by Blaze Camp ([DISCLAIMER.md](../../DISCLAIMER.md) §8).
- A short written cue per exercise, in his voice, carries the coaching instead (GEN-07).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `output.videos` | The rule, the order of what is shown, the backlog |

Each exercise record in [synthesis/02_exercise_catalog.json](../../synthesis/02_exercise_catalog.json) has a `video_urls` field with the links found in his sheets. Product text: [synthesis/13_product_options.md](../../synthesis/13_product_options.md) §7.3.

## Related

[ADR-006](adr-006-website-not-app.md) website · [Exercise library](../02-model/exercise-library.md)
