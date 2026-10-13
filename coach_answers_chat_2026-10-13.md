# Coach answers in chat, 2026-10-13 (CH6)

Coach Lalo (Gerardo Vera), in the build conversation. Quoted verbatim, then the reading the team applies. Authority: newest, on these two subjects only.

## CH6-01 A dip above the bench in the last weeks

**Question.** On the push / pull / legs push day in weeks 11-12, the weighted dip holds 5 sets next to the bench press at 4 (the triceps' last set, every other triceps lift at its top). Acceptable, or should a triceps bonus exercise take that set?

**Answer (verbatim):** "To answer your question, that's okay for the chest to have that many sets. That's fine. Either way, it can be edited by the coach or the athlete on that, so not worried."

**Reading.** The engine's current behaviour stands (DECISIONS G-291, G-292). No change.

## CH6-02 Exercises people or coaches add themselves

**Question (his).** "What about if people or coaches later on want to add an exercise? Should they have to input all the categories that we have in order for the parameters to work in that exercise? Or should we just allow them to put exercises for now wherever they want, which would be easier for us? The responsibility falls on them for how they want to put a new exercise into the program or change exercises into something that's not in our library."

**Our proposal.** A middle path: the person may put their own exercise anywhere with the sets they choose, answering one question only, "which muscle does it mainly work?" (one tap: chest, back, quads, hips, shoulders, biceps, triceps, calves, core; or "a jump / cardio, not a lifting set"), so the weekly sets per muscle keep adding up. Every other category is optional. The plan labels it "your exercise: not checked by Blaze Camp rules"; the responsibility is theirs. Adding an exercise to the official Blaze Camp library, so the engine may pick it for everyone, still needs the full tagging (`docs/adding-exercises.md`) and the coach's approval.

**Answer (verbatim):** "Yeah your approach is ok thank you"

**Reading.** Approved as proposed. It applies to the front-end tool, which is not built yet; today's plan editing (`engine/edit.mjs > add_exercise`) adds library exercises only. To build with the tool: a custom item with a name, sets, reps, the one muscle answer (or "athletic / cardio, no muscle sets"), credited 1.0 to that group, flagged `custom: true`, excluded from the library-only checks, and printed with the label above in English and Spanish.
