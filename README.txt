J.A.R.V.I.S. CHROMEBOOK PROTOTYPE
=================================

WHAT THIS IS
A futuristic, responsive web app with an animated holographic core, command terminal,
custom spoken wake phrase, voice responses, notes and mission checklist.

IMPORTANT LIMITATIONS
- This prototype's chat responses are demo logic, not a connected AI model.
- Custom wake phrase detection uses browser speech recognition. It is not a system-level
  always-on wake word. Keep the app open, start voice listening, and allow microphone access.
- Speech recognition generally needs an internet connection and browser support.
- Notes are stored locally in this browser/device. They do not automatically sync.
- CPU and memory readings are visual simulations, not actual Chromebook telemetry.

RUN LOCALLY
For a quick preview, open index.html in Chrome. Some browser features (especially
service workers and installability) require HTTPS or localhost.

INSTALL AS A CHROME APP (PWA)
1. Put the project on an HTTPS website (for example, a static hosting service).
2. Open its HTTPS address in Chrome on your Chromebook.
3. Use the install icon in the address bar, or Chrome menu > Cast, save, and share >
   Install page as app (wording may vary).
4. Allow microphone access when using voice features.

For local development, run a local web server in the project folder, then open
http://localhost:8000. A simple option is: python3 -m http.server 8000

NEXT DEVELOPMENT STEP
Connect a real AI backend securely. Do not put private API keys directly in app.js
or any browser-side code. Use a protected server endpoint.


SAFE DEVICE ACCESS (V2 FOUNDATION)
----------------------------------
The Device Bridge adds only user-initiated, limited features:
- Open a text/CSV/JSON/Markdown file selected by the user (read-only preview).
- Export notes as a local text download.
- Copy notes after a user click and browser permission.
- Request browser notification permission.

It intentionally does NOT provide unrestricted computer access, remote control,
arbitrary shell/terminal commands, keylogging, hidden persistence, or silent file access.
A normal Chrome web app cannot safely or legitimately control the entire Chromebook.
For deeper integrations, use Chrome/ChromeOS-supported APIs and explicit permissions,
with a trusted adult reviewing any extension or installation.

SECURITY PRACTICES
- Keep ChromeOS and Chrome updated.
- Install only from a source you trust.
- Never paste API keys, passwords, or private tokens into frontend code.
- Do not grant broad accessibility or developer permissions to unknown software.
- Back up important files.
- Treat any "full access" request as a warning sign; grant the minimum permissions needed.
