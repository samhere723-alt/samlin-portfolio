# Build Prompts — paste into Claude Code one at a time

These prompts are ordered. Run them sequentially after Claude Code is set up in the project folder.

---

## PROMPT 1 — First session setup

```
Read README.md first. That's the project context. Then give me a one-paragraph
summary of what this project is and what's already built vs. what's missing.
Don't code anything yet — I want you to confirm you understand the design system
before we start.
```

---

## PROMPT 2 — Build void.html

```
Build work/void.html using work/iphone.html as the structural template.
Keep the exact same section structure (nav, breadcrumb, title block, hero video,
intro, bottleneck cards, design decision quote, pipeline, technical breakthrough,
results, showcase, honest assessment, next project, footer).

Change these things:

1. Title: "Void," / italic "a hymn."
2. Breadcrumb: Work / Music Video / Void — a hymn
3. Meta row:
   - Year: 2025
   - Client: Independent / Spec
   - Role: Direction · AI Pipeline · Edit
   - Category: Music Video · Narrative
4. Hero video background gradient: change from warm amber to cool purple:
   radial-gradient(ellipse at 40% 45%, #5a3a78 0%, #2a1a40 35%, #100820 70%, #050210 100%)
5. Hero video embed: use placeholder src="https://www.youtube.com/embed/0yIW3V-QObc?autoplay=1&mute=1&loop=1&playlist=0yIW3V-QObc&rel=0&controls=1"
6. Sidebar stats:
   - Duration: 2 min 14 sec
   - Production: 5 days · 1 person
   - Vs. traditional: 5 roles × 4 weeks
   - Stack: Gemini (Custom Gem) / Nano Banana · Flow / Kling 2.6 / 3.0 / After Effects + Gemini / Suno AI · Firefly
   - Original music: Generated with Suno AI / Edited to rhythm
7. Intro paragraphs:
   P1: "企業面對的問題是:影片內容的需求速度,早就超過傳統製程能應付的上限。品牌要持續出社群素材,創作者要給音樂配視覺 —— 但傳統動態影片光前期的建模、分鏡、角色動作,就夠把一個創意在執行途中磨死。"
   P2 (highlighted): "所以我想問一個核心問題:AI 影片生成「難以控制」的特性,能不能反過來成為讓觀眾每一秒都捨不得滑走的理由?"
   P3: "答案是可以,但代價很明確 —— 你必須放棄控制感,把隨機性當成最強的創作工具。這支 MV 就是那個結論的證明。一個人、五天、從音樂到完整影片。"

8. Section 01 Bottleneck h2: "Production, <em>as death loop.</em>"
   Card 1: label "The velocity problem" / title "需求遠超產能" / body "短影音的觀眾在前三秒就決定要不要繼續看,但傳統製作流程極度緩慢,完全無法應對如此高頻率的素材迭代需求。"
   Card 2: label "The control trap" / title "穩定的死水" / body "最初嘗試畫好分鏡圖讓 AI 生成。畫面確實穩了,但所有的力道也跟著消失 —— 那種追求控制的穩,是毫無生命力的。"

9. Section 02 Design decision quote:
   "My solution was to <em>give up control</em> — and treat randomness as the sharpest tool I had."
   Additional prose: "我換了一個完全相反的方法。透過引導式對話讓 AI 提出比我原本想的更極端、更荒謬的動態。它給的東西超出想像,我的工作從「想出這個是什麼」變成「判斷這個要不要」。甚至人物一致性的缺陷,在這支 MV 裡,人物每一秒都在輕微變形的特質,反而成了最符合歌曲氣質的風格語言。"

10. Pipeline 3 phases:
    Phase 01: 腳本與風格發想
      - Gemini (Custom Gem): 客製指令,從大量概念圖中收斂 MV 視覺方向
      - Nano Banana / Flow: A24 電影感加 3D 渲染風格驗證
    Phase 02 (core): 主力生成與驗證
      - Kling 2.6 & 3.0: 高張力動態與鏡頭延展性的主力引擎
      - 剪輯即驗證機制: 邊生成邊丟入剪輯,節奏對不對即刻知道
    Phase 03: 後製與技術槓桿
      - AE + Gemini (AE Script): Gemini 直接生成表達式,不到五輪完成特效
      - Suno AI · Firefly: 原創配樂與畫面局部修補

11. Section 04 — REPLACE "Lens Master" section with "Editing as live validation" section.
    Section meta: "04 / The technical breakthrough"
    H2: "Editing, <em>as live validation.</em>"
    Intro: "AI 影片生成有一個特性繞不過:無法精確指定每段素材的長度。首尾幀雖能穩畫面,但代價是動態張力消失。這意味著整個製作邏輯必須重構。"
    Instead of the UI screenshot + A/B comparison from iPhone, build a 2-column layout:
    LEFT column (text):
    - Muted quote style (lesser border): "傳統做法是先把腳本做好再製作素材 —— 生完才知道順不順。這在 AI 生成節奏不可控的前提下,等於每做一段都在賭。"
    - Accent quote style (amber border): "這裡是「邊生成邊剪輯」—— 你必須把它丟進 AE 實際接上前後鏡頭,才知道節奏對不對。剪輯從最後工序,變成貫穿全程的篩選機制。"
    RIGHT column (diagram in a bordered box):
    - Label at top: "製程邏輯切換"
    - OLD flow (strikethrough, faded): "企劃腳本 → 素材製作 → 後期剪輯" label "Linear"
    - NEW flow (emphasized box): "即時迴圈流程" badge "New"
      Inside: "發想 / 生成  ⇄  即時剪輯驗證"

12. Section 05 Results — change from single 80% to two stacked big numbers:
    "1" with unit "個人" (small italic amber)
    "5" with unit "天" (small italic amber)
    Label: "Replaces 5 roles × 4 weeks"
    Subtext: "企劃 · 建模 · 動態 · 骨架 · 合成. 不是降低品質,而是邏輯換了。"

    Benefit 1 (h3 "價值一 — 解決資源依賴"): "省掉最多時間的是建模、動作設定與特效 —— 這些在傳統流程裡門檻高、極易依賴外包。透過 Gemini 生成 AE Script,我們甚至能將技術沉澱為可重複使用的 SOP。對需要持續產出社群素材的團隊而言,能在不增加人力的前提下大幅壓縮單支影片週期。"

    Benefit 2 (h3 "價值二 — 創意發想的超加速"): "加速的核心不是「執行速度」,而是「發想速度」。過去腦中的畫面變成真實素材,中間有一大段技術轉譯的耗損;這套流程把耗損幾乎全砍了 —— 你描述畫面,AI 給你極端版本,你選要或不要,然後繼續。"

13. Section 06 Showcase — change gradients to purple/cool tones instead of amber/warm
    Item 1: radial-gradient(ellipse at 50% 30%, #6a4080 0%, #2a1540 50%, #0a0420 100%)
    Item 2 (offset): linear-gradient(135deg, #4a3a58 0%, #1a0f28 60%, #080410 100%)
    Item 3: radial-gradient(ellipse at 65% 50%, #3a4a78 0%, #1a2838 50%, #06101a 100%)

14. Section 07 Honest assessment:
    Body: "這套工作流的核心優勢是<strong>隨機性帶來的視覺衝擊力</strong>,這跟「模板化、可嚴格複製」本質上互斥。如果需求是每週穩定產出風格一致的品牌標準素材,這不是對的工具。它真正適合的場景是短影音、MV、需要快速抓住注意力的社群內容 —— 在這個範疇內,它目前沒有等價的替代方案。"
    Quote: "The randomness that makes this work — <em>isn't what brand work needs.</em> Know which problem you're solving."

15. Next project: "Next project — 03 / 12" / "iPhone — <em>Lumière.</em>" (links back to iphone.html)

Use the existing CSS classes from main.css. Don't invent new ones. Don't change main.css.
```

