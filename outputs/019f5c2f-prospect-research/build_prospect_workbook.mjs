import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = new URL(".", import.meta.url).pathname;

const leads = [
  ["f8 Real Estate Media", "California", "David Hsu / existing DaVeenci contact", "Operations-focused team member / warm relationship", "", "855-382-3873", "Warm email or call to prior contact", "User reports prior project; confirm current Aryeo/Spiro stack", "11–50 staff publicly; mobile ordering, short-notice scheduling, next-day delivery, many service types", "Because we have already worked inside your workflow, I wanted to ask which handoff still needs the most manual attention after an order arrives.", "Expand AutoPilot around the next unresolved handoff: exceptions, assignment, or morning reporting", "https://www.f8re.com/", "https://www.linkedin.com/company/f8-real-estate-media", "https://www.linkedin.com/in/david-hsu-5184605", 3, 3, 1, 2],
  ["Archi-Pix", "MN + expanding markets incl. Dallas", "Alex Aaron / existing DaVeenci contact", "Owner / warm relationship", "contact@archi-pix.com", "800-930-2540", "Warm email to prior contact; owner email second", "User reports prior project; confirm current Aryeo/Spiro stack", "Same-day delivery, weekend/holiday appointments, contractor expansion into Dallas", "I saw Archi-Pix is expanding contractor coverage in Dallas. How are photographer onboarding, coverage rules, and schedule exceptions being coordinated now?", "Contractor onboarding + skills/territory assignment workflow with exception alerts", "https://archi-pix.com/", "https://archi-pix.com/contact/", "https://www.linkedin.com/jobs/view/freelance-real-estate-photographer-dallas-tx-area-at-archi-pix-4399578076", 3, 3, 1, 2],
  ["Northern Spruce Media", "Ontario, Canada", "Sarah James, then Alex Coombs", "Managing Director, Design & Operations / Founder & CEO", "", "", "LinkedIn to Sarah; website form; then Alex", "Recent Spiro podcast guest/ecosystem signal; current use not confirmed", "19-person team, two offices, nearly 500 agents and 2,000+ shoots in 2024", "Two offices and 2,000 shoots create a lot of exceptions. Which daily check still lives with Sarah or Alex instead of the system?", "Daily exception briefing across shoots, editors, deadlines, and client follow-ups", "https://northernsprucemedia.com/", "https://northernsprucemedia.com/about-us-2/", "https://spiromedia.podbean.com/", 0, 3, 2, 1],
  ["Weston Media", "Myrtle Beach, SC + Aiken", "Tyler Graham", "Founder / Owner", "hello@weston-media.com", "843-396-3609", "Personal email to Tyler; Instagram follow-up", "Spiro owner spotlight/ecosystem signal; current stack should be confirmed", "Five specialists, two trainees, sister company launched in 2025, next-day delivery", "You now have five specialists, two trainees, and a second brand. What part of assignment, QC, or delivery is hardest to keep consistent across both operations?", "Multi-brand assignment and next-day delivery exception dashboard", "https://www.weston-media.com/", "https://www.weston-media.com/general-7", "https://spiromedia.podbean.com/page/6/", 0, 3, 2, 2],
  ["Watson Media House", "Kansas City, St. Louis, Tulsa, SW Missouri, NW Arkansas", "Todd Watson", "Founder & CEO", "contact@watsonmediahouse.com", "417-815-3308", "Personal email to Todd; LinkedIn follow-up", "Aryeo is referenced on current booking/guarantee pages", "20+ staff, five regions, 1,000+ agents and 10,000+ listings", "With five regions and a 24-hour promise, I suspect the costly work is no longer booking—it is seeing the jobs that will miss the promise before clients notice.", "Aryeo-linked morning exception report: unassigned, late upload, editing, QC, delivery", "https://watsonmediahouse.com/", "https://watsonmediahouse.com/about", "https://watsonmediahouse.com/", 0, 3, 2, 2],
  ["Three Palms Media", "Southwest Florida", "Colleen and Tim Kydd", "Owners", "info@threepalmsmedia.net", "239-299-7804", "Personal email to Colleen; Instagram follow-up", "Recent Spiro podcast guest/ecosystem signal; current use not confirmed", "Grew from husband-and-wife operation into a full media company across a large service area", "You have grown past the husband-and-wife stage. Which decision still lands on Colleen or Tim every day even though it follows repeatable rules?", "Owner-dependency audit plus automation of one scheduling, delivery, or follow-up handoff", "https://www.threepalmsmedia.net/", "https://www.threepalmsmedia.net/", "https://spiromedia.podbean.com/", 0, 2, 2, 2],
  ["Eliora Media", "Oklahoma City metro", "Elizabeth Hansen", "Founder & Photographer", "elioramedia405@gmail.com", "405-421-1911", "Personal email to Elizabeth", "Spiro podcast guest/ecosystem signal; public order page is HDPhotoHub; confirm current stack", "650+ houses in 2025, next-day guarantee, broad bundled deliverables", "At 650 houses a year, the photo work is visible—but the package-completeness and next-day checks are probably the part clients never see.", "Package completeness checker and next-day risk notification", "https://www.elioramedia.com/", "https://www.elioramedia.com/about-1", "https://spiromedia.podbean.com/", 0, 2, 1, 2],
  ["Integrity Imaging Solutions", "WV, VA, MD, PA", "Stephen Carroll", "Owner", "info@integrityimagingllc.com", "240-358-1788", "Personal email naming Stephen; phone follow-up", "Current site and public listing pages explicitly show Aryeo", "Four-state coverage, team delivery, multiple media types, nine years in business", "Four-state coverage usually creates edge cases around travel, availability, and service eligibility. Which one still requires a manual check before confirming a job?", "Aryeo preflight validator for territory, travel, service eligibility, and required order data", "https://integrityimagingllc.com/", "https://integrityimagingllc.com/team/", "https://integrity-imaging-solutions-llc.aryeo.com/sites/220-e-liberty-st-martinsburg-wv-25404-5481056", 0, 2, 2, 2],
  ["Servant 360", "Albuquerque / Rio Rancho, NM", "Pete Stagl", "Owner", "pete@servant360nm.com", "505-600-1230", "Personal email to Pete referencing his owner spotlight", "Featured in Spiro Owner Spotlight; likely ecosystem user, but confirm current stack", "Owner-led team, scheduling plus MLS upload and broad property-media workflow", "Your clients mention that Servant uploads directly into MLS. Where does the team still re-key listing or delivery information between systems?", "Order-to-MLS/Aryeo/Spiro data handoff audit and one automated transfer", "https://www.servant360nm.com/", "https://linktr.ee/servant360", "https://spiromedia.podbean.com/page/17/", 0, 2, 2, 2],
  ["Rocket Lister", "Arizona, Nevada, Colorado", "Jessica Owen", "Operations Manager", "jess@rocketlister.com", "480-999-0911", "Email Jessica first; copy owner Ryan only after relevance is clear", "Proprietary app/portal; no Aryeo or Spiro evidence found", "203,000+ homes, multi-state, next-morning delivery and listing-task services", "Your operation coordinates media plus signs, lockboxes, and MLS entry. Which cross-service exception generates the most internal follow-up?", "Cross-service exception queue covering capture, sign/lockbox, MLS entry, and delivery", "https://www.rocketlister.com/", "https://www.rocketlister.com/about-us/", "https://play.google.com/store/apps/details?id=com.rocketlistermobileapp", 0, 3, 0, 2],
  ["Snap2Close", "Phoenix + expansion markets", "Charlie Taylor", "Owner", "", "480-535-8146", "Contact form with Charlie named; phone follow-up", "Custom client portal; no Aryeo/Spiro evidence found", "1,800+ clients; expanding to Tucson, DFW, Tampa Bay, NYC and other markets", "Your careers page says the staff handles scheduling, processing, communication, delivery, billing, and logistics. Which queue becomes hardest to see as new markets open?", "New-market operations dashboard and escalation queue", "https://snap2close.com/", "https://snap2close.com/contact/", "https://snap2close.com/careers/", 0, 3, 0, 2],
  ["Showcase Photographers", "Nashville + multiple/nationwide markets", "Amanda Pirtle, then Dan Raper", "Director of Communications & Administrator / Founder & CEO", "showcasephotographers@gmail.com", "855-598-7659", "Email Amanda with an operations question; escalate to Dan", "Independent system; company publicly argues against Aryeo licensing", "Dedicated scheduling, production, post-production and admin teams; thousands of properties monthly", "Your team spans scheduling, production, post-production, and administration. Where does an order most often lose context between those groups?", "Handoff completeness and exception workflow without changing the current platform", "https://www.showcasephotographers.com/", "https://www.showcasephotographers.com/about/", "https://www.showcasephotographers.com/how-we-work/", 0, 3, 0, 2],
  ["HD BROS", "Mid-Atlantic + Southeast", "Chris Pressey", "North Carolina Area Manager / Partner", "chris.pressey@hdbros.com", "540-840-1388", "Email Chris as a regional-operations pilot", "Enterprise workflow mentioned; no Aryeo/Spiro evidence confirmed", "40 staff reported in 2022, 50,000+ projects, many markets, next-day delivery", "Rather than changing a national workflow, I would start with one region: which exception does the NC team track outside the main system?", "One-region exception-reporting pilot that can be standardized if useful", "https://www.hdbros.com/", "https://www.hdbros.com/", "https://file.realproducersmagazine.com/issue/2022_Nov_Real_Producers_Triangle.pdf", 0, 3, 0, 2],
  ["Full Package Media", "Dallas–Fort Worth, TX", "Thomas Crosson and Gretchen Mikulich", "Co-founders", "", "833-266-5376", "Founder LinkedIn or website contact; phone only after personalized note", "No Aryeo/Spiro evidence confirmed", "Team has grown considerably; 1,000+ reviews and high service breadth", "With photography, video, 3D, staging, floor plans, and a large team, which package-completeness check is still performed manually before delivery?", "Pre-delivery package completeness and missing-asset alert", "https://fullpackagemedia.com/", "https://fullpackagemedia.com/dallas-real-estate-photography-about-us/", "https://fullpackagemedia.com/", 0, 3, 0, 1],
  ["ProVisuals Media", "Phoenix / Scottsdale, AZ", "Phil Johnson", "Owner & Founder", "phil@provisuals.media", "602-317-5591", "Personal email to Phil", "No Aryeo/Spiro evidence confirmed", "Four named shooters; intentionally small team serving luxury listings", "You intentionally keep the team small to protect quality. Which QC or client-preference detail is hardest to transfer between four shooters?", "Client-preference memory and lightweight pre-shoot/QA brief generator", "https://www.provisuals.media/", "https://www.provisuals.media/team", "https://www.provisuals.media/team", 0, 2, 0, 2],
  ["Zadaka Media", "Minneapolis, MN", "Ethan Zadaka", "Founder & CEO", "", "763-200-6304", "Website form, then phone or Instagram", "Current site states media is delivered through Aryeo", "Owner-led company with photography, video, drone, Matterport and floor plans", "Because every job can include five different deliverable types, how do you currently verify that the full Aryeo package is ready before the client email goes out?", "Aryeo package completeness checker", "https://www.zadakamedia.com/", "https://www.zadakamedia.com/about", "https://www.zadakamedia.com/", 0, 1, 2, 1],
  ["Realty Media 360", "Florida, broad multi-city coverage", "Leopaul Williams", "Owner", "lwilliams@realtymedia360.com", "239-900-7772", "Personal email to Leopaul", "Current site explicitly says media is delivered through Aryeo", "Young owner-led company advertising broad Florida coverage, bundles and next-day delivery", "You are covering a very wide Florida footprint while promising next-day delivery. How are travel, availability, and rush exceptions checked before an Aryeo appointment is confirmed?", "Aryeo booking preflight for coverage, travel fees, availability, and turnaround risk", "https://realtymedia360.com/", "https://realtymedia360.com/about/", "https://realtymedia360.com/", 0, 2, 2, 2],
  ["Summit Media", "Salt Lake, Summit, Utah, Wasatch counties", "Michael and Sidney Marino", "Co-founders", "michael@summit.media", "435-901-3228", "Personal email to Sidney/Michael; mention preserving in-house quality", "Current site identifies Summit as Aryeo Pro / Showcase Select", "Two-founder, in-house operation delivering photo, video, aerial and social content", "You keep production in-house for consistency. Which client-brief or deliverable detail is easiest to miss when several formats are ordered together?", "Aryeo-to-production brief plus deliverable checklist", "https://www.summit.media/", "https://www.summit.media/about", "https://www.summit.media/", 0, 1, 2, 2],
  ["Steve Njavro Media", "Phoenix, AZ", "Steve Njavro", "Owner", "steve@stevenjavro.com", "602-850-1321", "Personal email to Steve", "Current site explicitly promotes an Aryeo-powered portal", "Owner-led, broad service bundle and agent portal", "Your Aryeo portal organizes delivery well; I am curious what still happens outside it—editing follow-up, client reminders, or package QA?", "One outside-Aryeo handoff automation", "https://www.stevenjavromedia.com/", "https://www.stevenjavromedia.com/", "https://www.stevenjavromedia.com/", 0, 1, 2, 2],
  ["Haven Creatives", "Calgary, Alberta", "James Bottomley", "Owner", "", "", "LinkedIn or Instagram DM; reference the June 2026 Spiro episode", "Recent Spiro podcast guest/ecosystem signal; current use not confirmed", "Growing luxury real-estate video agency with complex creative production", "Your Spiro conversation focused on purposeful video. What part of turning the agent's goal into a repeatable production brief still depends entirely on you?", "Agent-goal intake to structured production brief and review checklist", "https://www.instagram.com/haven.creatives/", "https://ca.linkedin.com/in/james-bottomley-137218242", "https://spiromedia.podbean.com/", 0, 2, 2, 1],
];

