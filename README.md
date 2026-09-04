# Indonesia Cultural Pulse

Build a high-fidelity, responsive public platform called “Indonesia Vibes”, an English-language global cultural diplomacy platform.

Use the uploaded Indonesia Vibes Strategic Product Brief Final, Indonesian Vibes Visual Identity, and uploaded logo assets as the primary source of truth.

Do not create a generic cultural tourism website. This platform must feel like a premium global cultural publication, a connected cultural knowledge network, and a gateway for international collaboration.

==================================================

PROJECT GOAL

==================================================

Indonesia Vibes introduces Indonesia to international audiences through:

- cultural stories,

- heritage and contemporary expressions,

- people and communities,

- places and experiences,

- events in Indonesia and around the world,

- knowledge and research,

- opportunities,

- and international collaboration.

The core user journey is:

Discover → Understand → Experience → Connect → Collaborate

Every page must help users answer:

1. What is this?

2. Why does it matter?

3. What can I explore or do next?

Indonesia Vibes is not:

- a ministry news portal,

- a government information website,

- a static heritage catalogue,

- a tourism booking platform,

- an online ticketing platform,

- or a ceremonial programme website.

The government may support the platform, but the visitor experience must remain editorial, open, welcoming, global, and independent-facing.

==================================================

BRAND CONFIGURATION

==================================================

Create a reusable global brand configuration so the product name can be changed centrally later.

Use:

brandName: “Indonesia Vibes”

Use the uploaded logo assets as the official visual mark. Do not redraw or reinterpret the logo.

All visible interface copy must be written in natural, polished English for international audiences.

Do not translate bureaucratic Indonesian copy literally.

==================================================

VISUAL DIRECTION

==================================================

Follow the uploaded visual identity closely.

Primary typography:

- DM Sans

Brand colours:

- Brand red: #EC3118

- Deep red: #A80F0F

- Soft pink: #FA9F9F

- Light blush: #FEECEC

- Deep brown: #3A1E1E

- Brown: #5C2121

- Muted brown: #614B4B

- Warm grey: #897878

- Light neutral: #B0A5A5

- White: #FFFFFF

The visual experience should feel:

- editorial,

- contemporary,

- culturally rooted,

- sophisticated,

- warm,

- credible,

- visual,

- spacious,

- and confidently Indonesian.

Use:

- strong cultural photography,

- generous whitespace,

- large editorial headlines,

- varied but consistent content compositions,

- subtle concentric-wave graphics,

- restrained brand-red accents,

- clear hierarchy,

- immersive full-width media,

- elegant motion and transitions.

The wave visual language may appear as:

- subtle background lines,

- map pulses,

- hover effects,

- section transitions,

- loading indicators,

- or visual links between locations.

Do not overuse it.

Avoid:

- corporate blue,

- excessive gradients,

- glassmorphism,

- generic startup design,

- decorative cultural ornaments without context,

- excessive batik patterns,

- crowded government-portal layouts,

- repetitive rounded cards,

- dashboard-style statistics on public pages,

- excessive animations,

- and generic stock-template composition.

Respect prefers-reduced-motion.

==================================================

TECHNICAL FOUNDATION

==================================================

Use:

- React

- TypeScript

- Tailwind CSS

- reusable components

- structured mock data

- clean route organisation

- central design tokens

- responsive layouts

- accessible semantic HTML

Do not build a backend or CMS yet.

Create typed mock datasets for:

- stories,

- collections,

- cultural subjects,

- people,

- communities,

- institutions,

- places,

- events,

- opportunities,

- and collaborations.

Content objects must be relational.

For example:

A story connects to:

- cultural subjects,

- people,

- places,

- institutions,

- events,

- research,

- opportunities,

- and collaborations.

Do not manually duplicate related content inside every page.

==================================================

GLOBAL NAVIGATION

==================================================

Create a sticky responsive header containing:

- logo

- Discover

- Culture

- Experience

- Connect

- About

- Search icon

- a distinctive NOW entry

NOW should feel more active than a normal navigation item.

Desktop:

- use clean editorial mega menus.

Mobile:

- use a polished full-screen navigation panel,

- keep NOW prominent,

- keep search easily accessible,

- avoid cramped dropdowns.

Mega-menu content:

DISCOVER

- Stories

- Collections

- Latest

- Editor’s Picks

CULTURE

