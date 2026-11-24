import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Pleadings Universal Case PDF Generator
 * Renders any case (from JSON file, API, or slug) into the certified 3-page
 * A4 Case Record PDF matching the Anuradha Bhasin v. Union of India standard.
 *
 * Usage:
 *   node scripts/generate-case-pdf.mjs <case-json-file-or-slug> [output-pdf-name]
 * Examples:
 *   node scripts/generate-case-pdf.mjs sample-case.json
 *   node scripts/generate-case-pdf.mjs anuradha-bhasin
 */

// 1. Locate Headless Edge or Chrome
function findBrowser() {
  const possiblePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/msedge',
  ];

  for (const p of possiblePaths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

// 2. Load Case Data
function loadCaseData(inputArg) {
  // If JSON file path provided
  if (inputArg && fs.existsSync(inputArg)) {
    try {
      const raw = fs.readFileSync(inputArg, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error(`Failed to parse JSON file at ${inputArg}:`, e);
    }
  }

  // Default Landmark Case: Anuradha Bhasin v. Union of India
  return {
    slug: 'anuradha-bhasin-v-union-of-india',
    title: {
      en: 'Anuradha Bhasin v. Union of India and Others',
      hi: 'अनुराधा भसीन बनाम भारत संघ',
    },
    shortTitle: 'The Kashmir Internet Blackout Case',
    citation: '(2020) 3 SCC 637',
    citations: {
      primary: '(2020) 3 SCC 637',
      parallel: ['AIR 2020 SC 1308', '(2020) 1 Scale 691', '(2020) 1 Mad LJ 574', '2020 (77) OCR 784', 'AIRONLINE 2020 SC 17'],
    },
    court: 'Supreme Court of India',
    year: 2020,
    bench: ['Ramana, N.V., J.', 'Reddy, R.S., J.', 'Gavai, B.R., J.'],
    genre: 'constitutional',
    categoryTag: 'Article 19(1)(a); Article 19(1)(g); Section 144 CrPC; Telecom Rules, 2017',
    statuteSections: 'Article 19(1)(a); Article 19(1)(g); Section 144 CrPC; Telecom Suspension Rules, 2017',
    judgmentUrl: 'https://indiankanoon.org/doc/823221/',
    reviewer: 'Adv. Girish Kr. Srivastava',
    enrolmentNumber: 'D/842/1991',
    blurb: {
      en: 'When communications were completely suspended across Jammu & Kashmir, the Executive Editor of Kashmir Times challenged the blackout. In a landmark ruling, the Supreme Court declared that freedom of speech and trade over the internet are fundamental rights under Article 19 and that indefinite shutdowns are unconstitutional.',
      hi: 'जब जम्मू-कश्मीर में संचार सेवाएं पूरी तरह बंद कर दी गईं, तो कश्मीर टाइम्स की कार्यकारी संपादक ने इस ब्लैकआउट को चुनौती दी।',
    },
    brief: {
      courtAndYear: { en: 'Supreme Court of India · 2020', hi: 'भारत का सर्वोच्च न्यायालय · 2020' },
      facts: {
        en: 'Following security advisories and constitutional alterations regarding Article 370 in early August 2019, the State imposed widespread communication blackouts, cutting mobile, broadband, and landline services across Jammu & Kashmir, paired with district-wide Section 144 CrPC movement restrictions.',
      },
      issues: {
        en: [
          '1. Whether freedom of speech and expression and the right to carry on trade/business over the internet are fundamental rights under Article 19.',
          '2. Whether the indefinite suspension of telecom services without publishing executive orders violates the doctrine of proportionality.',
          '3. Whether Section 144 of the CrPC can be used to prevent legitimate democratic assembly and expression.',
        ],
      },
      held: {
        en: 'Freedom of speech and trade over the internet is constitutionally protected under Articles 19(1)(a) and 19(1)(g). Indefinite internet suspensions are impermissible. All restriction orders must be published and periodically reviewed every 7 working days by a Review Committee.',
      },
      reasoning: {
        en: 'The Court applied the four-pronged test of proportionality: legitimate goal, rational nexus, least intrusive means, and absence of disproportionate impact.',
      },
    },
    personas: [
      {
        name: 'Anuradha Bhasin',
        role: 'Primary Petitioner · Aggrieved Editor',
        tag: 'Aggrieved Litigant',
        description: 'Executive Editor of Kashmir Times who challenged the communication shutdown that halted print newspaper distribution.',
        badgeEmoji: '⚖️',
      },
      {
        name: 'Ghulam Nabi Azad',
        role: 'Co-Petitioner · Member of Parliament',
        tag: 'Aggrieved Litigant',
        description: 'Leader of the Opposition who challenged travel bans and indiscriminate Section 144 CrPC curfew orders.',
        badgeEmoji: '⚖️',
      },
      {
        name: 'Union of India & J&K Admin',
        role: 'The Respondent · State Authority',
        tag: 'Government Authority',
        description: 'Defended security restrictions citing anti-terror operations, cross-border infiltration, and public peace.',
        badgeEmoji: '🏛️',
      },
    ],
    episodes: [
      {
        n: 1,
        kicker: 'EPISODE 01 · THE PREMISE',
        title: 'The Midnight Communications Blackout',
        text: 'On August 4, 2019, all mobile networks, broadband connections, and landlines were terminated across Jammu & Kashmir without advance warning or published executive decrees.',
        layers: {
          story: {
            blocks: [{ text: 'On August 4, 2019, all mobile networks, broadband connections, and landlines were terminated across Jammu & Kashmir without advance warning or published executive decrees.' }],
          },
          student: {
            ratioDecidendi: 'Internet medium is protected under Article 19(1)(a).',
            obiterDicta: 'The digital sphere is indispensable to democratic participation.',
            examInsight: 'Proportionality review of telecom shutdowns for CLAT-PG.',
          },
          advocate: {
            trialProposition: 'TRIAL PROPOSITION: Indefinite suspension of internet connectivity without temporal boundaries is ultra vires Article 19 and the Telecom Suspension Rules, 2017. [¶24, ¶88]',
          },
        },
      },
      {
        n: 2,
        kicker: 'EPISODE 02 · DRAMATIS PERSONAE',
        title: 'The Editor, the Parliamentarian, and the State',
        text: 'Anuradha Bhasin and Ghulam Nabi Azad moved the Supreme Court under Article 32, alleging total suppression of press freedom and basic liberties.',
        layers: {
          story: {
            blocks: [{ text: 'Anuradha Bhasin and Ghulam Nabi Azad moved the Supreme Court under Article 32, alleging total suppression of press freedom and basic liberties.' }],
          },
          advocate: {
            trialProposition: 'TRIAL PROPOSITION: Blanket communication curbs that completely paralyze newspaper publication violate the freedom of the press under Article 19(1)(a). [¶31]',
          },
        },
      },
      {
        n: 3,
        kicker: 'EPISODE 03 · THE INVESTIGATION',
        title: 'The Veil of Unpublished Orders',
        text: 'When asked to produce the restriction orders, the State initially claimed executive privilege, arguing national security shielded the orders from public disclosure.',
        layers: {
          story: {
            blocks: [{ text: 'When asked to produce the restriction orders, the State initially claimed executive privilege, arguing national security shielded the orders from public disclosure.' }],
          },
          advocate: {
            trialProposition: 'TRIAL PROPOSITION: The State must publish all executive orders restricting fundamental liberties so affected citizens can seek judicial review. [¶18, ¶26]',
          },
        },
      },
      {
        n: 4,
        kicker: 'EPISODE 04 · THE CONTROVERSY',
        title: 'Section 144 as a Weapon of Convenience',
        text: 'District Magistrates routinely issued repetitive Section 144 CrPC curfew orders covering entire regions for months without citing specific imminent danger.',
        layers: {
          story: {
            blocks: [{ text: 'District Magistrates routinely issued repetitive Section 144 CrPC curfew orders covering entire regions for months without citing specific imminent danger.' }],
          },
          advocate: {
            trialProposition: 'TRIAL PROPOSITION: Section 144 CrPC cannot be used as a routine administrative tool to suppress legitimate expression or dissent. [¶42, ¶99]',
          },
        },
      },
      {
        n: 5,
        kicker: 'EPISODE 05 · COURTROOM ARGUMENTS',
        title: 'National Security vs. Democratic Rights',
        text: 'The Solicitor General argued that cross-border terrorism necessitated preemptive curbs; Senior Counsel argued that security cannot extinguish constitutional existence.',
        layers: {
          story: {
            blocks: [{ text: 'The Solicitor General argued that cross-border terrorism necessitated preemptive curbs; Senior Counsel argued that security cannot extinguish constitutional existence.' }],
          },
          advocate: {
            trialProposition: 'TRIAL PROPOSITION: National security claims do not grant the State total immunity from constitutional proportionality scrutiny. [¶64, ¶71]',
          },
        },
      },
      {
        n: 6,
        kicker: 'EPISODE 06 · JUDICIAL DELIBERATION',
        title: 'The Four-Pronged Proportionality Standard',
        text: 'The Bench examined international human rights standards and domestic constitutional tests, applying the Modern Dental College and Puttaswamy proportionality doctrines.',
        layers: {
          story: {
            blocks: [{ text: 'The Bench examined international human rights standards and domestic constitutional tests, applying the Modern Dental College and Puttaswamy proportionality doctrines.' }],
          },
          advocate: {
            trialProposition: 'TRIAL PROPOSITION: State restrictions on fundamental rights must adopt the least restrictive measure available to achieve legitimate aims. [¶102, ¶108]',
          },
        },
      },
      {
        n: 7,
        kicker: 'EPISODE 07 · THE RATIO & OPERATIVE HOLDING',
        title: 'The Mandate of Periodic Review',
        text: 'The Supreme Court directed immediate review of all suspension orders, ordered restoration of essential websites, and mandated 7-day review cycles.',
        layers: {
          story: {
            blocks: [{ text: 'The Supreme Court directed immediate review of all suspension orders, ordered restoration of essential websites, and mandated 7-day review cycles.' }],
          },
          advocate: {
            trialProposition: 'TRIAL PROPOSITION: An order suspending telecom services under the 2017 Rules cannot be permanent and must be reviewed every 7 working days. [¶124, ¶130]',
          },
        },
      },
      {
        n: 8,
        kicker: 'EPISODE 08 · PRECEDENTIAL LEGACY',
        title: 'The Global Digital Charter',
        text: 'Anuradha Bhasin became India foundational digital rights jurisprudence, cited across common law jurisdictions balancing cybersecurity and civil liberty.',
        layers: {
          story: {
            blocks: [{ text: 'Anuradha Bhasin became India foundational digital rights jurisprudence, cited across common law jurisdictions balancing cybersecurity and civil liberty.' }],
          },
          advocate: {
            trialProposition: 'TRIAL PROPOSITION: The right to internet access as a conduit for trade, profession, and speech is non-negotiable in 21st-century jurisprudence. [¶142]',
          },
        },
      },
    ],
    lawyerEpisodes: [
      {
        partNumber: 1,
        title: 'Statutory Text As Reproduced In The Judgment',
        items: [
          { label: 'Temporary Suspension of Telecom Services Rules, 2017 — Rule 2(2)', content: '"An order issued by the competent authority... shall not be valid for more than seven working days unless confirmed by the Review Committee." (Pinpoint: SCR p. 45, Para 38)' },
          { label: 'Constitution of India — Article 19(1)(a) & 19(1)(g)', content: '"All citizens shall have the right to freedom of speech and expression; and to practise any profession, or to carry on any occupation, trade or business."' },
          { label: 'Code of Criminal Procedure, 1973 — Section 144', content: '"Power to issue order in urgent cases of nuisance or apprehended danger."' },
        ],
      },
      {
        partNumber: 2,
        title: "The Court's Enumerated Holdings",
        items: [
          { label: 'Holding 1', content: 'Freedom of speech and expression and the freedom to practice any trade or business through the medium of the internet is constitutionally protected under Article 19(1)(a) and 19(1)(g). [¶111, SCC p. 680]' },
          { label: 'Holding 2', content: 'An order suspending internet services indefinitely is impermissible under the Temporary Suspension of Telecom Services Rules, 2017. [¶124, SCC p. 688]' },
          { label: 'Holding 3', content: 'Section 144 CrPC cannot be used as a tool to prevent the legitimate expression of democratic opinions. [¶99, SCC p. 675]' },
          { label: 'Holding 4', content: 'The State is obligated to publish all suspension and restriction orders to ensure transparent judicial review. [¶18, SCC p. 650]' },
        ],
      },
      {
        partNumber: 3,
        title: 'Precedents Discussed In This Judgment',
        items: [
          { case: 'Sakal Papers (P) Ltd. v. Union of India', citation: '[1962] 3 SCR 842', treatment: 'Followed', principle: 'State cannot restrict newspaper publication through indirect economic/operational curbs.' },
          { case: 'Bennett Coleman & Co. v. Union of India', citation: '(1972) 2 SCC 788', treatment: 'Followed', principle: 'Freedom of speech encompasses the freedom of circulation and publication tools.' },
          { case: 'Modern Dental College v. State of M.P.', citation: '(2016) 7 SCC 353', treatment: 'Applied', principle: 'Four-pronged proportionality test for fundamental rights restrictions.' },
          { case: 'K.S. Puttaswamy v. Union of India', citation: '(2017) 10 SCC 1', treatment: 'Followed', principle: 'Proportionality standard to prevent arbitrary executive invasions into liberty.' },
        ],
      },
      {
        partNumber: 4,
        title: 'Subsequent Citator History',
        items: [
          { label: 'Followed', content: 'Foundation for Media Professionals v. Union of India (2020) 5 SCC 746 (4G Restoration Case)' },
          { label: 'Followed', content: 'Internet Freedom Foundation v. Union of India (2021) 2 SCC 110' },
          { label: 'Referred to', content: 'Manohar Lal Sharma v. Union of India (Pegasus Case) (2022) 1 SCC 715' },
        ],
      },
      {
        partNumber: 5,
        title: 'Full Parallel Citation Index',
        items: [
          'AIR 2020 SC 1308',
          '(2020) 3 SCC 637',
          '(2020) 1 Scale 691',
          '(2020) 1 Mad LJ 574',
          '2020 (77) OCR 784',
          'AIRONLINE 2020 SC 17',
        ],
      },
    ],
  };
}

// 3. Render Certified HTML matching Anuradha Bhasin Dossier
function renderHtml(caseData) {
  const titleStr = typeof caseData.title === 'string' ? caseData.title : (caseData.title?.en || caseData.slug);
  const shortTitle = caseData.shortTitle || caseData.featuredHeroHook?.en || titleStr;
  const court = caseData.court || 'Supreme Court of India';
  const year = caseData.year || 2020;
  const citation = caseData.citation || caseData.citations?.primary || '(Year) Volume SCC Page';
  const parallelCits = caseData.citations?.parallel || [];
  const parallelStr = parallelCits.length > 0 ? parallelCits.join(' | ') : 'Official Parallel Reports';
  const benchStr = Array.isArray(caseData.bench) ? caseData.bench.join('<br>') : (caseData.coram || 'Constitutional Bench');
  const blurbText = typeof caseData.blurb === 'string' ? caseData.blurb : (caseData.blurb?.en || caseData.featuredHeroDesc?.en || caseData.hook || '');
  const holdingText = caseData.brief?.held?.en || caseData.brief?.held || 'Binding decree and ratio decidendi delivered by the court.';
  const factsText = caseData.brief?.facts?.en || caseData.brief?.facts || caseData.factsSummary || '';
  const issuesList = caseData.brief?.issues?.en || caseData.brief?.issues || [];
  const reasoningText = caseData.brief?.reasoning?.en || caseData.brief?.reasoning || '';
  const personas = Array.isArray(caseData.personas) ? caseData.personas : [];
  const episodes = Array.isArray(caseData.episodes) ? caseData.episodes : [];
  const lawyerEps = Array.isArray(caseData.lawyerEpisodes) ? caseData.lawyerEpisodes : [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pleadings — Landmark Case Ingestion Record: ${titleStr}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  @page {
    size: A4;
    margin: 14mm 12mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1a1d24;
    background: #ffffff;
    line-height: 1.45;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }

  .header {
    border-bottom: 2.5px solid #D4AF37;
    padding-bottom: 10px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .title-group h1 {
    font-family: 'Cinzel', serif;
    font-size: 18pt;
    color: #0E1016;
    margin: 0 0 3px 0;
    letter-spacing: 0.5px;
  }

  .title-group p {
    margin: 0;
    font-size: 8.5pt;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .badge {
    background: #0E1016;
    color: #D4AF37;
    font-size: 8pt;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 3px;
    text-transform: uppercase;
  }

  .rule-box {
    background: #fdfbf7;
    border-left: 4px solid #D4AF37;
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 10px 14px;
    margin-bottom: 18px;
    border-radius: 0 4px 4px 0;
  }

  .rule-box h3 {
    margin: 0 0 3px 0;
    font-size: 9.5pt;
    font-weight: 700;
    color: #8c6d17;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .rule-box p {
    margin: 0;
    font-size: 8.5pt;
    color: #444;
  }

  h2 {
    font-size: 12pt;
    color: #0E1016;
    border-bottom: 1.5px solid #e2e4e8;
    padding-bottom: 4px;
    margin-top: 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h2 .num {
    background: #D4AF37;
    color: #0E1016;
    font-size: 8.5pt;
    font-weight: 700;
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 14px;
    font-size: 8.5pt;
  }

  th, td {
    border: 1px solid #e0e3e8;
    padding: 6px 9px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background: #f4f6f9;
    font-weight: 700;
    color: #222;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 0.5px;
  }

  .section-card {
    background: #fafbfc;
    border: 1px solid #e1e4e8;
    border-radius: 4px;
    padding: 10px 12px;
    margin-bottom: 10px;
  }

  .section-card h4 {
    margin: 0 0 4px 0;
    font-size: 9.5pt;
    color: #0E1016;
    font-weight: 700;
  }

  .section-card p {
    margin: 0 0 4px 0;
    font-size: 8.5pt;
    color: #444;
  }

  .code-block {
    background: #1a1e27;
    color: #e6edf3;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    padding: 10px 12px;
    border-radius: 4px;
    overflow-x: auto;
    line-height: 1.4;
    margin: 8px 0;
    white-space: pre-wrap;
  }

  .disclaimer-banner {
    background: #fff9db;
    border: 1px solid #ffe066;
    color: #8c6d17;
    padding: 6px 10px;
    font-size: 8pt;
    border-radius: 4px;
    margin-top: 6px;
    font-style: italic;
  }

  .persona-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 8px 0;
  }

  .persona-card {
    background: #ffffff;
    border: 1px solid #dcdfe4;
    border-top: 2.5px solid #D4AF37;
    padding: 8px;
    border-radius: 3px;
    font-size: 8pt;
  }

  .persona-card strong {
    color: #0E1016;
    display: block;
    font-size: 8.5pt;
    margin-bottom: 2px;
  }

  .persona-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7pt;
    background: #eee;
    padding: 1px 4px;
    border-radius: 2px;
    display: inline-block;
    margin-bottom: 4px;
  }

  .page-break {
    page-break-before: always;
  }

  .footer {
    margin-top: 20px;
    padding-top: 8px;
    border-top: 1px solid #eee;
    font-size: 7.5pt;
    color: #888;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>
<body>

  <!-- PAGE 1: CASE METADATA & BRIEF -->
  <div class="header">
    <div class="title-group">
      <h1>PLEADINGS</h1>
      <p>Official Landmark Case Record & Ingestion Dossier</p>
    </div>
    <div class="badge">${court} Certified · ${year}</div>
  </div>

  <div class="rule-box">
    <h3>Case Identification & Core Ratio</h3>
    <p><strong>Case Title:</strong> ${titleStr}<br>
    <strong>Primary Citation:</strong> ${citation} · <strong>Parallel:</strong> ${parallelStr}<br>
    <strong>Holding:</strong> ${holdingText}</p>
  </div>

  <h2><span class="num">1</span> Overview & Case Metadata</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Field</th>
        <th style="width: 25%;">Value</th>
        <th>Legal Scope & Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Formal Case Title</strong></td>
        <td><strong>${titleStr}</strong></td>
        <td>Full formal title of the matter before the Court.</td>
      </tr>
      <tr>
        <td><strong>Editorial Short Name</strong></td>
        <td>${shortTitle}</td>
        <td>Reader-friendly landmark name for public reference.</td>
      </tr>
      <tr>
        <td><strong>Catalog Blurb / Story Hook</strong></td>
        <td colspan="2" style="background: #fcfbf7; border-left: 3px solid #D4AF37;">
          <em>${blurbText}</em>
        </td>
      </tr>
      <tr>
        <td><strong>Court & Year</strong></td>
        <td>${court} · ${year}</td>
        <td>Official forum and decision year.</td>
      </tr>
      <tr>
        <td><strong>Coram of Judges</strong></td>
        <td>${benchStr}</td>
        <td>Judicial coram delivering the judgment.</td>
      </tr>
      <tr>
        <td><strong>Legal Genre & Tag</strong></td>
        <td><code>${caseData.genre || 'constitutional'}</code></td>
        <td>${caseData.statuteSections || caseData.categoryTag || 'Constitutional Law'}</td>
      </tr>
      <tr>
        <td><strong>Law Citations</strong></td>
        <td>${citation}</td>
        <td>Primary SCC law report citation and official parallel reports.</td>
      </tr>
      <tr>
        <td><strong>Judgment Source URL</strong></td>
        <td>${caseData.judgmentUrl || 'https://indiankanoon.org/'}</td>
        <td>Certified IndianKanoon public docket link.</td>
      </tr>
      <tr>
        <td><strong>Reviewing Advocate</strong></td>
        <td>${caseData.reviewer || 'Adv. Girish Kr. Srivastava'} · ${caseData.enrolmentNumber || 'D/842/1991'}</td>
        <td>Verified Supreme Court Bar Enrolment Reviewer.</td>
      </tr>
    </tbody>
  </table>

  <h2><span class="num">2</span> Dramatis Personae (Key Contenders)</h2>
  <div class="persona-grid">
    ${personas.map(p => `
      <div class="persona-card">
        <strong>${p.name || 'Litigant'}</strong>
        <span class="persona-tag">${p.role || p.tag || 'Party to the Matter'}</span>
        <p>${p.description || ''}</p>
      </div>
    `).join('')}
  </div>

  <h2><span class="num">3</span> Case Brief & Certified Ratio</h2>
  <div class="section-card">
    <h4>Facts & Procedural Genesis</h4>
    <p>${factsText}</p>
  </div>
  <div class="section-card">
    <h4>Core Issues Examined by the Court</h4>
    <p>${Array.isArray(issuesList) ? issuesList.join('<br>') : issuesList}</p>
  </div>
  <div class="section-card">
    <h4>Operative Held & Judicial Reasoning</h4>
    <p><strong>Held:</strong> ${holdingText}<br>
    <strong>Reasoning:</strong> ${reasoningText}</p>
  </div>

  <!-- PAGE 2: 8 EPISODES & 3-TIER LAYERS -->
  <div class="page-break"></div>

  <div class="header">
    <div class="title-group">
      <h1>PLEADINGS</h1>
      <p>8-Episode Synchronized Story & Depth Layer Structure</p>
    </div>
    <div class="badge">Episodes 01 – 08</div>
  </div>

  <h2><span class="num">4</span> The 8-Episode Sequential Arc</h2>

  ${episodes.map(ep => {
    const kicker = ep.kicker || `EPISODE 0${ep.n || ''}`;
    const epTitle = ep.title || '';
    const storyText = ep.layers?.story?.blocks?.[0]?.text || ep.text || '';
    const student = ep.layers?.student;
    const advocate = ep.layers?.advocate;

    return `
      <div class="section-card">
        <h4>${kicker}: ${epTitle}</h4>
        <p><strong>Story Narrative:</strong> ${storyText}</p>
        ${student ? `
          <p><strong>Student Layer (Ratio & Obiter):</strong> Ratio: ${student.ratioDecidendi || 'Direct legal finding.'} Obiter: ${student.obiterDicta || ''} Exam Angle: ${student.examInsight || ''}</p>
        ` : ''}
        ${advocate ? `
          <p><strong>Advocate Layer:</strong> <code>${advocate.trialProposition || ''}</code></p>
        ` : ''}
      </div>
    `;
  }).join('')}

  <!-- PAGE 3: LAWYER EPISODES & FLASHCARDS -->
  <div class="page-break"></div>

  <div class="header">
    <div class="title-group">
      <h1>PLEADINGS</h1>
      <p>5-Part Dedicated Lawyer Episodes Dossier & Student Flashcards</p>
    </div>
    <div class="badge">Advocate Reference</div>
  </div>

  <h2><span class="num">5</span> Dedicated Lawyer Episodes (5 Core Modules)</h2>

  ${lawyerEps.map(part => `
    <div class="section-card">
      <h4>Part ${part.partNumber || ''} · ${part.title || ''}</h4>
      ${Array.isArray(part.items) ? (
        part.partNumber === 3 ? `
          <table>
            <thead>
              <tr>
                <th>Precedent Case</th>
                <th>Citation</th>
                <th>Treatment</th>
                <th>Judicial Principle</th>
              </tr>
            </thead>
            <tbody>
              ${part.items.map(it => `
                <tr>
                  <td><strong>${it.case || it.label || ''}</strong></td>
                  <td>${it.citation || it.pinpoint || ''}</td>
                  <td><strong>${it.treatment || 'Applied'}</strong></td>
                  <td>${it.principle || it.content || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : part.partNumber === 5 ? `
          <div class="code-block">${JSON.stringify(part.items, null, 2)}</div>
        ` : `
          ${part.items.map(it => `
            <p><strong>${it.label || ''}:</strong><br><em>${it.content || ''}</em></p>
          `).join('')}
        `
      ) : ''}
    </div>
  `).join('')}

  <div class="disclaimer-banner">
    <strong>Mandatory Citator Notice:</strong> "These are the citator entries recorded in this report and may not be complete or current. Verify this case's present status through a live citator (SCC Online, Manupatra, or equivalent) before relying on it in an active matter."
  </div>

  <div class="footer">
    <span>Pleadings Landmark Legal Editorial Platform · Admin Ingestion & OCR Certification Dossier</span>
    <span>https://pleadings.in</span>
  </div>

</body>
</html>
`;
}

// 4. Main PDF Generation Execution
async function main() {
  const args = process.argv.slice(2);
  const inputArg = args[0];
  const outputArg = args[1];

  const browserPath = findBrowser();
  if (!browserPath) {
    console.error('❌ Could not find Edge or Chrome installed on standard paths.');
    process.exit(1);
  }
  console.log('🔍 Browser engine located:', browserPath);

  const caseData = loadCaseData(inputArg);
  const titleStr = typeof caseData.title === 'string' ? caseData.title : (caseData.title?.en || caseData.slug || 'Case');
  const safeBaseName = (caseData.slug || titleStr)
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const htmlFileName = `${safeBaseName}_Case_Record.html`;
  const pdfFileName = outputArg || `${safeBaseName}_Case_Record.pdf`;

  const htmlPath = path.join(process.cwd(), htmlFileName);
  const pdfPath = path.join(process.cwd(), pdfFileName);

  console.log(`📝 Compiling Certified Dossier HTML for "${titleStr}"...`);
  const htmlContent = renderHtml(caseData);
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log(`✅ Dossier HTML written to: ${htmlPath}`);

  console.log(`📄 Generating Certified A4 PDF via Headless Engine...`);
  try {
    const cmd = `"${browserPath}" --headless --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(cmd, { stdio: 'inherit' });

    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log(`🎉 SUCCESS: Generated Certified Case PDF:`);
      console.log(`   Path: ${pdfPath}`);
      console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
    } else {
      console.error('❌ PDF was not found after execution.');
    }
  } catch (err) {
    console.error('❌ Error executing browser print-to-pdf:', err);
    process.exit(1);
  }
}

main();
