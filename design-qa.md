final result: passed

# Design QA

Target: student projection view at `/?mode=student` and teacher runbook view at `/?mode=teacher`.

Reference direction: Command Deck style selected from generated options, grounded in real material images extracted from the provided PDF.

Checks performed:

- 1440 x 900 student and teacher views captured with local Chrome automation.
- Student screens inspected: slide 1 knowledge intro, slide 4 program wakeup, slide 8 3D appearance selection.
- Teacher screens inspected: slide 1 opening science intro and slide 8 3D appearance runbook.
- Student view uses a left progress rail, large current task, four step blocks, real material/product imagery, and a bottom pass condition.
- Teacher view uses a split runbook: current student preview, timing, read-aloud script, actions, control boundaries, and fallback handling.
- No visible purchase page, QR code, chip-model banner, or sales content in the student projection.
- Long title on slide 4 was adjusted to avoid awkward wrapping.
- Slide 8 image was changed from shipping-list art to real shell/parts material art.

Remaining iteration notes:

- The 3D appearance page would be stronger with actual printed shell color variants once those assets exist.
