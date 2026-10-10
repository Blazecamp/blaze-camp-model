# design/two-stage

Prototype and saved outputs for `design/design_two-stage.md` (the two-stage planner: block table first, then placement).

- `proto/` plain ES modules, Node 22, no dependency. The planner modules (`core`, `oracle`, `stage1`, `stairway`, `stage2`,
  `athletic`, `offers`) read no file; `samples.mjs` holds the stage-0 instances as data. The inspection scripts
  (`dumpdays`, `snapgen`, `tplc`, `targets`, `athtargets`) only read the frozen engine snapshot in `design/scratch/snap/`.
- `out/` the outputs quoted in the document. Section 14 of the document lists the command that produces each one.

Nothing here is imported by the engine, and nothing outside `design/` was written.
