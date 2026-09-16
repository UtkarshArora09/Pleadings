import { CaseFile } from '@/types/case';

export interface HomepageRowConfig {
  id: string;
  title: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  filter: (cases: CaseFile[]) => CaseFile[];
  minThreshold?: number; // Defaults to 8 for category rows
  alwaysRender?: boolean; // For "Start Here" and "Latest"
}

export const HOMEPAGE_ROWS: HomepageRowConfig[] = [
  {
    id: 'start-here',
    title: {
      en: 'Start Here · Essential Precedents',
      hi: 'शुरुआत यहाँ से करें · अनिवार्य ऐतिहासिक फैसले'
    },
    subtitle: {
      en: 'Curated landmark rulings that reshaped Indian constitutional and criminal jurisprudence',
      hi: 'भारतीय न्यायशास्त्र को नई दिशा देने वाले शीर्ष ऐतिहासिक फैसले'
    },
    filter: (cases) => cases.filter((c) => c.featured).slice(0, 5),
    alwaysRender: true
  },
  {
    id: 'latest',
    title: {
      en: 'Latest Case Dossiers',
      hi: 'नवीनतम अदालती वाद'
    },
    subtitle: {
      en: 'Recently analyzed judgments with paragraph-verified legal breakdowns',
      hi: 'प्रमाणित फैसलों के साथ हाल ही में जोड़े गए नए मामले'
    },
    filter: (cases) =>
      [...cases]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 5),
    alwaysRender: true
  },
  // Dynamic Category Rows (Config-driven, enforced by minThreshold rule >= 8)
  {
    id: 'crime-forensics',
    title: {
      en: 'Crime Scene & Forensic Case Files',
      hi: 'अपराध व फोरेंसिक केस फाइलें'
    },
    subtitle: {
      en: 'Homicide, mens rea, and circumstantial evidence',
      hi: 'हत्या, आपराधिक मंशा और परिस्थितिजन्य साक्ष्य'
    },
    filter: (cases) => cases.filter((c) => c.categories.includes('crime')),
    minThreshold: 8
  },
  {
    id: 'constitutional-benches',
    title: {
      en: 'Supreme Court Constitutional Benches',
      hi: 'सुप्रीम कोर्ट संविधान पीठ'
    },
    subtitle: {
      en: 'Fundamental rights, basic structure, and executive overreach',
      hi: 'मौलिक अधिकार, मूल ढांचा और संवैधानिक समीक्षा'
    },
    filter: (cases) => cases.filter((c) => c.categories.includes('constitutional') || c.categories.includes('cyber')),
    minThreshold: 8
  }
];

export function getVisibleHomepageRows(allCases: CaseFile[]): {
  row: HomepageRowConfig;
  cases: CaseFile[];
}[] {
  const visible: { row: HomepageRowConfig; cases: CaseFile[] }[] = [];

  for (const row of HOMEPAGE_ROWS) {
    const matchingCases = row.filter(allCases);
    const threshold = row.minThreshold ?? 8;

    // Rule: Always render if alwaysRender is true; otherwise only render if count >= threshold
    if (row.alwaysRender) {
      if (matchingCases.length > 0) {
        visible.push({ row, cases: matchingCases });
      }
    } else if (matchingCases.length >= threshold) {
      visible.push({ row, cases: matchingCases });
    }
  }

  return visible;
}
