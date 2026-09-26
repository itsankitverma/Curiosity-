export interface ResearchSource {
  title: string;
  journal: string;
  year: number;
  doi: string;
  institution: string;
  authors: string;
  url?: string;
}

export interface CuriosityArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Space' | 'ISRO' | 'Earth' | 'Life' | 'Science';
  categoryIcon: string;
  date: string;
  readTime: string;
  heroImage: string;
  imageCredit: string;
  imageCaption: string;
  stats: { label: string; value: string }[];
  whatScientistsSaw: string;
  whyImportant: string;
  howTheyDidIt: string;
  whatAreWeLookingAt: string;
  interactiveType: 'black-hole' | 'sun-plasma' | 'isro-lunar' | 'isro-solar';
  interactiveData: Record<string, any>;
  theFascinatingPart: string;
  whyShouldICare: string; // The core signature feature
  originalResearch: ResearchSource;
  tags: string[];
  audioSummaryDuration?: string;
  audioTranscript?: string;
}

export interface DailyDiscoveryItem {
  number: string;
  category: string;
  icon: string;
  title: string;
  summary: string;
  whyItMatters: string;
  wowFactor: string;
  source: string;
  timeAgo: string;
  linkedArticleId?: string;
}

export const CURIOSITY_CATEGORIES = [
  { id: 'all', name: 'All Discoveries', icon: '✨', count: 2 },
  { id: 'Space', name: 'Space & Astrophysics', icon: '🌌', desc: 'Black holes, solar dynamics, stellar physics, Event Horizon Telescope, DKIST', count: 2 },
] as const;