- Heritage & Traditions

- Contemporary Culture

- People & Communities

- Institutions

- Knowledge & Research

EXPERIENCE

- Events

- Places

- Indonesia Around the World

CONNECT

- Opportunities

- International Collaborations

- Submit an Inquiry

- Contribute

ABOUT

- About Indonesia Vibes

- Editorial Standards

- Partners & Contributors

- Contact

Footer:

- About

- Editorial Standards

- Contribute

- Partners

- Contact

- Privacy

- Terms of Use

- Accessibility

- Social Media

- Newsletter

==================================================

PHASE 1 ROUTES

==================================================

Build these 12 pages first:

1. /

Homepage

2. /now

NOW

3. /stories

Stories Landing

4. /stories/:slug

Story Detail

5. /culture

Culture Landing

6. /culture/:slug

Cultural Subject Detail

7. /events

Events Listing

8. /events/:slug

Event Detail

9. /around-the-world

Indonesia Around the World

10. /connect

Connect Landing

11. /opportunities/:slug

Opportunity Detail

12. /inquiry

Inquiry Selector and Form

Also create:

- /inquiry/success

- search overlay

- responsive navigation

- 404 state

- expired opportunity state

- completed event state

- cancelled event state

- empty filter state

Every route and primary CTA must work.

Do not turn this into a single landing page.

==================================================

HOMEPAGE

==================================================

The homepage should create this reaction:

“I did not know Indonesia had this.”

Build the homepage with the following editorial flow:

1. Hero

2. NOW

3. Indonesia Around the World

4. Featured Collection

5. Explore Culture

6. People to Know

7. Upcoming Experiences

8. Current Collaborations

9. Opportunities

10. Newsletter

HERO

Use an immersive cultural photograph or video.

Include:

- editorial content label,

- concise headline,

- short standfirst,

- featured story or collection,

- Explore the Story CTA.

Avoid generic copy such as:

“Discover the beauty and diversity of Indonesia.”

Use a stronger editorial direction such as:

“Across thousands of islands, culture is not simply preserved. It is lived, exchanged, and continuously reimagined.”

NOW PREVIEW

Show:

- events happening this week,

- a current exhibition,

- an Indonesian performance abroad,

- an opportunity closing soon,

- and a recently published story.

Each item should show relevant date, city, country, type, and status.

CTA:

See What’s Happening

INDONESIA AROUND THE WORLD PREVIEW

Show a visually striking world-map section with sample cultural activity in:

- Paris

- London

- Tokyo

- Sydney

- New York

- Lisbon

- Singapore

Activities may include:

- exhibitions,

- performances,

- film programmes,

- research partnerships,

- residencies,

- and cultural exchanges.

CTA:

Explore Indonesia Around the World

FEATURED COLLECTION

Use:

Living Textile Traditions

Connect stories, practices, makers, communities, places, exhibitions, and research.

EXPLORE CULTURE

Include:

- Heritage

- Performing Arts

- Music

- Film

- Literature

- Craft & Design

- Culinary Culture

- Contemporary Culture

Do not present these as an e-commerce category grid.

PEOPLE TO KNOW

Show culturally respectful portraits of:

- artists,

- masters,

- researchers,

- curators,

- and communities.

UPCOMING EXPERIENCES

Combine selected:

- events,

- festivals,

- exhibitions,

- performances,

- museums,

- and cultural places.

CURRENT COLLABORATIONS

Show international collaboration case studies containing:

- countries,

- partners,

- cultural theme,

- status,

- short output or outcome.

OPPORTUNITIES

Show 3–4:

- residencies,

- open calls,

- fellowships,

- exchanges,

- or research opportunities.

Make the deadline and status visually clear.

NEWSLETTER

Use:

“Stories, events, and cultural opportunities from Indonesia and around the world.”

==================================================

NOW PAGE

==================================================

The page must make Indonesia Vibes feel alive and current.

Include filters:

TIME

- Today

- This Week

- This Month

- Upcoming

LOCATION

- In Indonesia

- Around the World

- Online

TYPE

- Events

- Exhibitions

- Performances

- Festivals

- Opportunities

- New Stories

- Collaborations

Include:

- featured happening,

- timeline or calendar-style presentation,

- current event cards,

- approaching opportunity deadlines,

- latest stories,

- editorial highlights.

Rules:

- completed events display Archived,

- expired opportunities display Closed,

- cancelled events have a clear Cancelled label,

- content without a date must not appear here,

- event time must show the local time zone.

==================================================

STORIES

==================================================

STORIES LANDING

Include:

- featured story,

- latest stories,

- editor’s picks,

- collections,

- browse by theme,

- browse by format,

- browse by place.

Formats:

- Feature

- Interview

- Essay

- Photo Story

- Video Story

- Field Notes

STORY DETAIL

Create a premium long-form editorial experience with:

- hero media,

- content label,

- title,

- standfirst,

- author,

- contributor,

- publication date,

- reading time,

- main narrative,

- pull quotes,

- photography,

- video,

- audio block,

- sources,

- references,

- media credits,

- last reviewed date,

- related cultural subjects,

- related people,

- related places,

- related events,

- contextual CTA.

Contextual CTA examples:

- Explore the Culture

- Meet the Community

- Plan Your Visit

- View the Research

- Explore the Collaboration

Do not use a generic blog-detail layout.

==================================================

CULTURE

==================================================

CULTURE LANDING

Include:

- editorial introduction,

- featured cultural subjects,

- heritage and traditions,

- contemporary culture,

- explore by category,

- explore by region,

- people and communities,

- research and knowledge,

- featured collection.

Avoid making an alphabetical database the primary interface.

CULTURAL SUBJECT DETAIL

Include:

- English name,

- local or original name,

- pronunciation where useful,

- hero media,

- short introduction,

- why it matters,

- historical context,

- how it is practised today,

- communities or custodians,

- geographic origin,

- where it can be experienced,

- related people,

- related institutions,

- current events,

- stories,

- research and references,

- recognition status,

- cultural sensitivity note,

- reviewer,

- last reviewed date,

- media rights.

Possible CTAs:

- Experience It

- Meet the Community

- Explore the Research

- Find an Institution

- Submit an Inquiry

The page should feel alive and contextual, not like an encyclopaedia entry.

==================================================

EVENTS

==================================================

EVENT LISTING

Support:

- editorial card view,

- calendar view,

- list view,

- map view.

Filters:

- date,

- country,

- city,

- format,

- event type,

- cultural theme,

- language,

- free or ticketed.

Primary groupings:

- In Indonesia

- Around the World

- Online

EVENT DETAIL

Include:

- title,

- event status,

- date,

- time,

- time zone,

- format,

- venue,

- city,

- country,

- cultural context,

- organiser,

- partners,

- programme,

- artists or speakers,

- languages,

- registration or ticket information,

- official website,

- map,

- related culture,

- related people,

- related places,

- related stories,

- related events.

Primary CTA:

Visit Official Website

Secondary CTAs:

- Add to Calendar

- Explore the Culture

- View on Map

Indonesia Vibes does not sell tickets.

==================================================

INDONESIA AROUND THE WORLD

==================================================

This is a signature experience, not merely an event map.

Create:

- a strong global editorial introduction,

- immersive interactive world map,

- cultural activity markers,

- subtle brand-wave pulse animation,

- location hover previews,

- selected-country side panel,

- happening now,

- browse by country,

- browse by cultural theme,

- international collaborations,

- Indonesian institutions involved,

- upcoming activities abroad,

- stories from around the world,

- collaboration CTA.

Represent:

- performances,

- exhibitions,

- festivals,

- film programmes,

- research partnerships,

- residencies,

- exchanges,

- historical cultural relationships,

- and ongoing institutional partnerships.

Filters:

- country,

- region,

- date,

- activity type,

- cultural theme,

- Indonesian partner,

- international partner,

- status.

Primary CTA:

Explore Global Presence

Secondary CTA:

Propose a Collaboration

Always provide an accessible list alternative to the map.

==================================================

CONNECT

==================================================

The page should open with:

“How would you like to connect with Indonesia?”

Create intent-based choices:

- Find a research partner

- Find an artist or cultural practitioner

- Connect with an institution

- Discover an event or programme

- Find a residency or open call

- Propose a cultural collaboration

- Request media information

Include:

- current opportunities,

- collaboration case studies,

- institution profiles,

- research pathways,

- request introduction,

- submit inquiry,

- contributor invitation.

==================================================

OPPORTUNITY DETAIL

==================================================

Include:

- title,

- status,

- opportunity type,