const workbook = Workbook.create();
const leadsSheet = workbook.worksheets.add("Priority Leads");
const templates = workbook.worksheets.add("Outreach Playbook");
const qualification = workbook.worksheets.add("Qualification");

leadsSheet.showGridLines = false;
templates.showGridLines = false;
qualification.showGridLines = false;

// --- Priority Leads ---
leadsSheet.getRange("A1:X1").merge();
leadsSheet.getRange("A1").values = [["DaVeenci — Real Estate Media Prospect Research"]];
leadsSheet.getRange("A2:X2").merge();
leadsSheet.getRange("A2").values = [["Researched 2026-07-13 · Public business contact information only · Verify the named person's current role and software before sending"]];

leadsSheet.getRange("A4:B4").merge();
leadsSheet.getRange("A4").values = [["Warm prospects"]];
leadsSheet.getRange("C4:D4").merge();
leadsSheet.getRange("C4").values = [["Platform-linked prospects"]];
leadsSheet.getRange("E4:F4").merge();
leadsSheet.getRange("E4").values = [["Total researched"]];
leadsSheet.getRange("G4:H4").merge();
leadsSheet.getRange("G4").values = [["Start this week"]];
leadsSheet.getRange("A5:B5").merge();
leadsSheet.getRange("C5:D5").merge();
leadsSheet.getRange("E5:F5").merge();
leadsSheet.getRange("G5:H5").merge();
leadsSheet.getRange("A5").formulas = [["=COUNTIF(U7:U26,3)"]];
leadsSheet.getRange("C5").formulas = [["=COUNTIF(W7:W26,\">0\")"]];
leadsSheet.getRange("E5").formulas = [["=COUNTA(C7:C26)"]];
leadsSheet.getRange("G5").values = [[6]];