---

## PROMPT 3 — Responsive QA

```
Open index.html, work/iphone.html, and work/void.html. Check responsive
behavior at 375px (mobile), 768px (tablet), 1280px (desktop). Identify any
layout breaks and fix them using existing CSS (don't rewrite main.css).
Focus on: marquee on mobile, case study meta row on mobile, pipeline phases
on mobile, hero content stack.
```

---

## PROMPT 4 — Replace placeholder media

```
I've placed real video files in assets/videos/ and stills in assets/images/.
Here's the list [you'll provide]. Update the HTML files to reference these
actual media instead of the gradient placeholders. Keep the gradient
placeholders as CSS fallback in case media doesn't load.
```

---

## PROMPT 5 — Deploy to Cloudflare Pages

```
Help me deploy this site to Cloudflare Pages. I have a Cloudflare account.
Walk me through:
1. Creating a Git repository (if I don't have one yet)
2. Pushing this project to GitHub
3. Connecting Cloudflare Pages to the repo
4. Setting up the custom domain samlin.studio

Give me the exact terminal commands I need to run, one at a time. Wait for
me to confirm each step before moving to the next.
```

---

## PROMPT 6 — Later enhancements (optional)

```
Add the following polish to index.html:

1. Hero H1 entrance animation: letters rise 12px from below with opacity 0→1,
   cubic-bezier(0.16, 1, 0.3, 1), 800ms total, 40ms stagger.
2. Scroll-triggered reveal on work grid items (fade + 20px translate).
3. Custom cursor: small dot cursor that scales up on hover over work items.
4. All animations wrapped in prefers-reduced-motion check.

Keep it vanilla JS, no libraries.
```