- organiser,

- description,

- eligibility,

- location,

- format,

- support or funding,

- opening date,

- deadline,

- required documents,

- application process,

- official application link,

- contact,

- related institution,

- cultural themes,

- similar opportunities.

Primary CTA:

Apply on Official Website

Expired state:

- display Closed,

- disable application button,

- keep page available as archive,

- show active alternatives.

==================================================

INQUIRY JOURNEY

==================================================

Create a three-step experience.

STEP 1 — SELECTOR

Question:

“How would you like to connect with Indonesia?”

Categories:

- Cultural collaboration

- Research and academic partnership

- Artist or speaker invitation

- Exhibition or performance

- Institutional partnership

- Cultural visit or programme

- Media and publication

- General inquiry

STEP 2 — FORM

Fields:

- Full name

- Email

- Organisation

- Role

- Country

- Inquiry category

- Subject

- Related cultural subject, person, institution, event, opportunity, or collaboration

- Brief description

- Desired outcome

- Proposed timeline

- Supporting link

- Optional attachment

- Consent to share relevant information with potential partners

- Privacy acknowledgement

Use progressive disclosure.

The form should feel warm, focused, and professional, not bureaucratic.

STEP 3 — SUCCESS

Show:

- confirmation message,

- unique reference number,

- inquiry category,

- brief submission summary,

- explanation that the Indonesia Vibes team will review and route the inquiry to relevant partners where appropriate.

Do not promise a fixed response time.

==================================================

CONNECTED CONTENT

==================================================

No page should become a dead end.

Use meaningful relationship labels such as:

- Related Cultural Practice

- Meet the Community

- Where to Experience It

- Connected Institutions

- Research and References

- Current Opportunities

- Part of This Collection

- International Connections

Do not use a generic “You May Also Like” label everywhere.

Example relationship:

Story: Gamelan Across Oceans

→ Javanese Gamelan

→ Musicians and Researchers

→ Yogyakarta and London

→ Indonesian and UK Institutions

→ Research Publications

→ Indonesia–UK Music Collaboration

→ Artist Residency Opportunity

==================================================

DEMO CONTENT

==================================================

Create polished English prototype content based around:

- Living Textile Traditions

- Indonesia’s Maritime Cultures

- Contemporary Indonesian Cinema

- Gamelan Across Oceans

- Cultural Connections Between Indonesia and the World

- Indigenous Knowledge and Environmental Stewardship

- New Voices in Indonesian Design

Do not fabricate:

- UNESCO recognition,

- government statistics,

- official awards,

- historical claims,

- quotations from real people,

- or official partnerships.

Clearly treat the content as prototype editorial material.

==================================================

ACCESSIBILITY AND RESPONSIVENESS

==================================================

Ensure:

- desktop, tablet, and mobile layouts,

- accessible colour contrast,

- keyboard navigation,

- visible focus states,

- semantic heading structure,

- labelled fields,

- clear form validation,

- accessible touch targets,

- accessible map alternatives,

- accessible calendar/list alternatives,

- no essential information available only through hover,

- reduced-motion support.

==================================================

MVP GUARDRAILS

==================================================

Do not add:

- public accounts,

- comments,

- favourites,

- direct messaging,

- ticket sales,

- travel booking,

- payments,

- social feed,

- community forum,

- chatbot,

- AI recommendations,

- personalisation,

- or a complete CMS.

The public MVP focuses on:

- discovery,

- storytelling,

- connected cultural knowledge,

- events,

- global presence,

- opportunities,

- and facilitated collaboration.

==================================================

ACCEPTANCE CRITERIA

==================================================

Before considering Phase 1 complete:

- all 12 priority routes exist,

- all navigation items lead somewhere,

- primary CTAs work,

- filters visibly update content,

- search overlay works with mock data,

- maps have interactive and accessible list states,

- inquiry validation works,

- inquiry success page works,

- event and opportunity statuses work,

- desktop, tablet, and mobile layouts are audited,

- related content is generated from structured relationships,

- visual identity is consistent,

- and the experience feels editorial rather than governmental.

Start by creating the global design system, navigation, reusable data structure, and Homepage.

Then implement the remaining priority routes using the same system.

Do not generate all pages as disconnected static mockups.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://indonesia-vibes-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6b1f7b8b-ebc7-45f3-a6bb-3b5215d7946d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