export const CURIOSITY_ARTICLES: CuriosityArticle[] = [
  {
    id: 'art-black-hole',
    slug: 'clearest-view-yet-of-black-hole',
    title: 'Scientists Capture the Clearest View Yet of a Supermassive Black Hole',
    subtitle: 'Polarized light reveals the swirling magnetic vortex and photon ring right at the threshold of eternal darkness in M87*.',
    category: 'Space',
    categoryIcon: '🌌',
    date: '19 August 2026',
    readTime: '6 min read',
    heroImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1400&q=80',
    imageCredit: 'Event Horizon Telescope Collaboration / ALMA / ESO',
    imageCaption: 'High-frequency reconstructed imaging reveals the spiraling magnetic lines framing the event horizon of Messier 87*.',
    stats: [
      { label: 'Distance', value: '55M Light-Years' },
      { label: 'Mass', value: '6.5B Solar Masses' },
      { label: 'Resolution', value: '20 Microarcseconds' },
      { label: 'Jet Velocity', value: '99.9% Light Speed' },
    ],
    whatScientistsSaw: 'Astronomers linked radio dishes across six continents into a single Earth-sized virtual telescope. Instead of a blurry glowing doughnut, new algorithmic calibrations and higher-frequency receivers resolved razor-sharp magnetic striations—spiraling photon rings dancing just miles above the point of no return.',
    whyImportant: 'Until now, theoretical physicists could only calculate on supercomputers how matter falls into a gravity well so severe that time itself grinds to a halt. This image proves our general relativity equations hold true even under the most extreme gravitational violence known in the cosmos.',
    howTheyDidIt: 'Using Very Long Baseline Interferometry (VLBI) synchronized to atomic clocks with picosecond accuracy. Eight observatories—from the South Pole to the volcanoes of Hawaii—collected petabytes of raw radio data that were flown on physical hard drives to supercomputers in Germany and Massachusetts.',
    whatAreWeLookingAt: 'The dark central shadow is the event horizon: the boundary beyond which not even light can escape. The brilliant asymmetric ring around it is superheated plasma at billions of degrees, bent into a loop by gravity. The brighter side shows plasma hurtling directly toward our line of sight at nearly light speed.',
    interactiveType: 'black-hole',
    interactiveData: {
      accretionTemp: '10 Billion K',
      spinRate: '0.94 c',
      shadowDiameter: '40 Billion km',
      photonRingSharpness: '4.2x Improvement'
    },
    theFascinatingPart: 'The light you are looking at took 55 million years to reach Earth—originating when early primates were just evolving. Because space-time is curved around the black hole, you are actually seeing the back of the accretion disk bent over the top of the event horizon like a cosmic halo.',
    whyShouldICare: 'This isn’t just an iconic space wallpaper. Understanding how supermassive black holes launch relativistic plasma jets helps us decipher how entire galaxies, including our own Milky Way, regulate their star formation and prevent the early universe from collapsing into static chaos.',
    originalResearch: {
      title: 'First M87 Event Horizon Telescope Results. IX. Sharpened Polarimetric Constraints on Accretion and Jet Launching',
      journal: 'The Astrophysical Journal Letters',
      year: 2026,
      doi: '10.3847/2041-8213/ad8921',
      institution: 'Event Horizon Telescope Consortium / Harvard-Smithsonian Center for Astrophysics',
      authors: 'Akiyama, K., Event Horizon Telescope Collaboration et al.',
      url: 'https://iopscience.iop.org/journal/2041-8205'
    },
    tags: ['Black Holes', 'Astrophysics', 'Event Horizon', 'General Relativity', 'M87*', 'Stars'],
    audioSummaryDuration: '3:45 min',
    audioTranscript: 'Welcome to Curiosity. Today we explore the clearest view humanity has ever captured of a supermassive black hole...'
  },
  {
    id: 'art-sun-surface',
    slug: 'detailed-video-of-suns-surface-plasma',
    title: 'Researchers Capture an Incredibly Detailed Video of the Sun’s Roaring Surface',
    subtitle: 'Giant plasma boiling cells the size of Texas rise and sink in mesmerizing magnetic choreography across the solar photosphere.',
    category: 'Space',
    categoryIcon: '☀️',
    date: '18 August 2026',
    readTime: '5 min read',
    heroImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80',
    imageCredit: 'Daniel K. Inouye Solar Telescope (DKIST) / NSO / NSF / AURA',
    imageCaption: 'Solar convection granules: bright ascending thermal columns bordered by dark, cooler sinking plasma rivers.',
    stats: [
      { label: 'Granule Size', value: '1,000–1,500 km' },
      { label: 'Surface Temp', value: '5,500 °C' },
      { label: 'Magnetic Knots', value: '4,000 Gauss' },
      { label: 'Frame Detail', value: '18 km per pixel' },
    ],
    whatScientistsSaw: 'A 4-meter solar telescope on the summit of Haleakalā, Maui, recorded high-speed video of solar granulation. The Sun’s surface looks like a boiling cauldron of liquid gold, with individual granules—each roughly the size of Texas—churning and bursting every 8 to 12 minutes.',
    whyImportant: 'The Sun’s outer atmosphere (the corona) is mysteriously millions of degrees hotter than its visible surface. Watching these boiling cells in ultra-high resolution reveals tiny magnetic "campfires" and nanoflares that pump energy straight into space.',
    howTheyDidIt: 'The telescope uses a 4-meter primary mirror equipped with liquid-cooled heat stops, a 7-mile cooling pipe system, and adaptive optics that measure and cancel out Earth’s atmospheric distortion 2,000 times every second.',
    whatAreWeLookingAt: 'The bright center of each cell is molten plasma rising from deep within the nuclear core. As it reaches the surface, cools down, and radiates light, it flows to the dark border channels and sinks back down into the solar furnace.',
    interactiveType: 'sun-plasma',
    interactiveData: {
      convectionSpeed: '7 km/s',
      granuleLifespan: '10 min',
      coreDistance: '696,340 km',
      temperatureGradient: '5,500 °C to 15,000,000 °C'
    },
    theFascinatingPart: 'At any given moment, there are roughly four million of these convection granules boiling simultaneously across the Sun. The magnetic tension stored in the narrow dark valleys between granules can snap, releasing more energy in seconds than humanity consumes in a million years.',
    whyShouldICare: 'This isn’t just another picture of the Sun. The level of detail allows researchers to study how magnetic fields move across the Sun’s surface, which could eventually help us predict solar superstorms that disrupt satellites, GPS navigation, aviation corridors, and terrestrial power grids.',
    originalResearch: {
      title: 'High-Resolution Chromospheric Magnetometry and Granulation Dynamics with the Inouye Solar Telescope',
      journal: 'Solar Physics & Nature Astronomy',
      year: 2026,
      doi: '10.1038/s41550-026-0219-4',
      institution: 'National Solar Observatory / Haleakalā Observatory, Hawaii',
      authors: 'Rast, M. P., Rimmele, T. R., Martinez Pillet, V. et al.',
      url: 'https://www.nature.com/natastron/'
    },
    tags: ['Solar Science', 'Sun', 'Plasma Physics', 'Coronal Heating', 'Space Weather', 'DKIST'],
    audioSummaryDuration: '4:10 min'
  }
];

