import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  resolvePublishStatus,
  resolveLegalStatus,
  isCasePublished,
} from '../src/lib/db/caseStore';
import { shouldBypassImageOptimization } from '../src/lib/imageUtils';
import { deduplicateCaseImages } from '../src/components/case/CaseViewerHelpers';

describe('BUG-001 & SEC-008: Editorial vs Legal Status Separation', () => {
  it('keeps published OVERRULED / PARTLY_SUPERSEDED / STATUTE_REPLACED cases publicly visible', () => {
    const overruledPublished = {
      slug: 'suresh-kumar-koushal',
      publishStatus: 'PUBLISHED',
      status: {
        code: 'OVERRULED',
        explain: 'Overruled in Navtej Singh Johar (2018).',
        chain: [{ year: 2018, event: 'Overruled by 5-judge Constitution Bench' }],
      },
    };

    assert.equal(resolvePublishStatus(overruledPublished), 'PUBLISHED');
    assert.equal(isCasePublished(overruledPublished), true);
    assert.equal(resolveLegalStatus(overruledPublished, 2013).code, 'OVERRULED');

    const legacyStatuteReplaced = {
      slug: 'legacy-ipc-case',
      status: {
        code: 'STATUTE_REPLACED',
        explain: 'IPC replaced by BNS 2023.',
        chain: [],
      },
    };

    assert.equal(isCasePublished(legacyStatuteReplaced), true);
    assert.equal(resolveLegalStatus(legacyStatuteReplaced, 1960).code, 'STATUTE_REPLACED');
  });

  it('strictly hides DRAFT, ADMIN_REVIEW, and ARCHIVED cases without corrupting legalStatus to OVERRULED', () => {
    const draftCase = { slug: 'draft-case', status: 'DRAFT' };
    const reviewCase = { slug: 'review-case', publishStatus: 'ADMIN_REVIEW' };

    assert.equal(isCasePublished(draftCase), false);
    assert.equal(isCasePublished(reviewCase), false);
    assert.equal(resolveLegalStatus(draftCase, 2025).code, 'GOOD_LAW');
  });
});

describe('PERF-001: Next.js Image Optimization Allowlist', () => {
  it('enables Next.js image optimization for local assets and Supabase Storage URLs', () => {
    assert.equal(shouldBypassImageOptimization('/images/cases/shah-bano.jpg'), false);
    assert.equal(
      shouldBypassImageOptimization('https://voiwlmpqjugullytuixe.supabase.co/storage/v1/object/public/case-images/cases/a.jpg'),
      false
    );
  });

  it('bypasses optimization for data URIs, blob URLs, and non-allowlisted external hosts', () => {
    assert.equal(shouldBypassImageOptimization('data:image/jpeg;base64,abc'), true);
    assert.equal(shouldBypassImageOptimization('blob:https://pleadings.in/123'), true);
    assert.equal(shouldBypassImageOptimization('https://untrusted.example.com/pic.jpg'), true);
  });
});

describe('CaseViewer Image Deduplication', () => {
  it('prevents the hero poster image from rendering twice inside Episode 1 or exhibits', () => {
    const poster = 'https://voiwlmpqjugullytuixe.supabase.co/storage/v1/object/public/case-images/cases/hero.jpg';
    const ep2Img = 'https://voiwlmpqjugullytuixe.supabase.co/storage/v1/object/public/case-images/cases/exhibit.jpg';

    const result = deduplicateCaseImages(poster, [
      {
        n: 1,
        kicker: 'EP 1',
        title: 'Premise',
        image: { src: poster, alt: 'dup', provenance: 'illustration' },
        layers: { story: { blocks: [] }, student: { blocks: [] }, advocate: { blocks: [] } },
        endHook: '',
      },
      {
        n: 2,
        kicker: 'EP 2',
        title: 'Exhibit',
        image: { src: ep2Img, alt: 'ep2', provenance: 'archival' },
        exhibit: {
          kind: 'record',
          label: 'Exhibit',
          headline: 'Doc',
          body: 'Body',
          meta: '1985',
          image: { src: ep2Img, alt: 'exhibit', provenance: 'archival' },
        },
        layers: { story: { blocks: [] }, student: { blocks: [] }, advocate: { blocks: [] } },
        endHook: '',
      },
    ]);

    assert.equal(result.showEpisodeImage[0], false);
    assert.equal(result.cleanExhibits[1]?.image?.src, ep2Img);
    assert.equal(result.showEpisodeImage[1], false);
  });
});

describe('Content JSON Integrity (Glossary & Statute Map)', () => {
  it('loads valid glossary.json and statute-map.json datasets', () => {
    const glossary = JSON.parse(fs.readFileSync('content/glossary.json', 'utf8'));
    const statutes = JSON.parse(fs.readFileSync('content/statute-map.json', 'utf8'));

    assert.ok(Array.isArray(glossary) && glossary.length >= 16);
    assert.ok(Array.isArray(statutes) && statutes.length >= 18);
    for (const g of glossary) {
      assert.ok(typeof g.slug === 'string' && g.slug.length > 0);
      assert.ok(typeof g.plainMeaning?.en === 'string' && g.plainMeaning.en.length > 0);
      assert.ok(typeof g.plainMeaning?.hi === 'string' && g.plainMeaning.hi.length > 0);
    }
  });
});
