# Agentic Video Studio

A TypeScript starter for code-generated technical explainers. The first composition,
**AgenticDevelopment**, is a silent 60-second, 1920 x 1080, 30 fps explainer:
task -> inspect/plan -> edit -> test/iterate -> human gate -> reviewable PR.
On-screen narration captions are included; no external assets, TTS, or paid services
are required. This is an editable starter, not a fully produced narrated video.

## Watch with one command

With Node.js **22.12.0+** installed, run this from any PowerShell directory:

```powershell
npx --yes github:pagalvin/agentic-video-studio
```

npx downloads the package and dependencies into its cache, then the launcher opens
Remotion Studio in your browser. Select `AgenticDevelopment` if necessary and press
Play to watch. Keep the command window running; Ctrl+C stops the local preview.
No repository clone, separate `npm install`, system FFmpeg, or render is required.
The first run needs internet access and can take a few minutes. npm may download
Puppeteer's optional Chrome during dependency installation; preview itself uses
your normal browser.

If browser auto-open fails, open the local URL printed in the command window.
To choose a port: `npx --yes github:pagalvin/agentic-video-studio --port=3047`.
Use `--no-open` to suppress browser opening, or `--help` for launcher usage.
This is an interactive preview, not an already-rendered MP4 or automatic playback.

## Manufacturing AI: Five connected pillars

A separate **ManufacturingPillars** composition reimagines the supplied manufacturing
AI capability slide as a 48-second motion-graphics video. It keeps the slide's five
pillars and supporting guidance: Educate, Assess, Govern, Decide, and Deliver & evolve.
An opening reveal, five seven-second spotlight scenes, and a closing overview combine
kinetic typography, color-coded navigation, light sweeps, procedural particles, and
a connected 3D pillar network. The closing emphasizes continuous evolution within
governed parameters. This video is silent, with readable on-screen text.

Run `npm run studio` (or the npx launcher), then select **ManufacturingPillars** in
the composition list. The original **AgenticDevelopment** video, default render
commands, and content are unchanged.

```powershell
npm run render:pillars        # Full 48-second 1080p MP4: out\manufacturing-pillars.mp4
npm run render:pillars:sample # One-second preview of the Educate reveal
npm run still:pillars         # Decide spotlight poster
npm run verify:pillars        # All beats/boundaries and repeat-frame determinism
```

New content is isolated in `src\pillars\content.ts`; text/colors can be edited there.
The layout, 3D scene, and effects live alongside it. All motion is derived from the
video frame, including particle locations, light sweeps, spring entrances, and
network motion. No downloaded imagery, fonts, models, or runtime LLM calls are used.
The slide was used as a content reference, not embedded as a static screenshot.
Verified the full 1,440-frame H.264 render at 1920 x 1080 / 30 fps (48 seconds),
all seven story beats and scene boundaries, and matching repeated-frame hashes.
The existing explainer's render verification also passes with its original frame hash.

## French press coffee tutorial

Select **FrenchPressCoffee** in Studio for a separate 72-second, 1080p/30 fps
tutorial. It uses an unbranded procedural stainless-steel press inspired by the
supplied product reference, a burr grinder, a gooseneck kettle, and a ceramic cup.
Eight nine-second scenes cover the recipe, coarse grinding, heating/cooling water,
adding grounds, pouring/stirring, steeping, plunging, and serving. Existing videos
and their default commands remain intact.

```powershell
npm run render:coffee        # Full MP4: out\french-press-coffee.mp4
npm run render:coffee:sample # Animated water-pour sample
npm run still:coffee         # Water-pour poster
npm run verify:coffee       # Scene/boundary and out-of-order pouring-frame checks
```

Warm lighting and procedural reflection panels give the metal its product-illustration
appearance. The opaque press becomes an explicitly labelled cutaway during brewing.
Water and coffee use frame-driven curved streams, impact droplets/ripples and matching
fill levels, not physical fluid simulation. Steam and grinding particles are also
procedural and deterministic. Models are illustrative rather than manufacturer-accurate;
no image/model assets, external fonts, audio, or paid services are downloaded.