export const TODAY_IN_SCIENCE_FEED: DailyDiscoveryItem[] = [
  {
    number: '01',
    category: 'Astrophysics',
    icon: '🕳️',
    title: 'Photon ring polarization maps reveal relativistic spin dynamics of supermassive black hole M87*',
    summary: 'Higher-frequency VLBI radio interferometry resolves magnetic striations spiraling outside the event horizon.',
    whyItMatters: 'Confirms general relativity in the strongest gravitational fields in the universe.',
    wowFactor: 'Light from the back of the black hole is curved completely around to face Earth.',
    source: 'Event Horizon Telescope / Astrophysical Journal Letters',
    timeAgo: '2 hours ago',
    linkedArticleId: 'art-black-hole'
  },
  {
    number: '02',
    category: 'Solar Physics',
    icon: '☀️',
    title: 'DKIST 4-meter observatory captures ultra-high-resolution solar convection granulation and magnetic knots',
    summary: 'Thermal bubbling cells the size of Texas churn across the Sun with 18 km per pixel clarity.',
    whyItMatters: 'Explains coronal heating mystery and enhances global space weather forecast accuracy.',
    wowFactor: 'Over four million solar granules boil simultaneously across the Sun.',
    source: 'National Solar Observatory / Nature Astronomy',
    timeAgo: '4 hours ago',
    linkedArticleId: 'art-sun-surface'
  },
  {
    number: '03',
    category: 'Cosmology',
    icon: '🌌',
    title: 'JWST NIRCam detects extreme stellar disruption flare from intermediate-mass black hole',
    summary: 'A dense stellar core was captured and gravitationally stretched into a relativistic tidal stream.',
    whyItMatters: 'Provides the missing evolutionary link between stellar-mass and supermassive black holes.',
    wowFactor: 'The tidal gravitational gradient was strong enough to spaghettify an entire star in hours.',
    source: 'STScI / Nature Astronomy',
    timeAgo: '6 hours ago',
    linkedArticleId: 'art-black-hole'
  },
  {
    number: '04',
    category: 'Space Weather',
    icon: '⚡',
    title: 'Extreme solar magnetic reconnection events trigger coronal mass ejection pulses towards heliosphere',
    summary: 'Coronal magnetic field lines snap and reconfigure, launching billions of tons of magnetized plasma.',
    whyItMatters: 'Allows scientists to model geomagnetic storm impacts on low-Earth orbit satellites.',
    wowFactor: 'Reconnection accelerates particles to over 1,000 kilometers per second in milliseconds.',
    source: 'ESA / NASA Solar Orbiter',
    timeAgo: '8 hours ago',
    linkedArticleId: 'art-sun-surface'
  }
];

export function getArticleByIdOrSlug(idOrSlug: string): CuriosityArticle | undefined {
  return CURIOSITY_ARTICLES.find(
    (article) => article.slug === idOrSlug || article.id === idOrSlug
  );
}
