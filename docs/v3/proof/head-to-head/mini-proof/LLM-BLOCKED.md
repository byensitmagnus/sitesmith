# LLM creative pass — host path available

Remote API key still optional.

**Host-session path (no separate key):**
```powershell
# 1) Produce HOST-PACKET.json (agent fills creative prompt)
# 2) Run:
node tools/run-host-llm-mini.mjs docs/v3/proof/head-to-head/mini-proof/01-leather-goods-host-llm/HOST-PACKET.json
```

Remote path still: set XAI_API_KEY in .env then:
```powershell
node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods
```

Mini-1 host-LLM result: SiteSmith ~55 vs frontend ~59 (see eval/mini-1-leather-host-llm/).