const headers = ["Priority", "Fit Score", "Company", "Region", "Best Contact", "Role", "Public Email", "Phone", "Best Channel", "Platform Evidence", "Growth / Complexity Evidence", "Personalized Opening", "Best $500 Pilot", "Website", "Contact Source", "Platform / Evidence Source", "Status", "Last Contact", "Next Follow-up", "Notes", "Warmth", "Ops Complexity", "Platform", "Access"];
leadsSheet.getRange("A6:X6").values = [headers];

const rows = leads.map((lead) => {
  const [company, region, contact, role, email, phone, channel, platform, complexity, opening, pilot, website, contactSource, evidenceSource, warmth, ops, platformScore, access] = lead;
  return [null, null, company, region, contact, role, email, phone, channel, platform, complexity, opening, pilot, website, contactSource, evidenceSource, "Not contacted", null, null, "", warmth, ops, platformScore, access];
});
leadsSheet.getRange(`A7:X${6 + rows.length}`).values = rows;
leadsSheet.getRange("B7").formulas = [["=SUM(U7:X7)"]];
leadsSheet.getRange(`B7:B${6 + rows.length}`).fillDown();
leadsSheet.getRange("A7").formulas = [["=IF(U7=3,\"WARM\",IF(B7>=7,\"A\",IF(B7>=5,\"B\",\"C\")))"]];
leadsSheet.getRange(`A7:A${6 + rows.length}`).fillDown();