The recipe is a starting point: 30 g coarse coffee, 500 g water at 93–96°C, roughly
four minutes of steeping, then a gentle plunge and decant. The steeping timer is
explicitly time-compressed. Hot-water caution and guidance not to force a resistant
plunger are included. Adjust the recipe to taste. The tutorial is silent with text
instructions; it does not simulate real heating or brewing times.
The full 2,160-frame H.264 video was rendered at 1920 x 1080 / 30 fps and decoded
successfully. All eight scenes and boundaries were checked, including matching
out-of-order water-pour frames. Both existing compositions retain their original
verification frame hashes.

## RAG network-diagram explainer

Select **RagFlow** for a separate 90-second, 1080p/30 fps animated architecture
diagram. Nine ten-second beats explain preparation and runtime using a persistent
network, color-coded moving packets, highlighted services, and a fictional chat.
All earlier videos and default commands are unchanged.

Preparation: PDF/Excel/Word -> ingestion API -> extraction/normalization/chunking ->
embeddings API -> an index containing original chunk text, vectors and source metadata.
Runtime: chat -> assistant -> MCP server -> retrieval API -> query embedding and
index search -> selected evidence returned through MCP -> generation LLM -> cited answer.
MCP is the optional tool-access layer, not the search engine. Diagram arrows show
logical data handoffs, not necessarily separate deployed components; the ingestion
API orchestrates preparation and storage, while the retrieval service handles search.

```powershell
npm run render:rag        # Full MP4: out\rag-flow.mp4
npm run render:rag:sample # Runtime retrieval sample
npm run still:rag         # Retrieval diagram poster
npm run verify:rag        # Every beat/boundary and repeat-frame seeking checks
```

The example asks about Line 3 inspections and references explicitly fictional Word
procedures, PDF checklists and Excel schedules. It illustrates citations without
claiming a real inspection process. Notes cover OCR, table/header context, source
provenance, document permissions, untrusted retrieved text and insufficient evidence.
The video is silent with on-screen explanation; it performs no real API, MCP, LLM
or database calls. Content/diagram data lives in `src\rag\story.ts`; SVG/React layout,
packet motion and chat rendering live alongside it and are entirely frame-driven.
Verified all nine beats and scene boundaries, repeat-frame determinism, and the full
2,700-frame H.264 render at 1920 x 1080 / 30 fps (90 seconds). Earlier composition
checks retain their original frame hashes.

## OAuth 2.0: Protocol choreography

Select **OAuthFlows** for a separate three-minute, 1080p/30 fps explainer.
Eighteen ten-second beats use persistent participant swimlanes and animated
message badges: authorization codes are dashed tickets, PKCE proof has a key motif,
tokens are capsules, and session cookies use their own color. Dashed message
arrows represent browser/front-channel exchanges; solid arrows represent application
calls. Messages appear in order, move across trust boundaries, and arrive before
the next exchange. All animation is frame-driven.

| Time | Chapter |
| --- | --- |
| 0:00 | OAuth roles and OIDC distinction |
| 0:10 | Authorization code with PKCE: proof, redirects, consent, code, token exchange and API access |
| 1:20 | Client credentials / application access without a user |
| 1:40 | Generic lanes transform into an Azure-hosted web-app architecture |
| 1:50 | App Service / Entra replay: redirects, callback, backend token exchange, browser session, API |
| 2:40 | Separate Azure managed-identity workload path |
| 2:50 | Flow selection and security takeaways |

```powershell
npm run render:oauth        # Full MP4: out\oauth-flows.mp4
npm run render:oauth:sample # Two-second PKCE exchange animation
npm run still:oauth         # Azure authorization request poster
npm run verify:oauth       # Every beat/boundary, mapping and deterministic seeking
```

