# LLM creative pass blocked

No API key found in:
- process env XAI_API_KEY / GROK_API_KEY
- sitesmith/.env, .env.local
- ~/.grok/.env

Set one of:
```powershell
$env:XAI_API_KEY = "xai-..."   # console.x.ai
```
Then:
```powershell
node tools/run-creative-mini-proof.mjs --creative llm --brief 01-leather-goods
```