leadsSheet.getRange("Q7:Q200").dataValidation = { rule: { type: "list", values: ["Not contacted", "Researching", "Sent", "Follow-up", "Replied", "Call booked", "Qualified", "Not now", "Closed"] } };
leadsSheet.getRange("R7:S200").format.numberFormat = "yyyy-mm-dd";
leadsSheet.freezePanes.freezeRows(6);
leadsSheet.freezePanes.freezeColumns(3);

const titleStyle = { fill: "#172A3A", font: { name: "Aptos Display", size: 20, bold: true, color: "#FFFFFF" }, verticalAlignment: "center" };
leadsSheet.getRange("A1:X1").format = titleStyle;
leadsSheet.getRange("A1:X1").format.rowHeight = 34;
leadsSheet.getRange("A2:X2").format = { fill: "#DDE7EE", font: { name: "Aptos", size: 10, italic: true, color: "#334155" }, verticalAlignment: "center" };
leadsSheet.getRange("A2:X2").format.rowHeight = 26;
leadsSheet.getRange("A4:H4").format = { fill: "#EAF2F0", font: { bold: true, color: "#245B50" }, horizontalAlignment: "center" };
leadsSheet.getRange("A5:H5").format = { fill: "#F7FAF9", font: { bold: true, size: 16, color: "#172A3A" }, horizontalAlignment: "center", borders: { preset: "outside", style: "thin", color: "#B8C8C3" } };
leadsSheet.getRange("A6:X6").format = { fill: "#245B50", font: { bold: true, color: "#FFFFFF", size: 10 }, wrapText: true, verticalAlignment: "center", borders: { bottom: { style: "medium", color: "#183F37" } } };
leadsSheet.getRange("A6:X6").format.rowHeight = 34;
leadsSheet.getRange(`A7:X${6 + rows.length}`).format = { font: { name: "Aptos", size: 9, color: "#1F2937" }, verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E2E8F0" } } };
leadsSheet.getRange(`A7:B${6 + rows.length}`).format.horizontalAlignment = "center";
leadsSheet.getRange(`B7:B${6 + rows.length}`).format.numberFormat = "0";
leadsSheet.getRange(`U7:X${6 + rows.length}`).format = { fill: "#F1F5F9", font: { color: "#475569", size: 9 }, horizontalAlignment: "center" };
leadsSheet.getRange(`A7:A${6 + rows.length}`).conditionalFormats.add("containsText", { text: "WARM", format: { fill: "#DDF4E7", font: { bold: true, color: "#17663A" } } });
leadsSheet.getRange(`A7:A${6 + rows.length}`).conditionalFormats.add("containsText", { text: "A", format: { fill: "#DCEBFA", font: { bold: true, color: "#174E7A" } } });
leadsSheet.getRange(`A7:A${6 + rows.length}`).conditionalFormats.add("containsText", { text: "B", format: { fill: "#FFF1CC", font: { bold: true, color: "#805B00" } } });
leadsSheet.getRange(`Q7:Q${6 + rows.length}`).conditionalFormats.add("containsText", { text: "Call booked", format: { fill: "#DDF4E7", font: { bold: true, color: "#17663A" } } });
leadsSheet.getRange(`Q7:Q${6 + rows.length}`).conditionalFormats.add("containsText", { text: "Replied", format: { fill: "#E6F0FF", font: { bold: true, color: "#174E7A" } } });

const widths = { A: 10, B: 9, C: 23, D: 24, E: 24, F: 27, G: 28, H: 15, I: 29, J: 36, K: 42, L: 52, M: 42, N: 30, O: 34, P: 38, Q: 16, R: 14, S: 14, T: 30, U: 9, V: 13, W: 10, X: 9 };
for (const [col, width] of Object.entries(widths)) leadsSheet.getRange(`${col}:${col}`).format.columnWidth = width;
leadsSheet.getRange(`7:${6 + rows.length}`).format.rowHeight = 72;
leadsSheet.tables.add(`A6:X${6 + rows.length}`, true, "ProspectTable").style = "TableStyleMedium2";

// --- Outreach playbook ---
templates.getRange("A1:H1").merge();
templates.getRange("A1").values = [["DaVeenci Outreach Playbook"]];
templates.getRange("A2:H2").merge();
templates.getRange("A2").values = [["Low-volume, research-led outreach for one-workflow pilots"]];
templates.getRange("A4:B4").values = [["Sequence", "Action"]];
templates.getRange("A5:B9").values = [
  ["Day 0", "Send a 90–130 word email built around one observed operational signal."],
  ["Day 2", "View/connect on LinkedIn or engage with one relevant company post. Do not pitch again."],
  ["Day 4", "Short follow-up: ask whether the named workflow is owned by them or someone else."],
  ["Day 9", "Send one concrete pilot idea in three bullets. No deck."],
  ["Day 16", "Close the loop politely and invite them to reply when the issue becomes timely."],
];

templates.getRange("A11:H11").merge();
templates.getRange("A11").values = [["Warm reactivation — F8 / Archi-Pix"]];
templates.getRange("A12:H16").merge();
templates.getRange("A12").values = [["Subject: One workflow question after our last project\n\nHi [Name] — working on [specific past project] gave me a much clearer view of how real-estate media operations work behind the scenes. I’m narrowing DaVeenci around removing one manual handoff at a time for teams using Aryeo, Spiro, and the tools around them.\n\nAfter an order enters your system, which step still requires someone to copy information, check multiple tools, or fix exceptions manually?\n\nIf there is one recurring issue, I can map it and propose a small fixed-scope pilot. No platform replacement and no long engagement.\n\n— Anton"]];

templates.getRange("A18:H18").merge();
templates.getRange("A18").values = [["Cold email — operations-led"]];
templates.getRange("A19:H24").merge();
templates.getRange("A19").values = [["Subject: A question about [specific operational signal]\n\nHi [First name] — I noticed that [Company] [specific evidence: expanded markets / runs 20+ staff / guarantees next-day delivery].\n\nDaVeenci builds small workflow automations for real-estate media teams. We do not replace Aryeo, Spiro, or your current portal; we remove one manual handoff around it.\n\nMy guess is that [personalized hypothesis from the lead sheet]. Is that close, or is a different step creating more follow-up?\n\nIf useful, I can map the workflow in 20 minutes and outline a $500 fixed-scope pilot. If there is no clear win, I’ll simply send you the map.\n\n— Anton"]];

templates.getRange("A26:H26").merge();
templates.getRange("A26").values = [["Follow-up #1 — route to the right person"]];
templates.getRange("A27:H29").merge();
templates.getRange("A27").values = [["Hi [First name] — quick follow-up. Is [workflow] something you own, or would operations/production be the better person to ask? I’m trying to understand whether the exception is frequent enough to justify a small pilot."]];

templates.getRange("A31:H31").merge();
templates.getRange("A31").values = [["20-minute discovery call"]];
templates.getRange("A32:B38").values = [
  ["Minute 0–3", "Choose one workflow only."],
  ["Minute 3–7", "Walk from trigger to completed delivery."],
  ["Minute 7–11", "Identify re-entry, waiting, checks, and exceptions."],
  ["Minute 11–14", "Quantify frequency and consequence."],
  ["Minute 14–17", "Confirm systems, access, and manual fallback."],
  ["Minute 17–20", "Agree on pilot outcome—or explicitly decide there is no project."],
  ["After", "Send a one-page scope within 24 hours."],
];

templates.getRange("A40:H40").merge();
templates.getRange("A40").values = [["Guardrails for the $500 pilot"]];
templates.getRange("A41:B47").values = [
  ["Scope", "One workflow, one owner, one measurable completion condition."],
  ["Duration", "Up to three weeks; do not promise a new CRM or scheduling platform."],
  ["Includes", "Mapping, one automation, logging, manual fallback, documentation, one fix week."],
  ["Excludes", "Full platform rebuild, data migration, mobile app, multi-department transformation."],
  ["Success", "The handoff completes correctly and exceptions become visible."],
  ["Proof", "Before/after workflow plus a short client statement, with permission."],
  ["Next step", "Price future implementations separately after the pilot proves value."],
];

templates.getRange("A1:H1").format = titleStyle;
templates.getRange("A1:H1").format.rowHeight = 34;
templates.getRange("A2:H2").format = { fill: "#DDE7EE", font: { italic: true, color: "#334155" } };
for (const row of [4, 11, 18, 26, 31, 40]) {
  templates.getRange(`A${row}:H${row}`).format = { fill: "#245B50", font: { bold: true, color: "#FFFFFF", size: 11 }, verticalAlignment: "center" };
  templates.getRange(`A${row}:H${row}`).format.rowHeight = 26;
}
templates.getRange("A4:B9").format.wrapText = true;
templates.getRange("A32:B38").format.wrapText = true;
templates.getRange("A41:B47").format.wrapText = true;
templates.getRange("A12:H16").format = { fill: "#F7FAF9", font: { size: 10, color: "#1F2937" }, wrapText: true, verticalAlignment: "top", borders: { preset: "outside", style: "thin", color: "#B8C8C3" } };
templates.getRange("A19:H24").format = { fill: "#F7FAF9", font: { size: 10, color: "#1F2937" }, wrapText: true, verticalAlignment: "top", borders: { preset: "outside", style: "thin", color: "#B8C8C3" } };
templates.getRange("A27:H29").format = { fill: "#F7FAF9", font: { size: 10, color: "#1F2937" }, wrapText: true, verticalAlignment: "top", borders: { preset: "outside", style: "thin", color: "#B8C8C3" } };
templates.getRange("A4:B47").format.borders = { insideHorizontal: { style: "thin", color: "#E2E8F0" } };
templates.getRange("A:A").format.columnWidth = 21;
templates.getRange("B:B").format.columnWidth = 74;
templates.getRange("C:H").format.columnWidth = 14;
templates.getRange("12:16").format.rowHeight = 28;
templates.getRange("19:24").format.rowHeight = 28;
templates.getRange("27:29").format.rowHeight = 26;
templates.freezePanes.freezeRows(2);

// --- Qualification ---
qualification.getRange("A1:F1").merge();
qualification.getRange("A1").values = [["Qualification Rules"]];
qualification.getRange("A2:F2").merge();
qualification.getRange("A2").values = [["Protect DaVeenci's time: one well-qualified client is better than twenty generic conversations"]];
qualification.getRange("A4:C4").values = [["Signal", "Good Fit", "Disqualifier"]];
qualification.getRange("A5:C11").values = [
  ["Team", "3–20 shooters/admins, or clear contractor growth", "Solo shooter with a few jobs per month"],
  ["Volume", "Repeated orders and deadline pressure", "Problem occurs only a few times per year"],
  ["Stack", "Aryeo, Spiro, HDPhotoHub or portal plus surrounding tools", "Asks DaVeenci to replace the entire platform"],
  ["Problem", "One manual handoff can be described end-to-end", "General request to 'add AI'"],
  ["Buyer", "Owner or operations/production leader participates", "No process owner or decision-maker"],
  ["Access", "Can provide sandbox, API, export, or safe test data", "No safe way to test or verify"],
  ["Pilot", "Success is observable within three weeks", "Outcome depends on a long company-wide rollout"],
];
qualification.getRange("A13:F13").merge();
qualification.getRange("A13").values = [["Discovery questions"]];
qualification.getRange("A14:B22").values = [
  ["1", "What starts the workflow?"],
  ["2", "Which information is entered or copied more than once?"],
  ["3", "What does someone check every morning?"],
  ["4", "Which exception gets escalated to the owner?"],
  ["5", "How many times per week does that happen?"],
  ["6", "What happens when the step is missed or late?"],
  ["7", "Which system is the source of truth?"],
  ["8", "What access or exports are available?"],
  ["9", "What would prove the pilot worked?"],
];
qualification.getRange("A24:F24").merge();
qualification.getRange("A24").values = [["Scoring used in Priority Leads"]];
qualification.getRange("A25:C29").values = [
  ["Dimension", "Range", "Meaning"],
  ["Warmth", "0–3", "3 = prior DaVeenci relationship"],
  ["Operations complexity", "0–3", "Markets, staff, volume, delivery promise, service breadth"],
  ["Platform evidence", "0–2", "2 = current public evidence or strong ecosystem signal; verify before outreach"],
  ["Decision-maker access", "0–2", "Named buyer plus public business channel"],
];

qualification.getRange("A1:F1").format = titleStyle;
qualification.getRange("A1:F1").format.rowHeight = 34;
qualification.getRange("A2:F2").format = { fill: "#DDE7EE", font: { italic: true, color: "#334155" } };
qualification.getRange("A4:C4").format = { fill: "#245B50", font: { bold: true, color: "#FFFFFF" } };
qualification.getRange("A13:F13").format = { fill: "#245B50", font: { bold: true, color: "#FFFFFF" } };
qualification.getRange("A24:F24").format = { fill: "#245B50", font: { bold: true, color: "#FFFFFF" } };
qualification.getRange("A25:C25").format = { fill: "#EAF2F0", font: { bold: true, color: "#245B50" } };
qualification.getRange("A5:C11").format = { wrapText: true, verticalAlignment: "top", borders: { insideHorizontal: { style: "thin", color: "#E2E8F0" } } };
qualification.getRange("A14:B22").format = { wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E2E8F0" } } };
qualification.getRange("A25:C29").format = { wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E2E8F0" } } };
qualification.getRange("A:A").format.columnWidth = 24;
qualification.getRange("B:B").format.columnWidth = 58;
qualification.getRange("C:C").format.columnWidth = 52;
qualification.getRange("D:F").format.columnWidth = 14;
qualification.getRange("5:11").format.rowHeight = 40;
qualification.freezePanes.freezeRows(4);

const check = await workbook.inspect({ kind: "table", range: "Priority Leads!A1:X12", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 24 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
console.log(errors.ndjson);

for (const [sheetName, range, fileName] of [
  ["Priority Leads", "A1:P16", "preview_leads.png"],
  ["Outreach Playbook", "A1:H47", "preview_playbook.png"],
  ["Qualification", "A1:F29", "preview_qualification.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}${fileName}`, new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}daveenci_real_estate_media_prospects.xlsx`);
console.log(`${outputDir}daveenci_real_estate_media_prospects.xlsx`);