The authorization-code example deliberately uses a **confidential server-side
client**. Its Azure counterpart is an **Azure App Service web app / BFF using
app-managed OIDC and a maintained authentication library**, not a SPA or an App
Service Easy Auth implementation guide. Client authentication and PKCE are both
shown; PKCE is not a substitute for confidential-client authentication. Azure
hosting alone does not select an OAuth flow. Callback/scopes/endpoints are
illustrative placeholders, never credentials or a deployed app configuration.

The web backend retains OAuth tokens; the browser receives a secure application
session cookie. An OIDC ID token authenticates the user to the client, while an
access token authorizes the intended resource API. The animation distinguishes
state checks, OIDC nonce validation, API token validation and permission checks.
Client credentials is app-only and issues neither ID nor refresh tokens.
Managed identity is a separate workload-access option: the SDK/platform endpoint
and Entra issuance are collapsed into a single logical handoff, and the resource
still needs permission assignments. This is not delegated user access.

This is a silent conceptual video, not a live sign-in, deployment, exhaustive grant
catalogue, or security implementation. Device authorization, refresh exchanges,
on-behalf-of and failure paths are not animated. Implicit/password grants are
mentioned only as patterns to avoid for modern designs. All existing videos and
their default commands remain unchanged. Content and message data are isolated
in `src\oauth\story.ts`.

Protocol references checked during authoring:

- [Microsoft Entra authorization code + PKCE](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Microsoft Entra client credentials](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow)
- [ID tokens and their intended use](https://learn.microsoft.com/en-us/entra/identity-platform/id-tokens)
- [Azure managed identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)
- [OAuth security best current practice / RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html)
- [PKCE / RFC 7636](https://www.rfc-editor.org/rfc/rfc7636.html)

Verified all eighteen beats and boundaries, generic-to-Azure label mapping, cookie
handoffs, actual PKCE packet movement and repeat-frame determinism. The full
5,400-frame H.264 MP4 at 1920 x 1080 / 30 fps (180 seconds) was rendered and decoded
successfully. All four earlier compositions retain their original verification
frame hashes.

## Cafe conversation

Select **CafeConversation** for a silent 28-second cartoon coffee break between
Milo and June. Two procedural 3D characters exchange a scarecrow joke across a
table using animated speech bubbles. The speaker gestures and makes restrained
mouth/head movements; the listener looks toward the speaker, raises eyebrows,
reacts with widened or half-lidded eyes, then smiles at the ending. Deterministic
blinks, head tilts and amused shoulder movement keep both characters alive.

```powershell
npm run render:conversation # Full 1080p MP4: out\cafe-conversation.mp4
npm run verify:conversation # Dialogue boundaries, gesture movement, repeat-frame checks
```

Dialogue, speakers and beat timing live in `src\conversation\dialogue.ts`.
The scene uses stylized procedural geometry, not downloaded rigged models or
photorealistic humans. Mouth motion suggests speech rather than audio lip-sync.
The tutorial videos and their default render commands are unchanged.

## Sprint demo visibility iceberg

Select **SprintDemoIceberg** for an 84-second silent explainer about why sprint
demos matter to people with different levels of daily project visibility.
A dimensional, faceted vector iceberg starts close on the implementation team
and its business partners, then pulls back to reveal four stakeholder groups:
executive leadership / steering committee, PMO, business sponsor, and consulting
leadership. Each group gets a spotlight explaining its role, questions and needs.

The demo becomes a shared window: business purpose, working evidence, honest gaps,
and explicit feedback/decision requests. Animated paths carry context outward and
feedback, decisions and support back to the team. The closing message preserves
celebration while making value and next actions visible. The metaphor represents
**visibility, not hierarchy, importance or headcount**; urgent issues must not wait
for a demo, and other communication channels remain necessary.

```powershell
npm run render:iceberg # Full 1080p MP4: out\sprint-demo-iceberg.mp4
npm run still:iceberg  # Shared-window poster
npm run verify:iceberg # Every beat/boundary, two-way motion and deterministic seeking
```

Edit stakeholder needs and scene text in `src\iceberg\story.ts`. All animation,
including the pullback, waves and flowing paths, derives from the current frame.
There is no audio, external artwork, downloaded model or new dependency.
Existing compositions and their default render commands remain unchanged.
The verification script uses the bundled Windows FFmpeg, or `ffmpeg` on PATH on
other platforms, to compare cropped diagram images independently of the progress bar.

## Windows setup

Install Node.js **22.12.0 or newer** (Node 24 LTS recommended) and Git. Open PowerShell
in this repository. Node 24.18.0 and npm 11.16.0 were used for setup.

```powershell
# Avoid a second browser download: Remotion manages its own rendering browser.
$env:PUPPETEER_SKIP_DOWNLOAD = "true"
npm ci
npm run typecheck
npm run studio
```

Open the URL printed by Studio (normally http://localhost:3000), select
`AgenticDevelopment`, and scrub/play the timeline. Stop Studio with Ctrl+C.
The first render may download Remotion's Chrome Headless Shell and platform
encoding tools into ignored dependency/cache directories. Internet access is
needed for installation and that first download, not for the composition itself.

```powershell
npm run render:sample  # First second at 960 x 540
npm run still         # Frame 450 poster
npm run verify:render # Scene-boundary stills, repeated-frame hash, actual sample MP4
npm run render        # Full 60-second H.264 MP4 in out\agentic-development.mp4
```

Outputs are ignored by Git. Full rendering can take several minutes, especially
with software 3D rendering. The default `swiftshader` backend prioritizes portability
over speed. For a supported GPU, try `npm run render -- --gl=angle`; verify output
again after switching hardware/backends. Cross-machine or cross-browser pixel
identity is not guaranteed.

Verified on Windows on 2026-10-14: clean `npm ci`, `npm run typecheck`,
API scene-boundary/determinism verification, CLI sample render, and Studio access
through Puppeteer. The encoded sample has 30 H.264 video frames at 960 x 540 and
30 fps. Repeated frame 450 had identical SHA-256 hashes after out-of-order seeking.
The full 1,800-frame video is configured but was not rendered during setup.

On npm versions with install-script approval prompts, review the packages before
approving scripts. Setup completed with Puppeteer/esbuild postinstall scripts
not executed; bundling used esbuild's installed platform binary. Puppeteer's
optional explicit browser install is described below. Do not disable install-script
safety globally just to suppress a warning.

## Verified pins and compatibility

All requested npm versions are published, and the manifest pins them exactly.
No requested npm versions were substituted. Keep **all Remotion packages on the
same version** when updating; commit the regenerated lockfile.

| Package | Version |
| --- | --- |
| three | 0.180.0 |
| @react-three/fiber | 9.7.0 |
| @react-three/drei | 10.7.8 |
| gsap | 3.15.0 |
| puppeteer | 25.10.0 |
| remotion, @remotion/cli, @remotion/renderer, @remotion/bundler, @remotion/three | 4.0.521 |
| react, react-dom | 19.2.8 |

Fiber accepts React/React DOM `>=19 <19.3` and Three `>=0.156`; Drei accepts
React 19, Fiber 9, and Three `>=0.159`. Remotion Three accepts Fiber `>=8`,
Three `>=0.137`, and requires matching Remotion 4.0.521. Fiber's Expo and React
Native peers are optional and not needed for this web-only project. Puppeteer
25.10.0 requires Node `>=22.12.0`. Do not use `--force` or `--legacy-peer-deps`.

## How the animation works

`src\video\story.ts` contains the six ten-second beats and captions.
`AgenticDevelopment.tsx` derives the active beat, text transitions, and progress
indicators from `useCurrentFrame`. GSAP is used only as a **pure easing function**
(`parseEase`), never as a live timeline.

`WorkflowScene.tsx` uses Remotion's `ThreeCanvas`, Fiber mesh primitives, Three.js
geometry/materials, and Drei `Edges` for six procedural workflow nodes. Rotation,
scale, and lighting state are computed from the same video frame. There is no
`useFrame`, wall-clock animation, random data, external model, or CSS animation.
Out-of-order seeking therefore reconstructs the same frame without playback history.

`scripts\verify-render.mjs` uses the pinned bundler/renderer APIs to check composition
metadata, render every scene boundary, seek out of order and compare repeated PNG
SHA-256 hashes, and encode a 30-frame sample. API rendering explicitly sets the
same GL backend as the CLI; Remotion CLI configuration does not apply to API calls.

## Puppeteer versus Remotion

Puppeteer is pinned for **optional browser automation** (Studio page diagnostics,
future browser-based asset capture). It does not drive the video timeline and is
not a replacement for Remotion's renderer or rendering browser.

If you want its separate Chrome download:

```powershell
npm run browser:install
# With Studio running in another PowerShell window:
npm run browser:check
npm run browser:check -- http://localhost:3000
```

Alternatively, set `$env:PUPPETEER_EXECUTABLE_PATH` to an explicitly chosen compatible
Chrome executable before `browser:check`. This affects only the current shell.
Browser installation uses Puppeteer's user cache; do not commit browser binaries.

## System FFmpeg 8.1 full

**Not installed/on PATH on the setup machine.** No global package or PATH was
changed. FFmpeg's official download page lists the 8.1 release family (currently
8.1.3); the exact **8.1 full Windows binary** has not been provisioned or verified.
"Full" describes a distributor's build options, not a separate upstream npm package.
No silent substitution with FFmpeg 9 or another major/minor release is intended.

Remotion supplies its own platform encoding tools, so its MP4 render does **not**
require or prove availability of system FFmpeg 8.1. A separate system installation
is useful for inspecting outputs, transcoding, audio mixing, and post-processing.
The pinned Remotion Windows encoder reports FFmpeg **n7.1**; this is an internal
Remotion dependency, not a provisioned substitute for the requested system 8.1.

For an exact 8.1 requirement, follow [FFmpeg's Windows build links](https://ffmpeg.org/download.html#build-windows)
to Gyan or BtbN and check archived releases/build metadata for an **8.1 full** build.
Do not assume the current/latest download is 8.1. If an exact trusted prebuilt is
unavailable, use a vetted build of the upstream 8.1 tag or explicitly agree on an
8.1.x patch substitution. Verify distributor checksums/signatures before extraction.
Extract to a user-owned folder, for example `C:\Tools\ffmpeg-8.1`, and invoke by
absolute path without changing global PATH:

```powershell
& "C:\Tools\ffmpeg-8.1\bin\ffmpeg.exe" -version
& "C:\Tools\ffmpeg-8.1\bin\ffmpeg.exe" -buildconf
& "C:\Tools\ffmpeg-8.1\bin\ffprobe.exe" -v error -show_entries stream=codec_name,width,height,r_frame_rate -show_entries format=duration -of json "out\agentic-development.mp4"
```

Confirm the first command reports the intended version and inspect `-buildconf`
against your required codec/filter set. Only add PATH entries if you choose to.

## References and licensing

- [Remotion ThreeCanvas](https://www.remotion.dev/docs/three-canvas)
- [Remotion rendering](https://www.remotion.dev/docs/render)
- [Remotion renderMedia API](https://www.remotion.dev/docs/renderer/render-media)
- [Remotion GL backends](https://www.remotion.dev/docs/chromium-flags)
- [Puppeteer installation/configuration](https://pptr.dev/guides/configuration)
- [FFmpeg official downloads](https://ffmpeg.org/download.html)

Review [Remotion's license](https://www.remotion.dev/license) before commercial/team
use; a paid license may be required depending on your organization and usage.
