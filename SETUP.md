# Setup — from zero to working in ~90 minutes

For someone who's never opened a terminal. Step-by-step, no assumptions.

---

## Part 1 — Install the basics (30 min)

### Step 1: Install Node.js
Claude Code runs on Node.js. You need to install it first.

1. Go to **https://nodejs.org/**
2. Download the **LTS version** (big green button on the left)
3. Run the installer, click Next / Next / Install (accept all defaults)
4. Restart your computer

### Step 2: Open Terminal

**Mac**: Press `⌘ + Space`, type "Terminal", press Enter.
**Windows**: Press `Win`, type "PowerShell", press Enter.

A black/dark window opens with a blinking cursor. Don't panic. This is where you type commands.

### Step 3: Verify Node.js is installed
Type this, press Enter:
```
node --version
```
You should see something like `v20.x.x`. If you get "command not found", restart again or reinstall Node.

### Step 4: Install Claude Code
Type this, press Enter:
```
npm install -g @anthropic-ai/claude-code
```
Wait 1-2 minutes. You'll see a lot of text scrolling. When the cursor comes back (prompt reappears), it's done.

If you see permission errors on Mac, run:
```
sudo npm install -g @anthropic-ai/claude-code
```
(It'll ask for your Mac password — just type it, no characters will show. Press Enter.)

### Step 5: Make sure you have a Claude paid account
Claude Code needs a paid subscription or API credits:
- **Recommended**: Claude Pro — $20/month at https://claude.ai/upgrade
  (if you're already on Pro, skip this)
- Alternative: API pay-as-you-go (new accounts get ~$5 free)

---

## Part 2 — Set up this project (10 min)

### Step 6: Put the project folder somewhere you'll find it
Put the `samlin-portfolio` folder on your Desktop or Documents. Remember where.

### Step 7: Navigate to the project in Terminal
In Terminal, type:
```
cd Desktop/samlin-portfolio
```
(Replace `Desktop` with wherever you put it. If it's in Documents, use `cd Documents/samlin-portfolio`.)

To confirm you're in the right place, type:
```
ls
```
You should see: `README.md  BUILD_PROMPTS.md  SETUP.md  index.html  styles  work  assets`

### Step 8: Start Claude Code
Type:
```
claude
```
First time: it'll ask you to log in. Follow the prompts (it'll open a browser, you log in with your Anthropic account, come back to Terminal).

You'll see something like:
```
Welcome to Claude Code!
>
```

That `>` is where you type your instructions.

---

## Part 3 — First session (5 min)

### Step 9: Paste the first prompt
Open `BUILD_PROMPTS.md` in a text editor (double-click the file). Copy the entire **PROMPT 1** (the one inside the triple backticks) and paste it into Claude Code. Press Enter.

Claude Code will read `README.md` and confirm it understands the project. This is just a verification step — nothing will change yet.

### Step 10: Preview the home page
Open a file browser (Finder on Mac, Explorer on Windows). Navigate to `samlin-portfolio/`. Double-click `index.html`. It opens in your browser.

**You should see the full home page rendering.** If you don't, that's your first problem to solve with Claude Code — paste: "index.html doesn't render correctly, please debug."

---

## Part 4 — Build Void case study (next prompt)

### Step 11: Run PROMPT 2
Copy the **PROMPT 2** from `BUILD_PROMPTS.md` into Claude Code. Press Enter.

Claude Code will create `work/void.html` using `work/iphone.html` as a template, filling in the Void content. This takes 2-5 minutes.

When it's done, open `work/void.html` in browser. Click "Next project" at the bottom — it should link to `iphone.html`. Click "Next project" on iphone — it should link back to void.

You now have a fully-functional 3-page portfolio running locally on your computer.

---

## Part 5 — Put it online (30 min)

Run **PROMPT 5** in Claude Code. It'll walk you through:
1. Installing Git (if not installed)
2. Creating a free GitHub account
3. Pushing your code there
4. Connecting Cloudflare Pages
5. Buying `samlin.studio` on Cloudflare Registrar
6. Pointing the domain at your site

Total: 30 min if everything goes smooth, 60 min if you hit one snag. Claude Code helps on every step.

---

## Troubleshooting

**"My fonts don't load"** — Check internet connection. Google Fonts loads from the web.

**"The marquee is running off the screen"** — That's correct behavior. It's supposed to loop infinitely. If it's not looping, there's a bug — ask Claude Code.

**"Chinese characters are garbled"** — Make sure `<meta charset="UTF-8">` is in every HTML file's `<head>`. Claude Code can verify.

**"I don't know where Terminal opened / where I am"** — Type `pwd` (Mac) or `cd` (Windows) to see your current location.

**"I accidentally typed something and it won't stop"** — Press `Ctrl + C` to cancel whatever Claude Code is doing.

**"I want to exit Claude Code"** — Type `/exit` or press `Ctrl + D`.

**"I need to come back tomorrow"** — Just close Terminal. Next time, open Terminal, `cd` to the project folder, type `claude` to resume.

---

## One final tip

When talking to Claude Code, **be specific**. "Make it look better" won't work. "The hero H1 is too small on mobile, increase to 72px minimum" will work.

Reference the design system. "Use `.display-l` for this heading" is a perfect instruction because the class is defined in `main.css`.

Good luck.
