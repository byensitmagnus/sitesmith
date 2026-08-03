---
name: fixture-pass
context:
  always: [SKILL.md]
  scenarios:
    marketing: [stacks/static.md, verify.md]
    shop: [floor/buy.md, stacks/static.md, verify.md]
  ceilings:
    always: 300
    routine: 600
---
body
