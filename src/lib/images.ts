/**
 * Central image registry.
 *
 * Every photograph on the site is referenced through this file so the gym can
 * swap in its own photography without touching a single component. Replace the
 * `src` values with your uploaded files (Supabase Storage public URLs, or
 * `/images/...` in /public) and keep the keys exactly as they are.
 */

const UNSPLASH = 'https://images.unsplash.com'

function u(id: string): string {
  return `${UNSPLASH}/${id}`
}

/**
 * Cap the source rendition. next/image still generates the responsive srcset;
 * this just stops us pulling a 5000px original. Once the photos are local this
 * can be reduced to `return src`.
 */
export function sized(src: string, width = 1600, quality = 74): string {
  if (!src.startsWith(UNSPLASH)) return src
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export type GymImage = { src: string; alt: string }

export const IMAGES = {
  hero: {
    src: u('photo-1534438327276-14e5300c3a48'),
    alt: 'Athlete mid-set under heavy load in the RoadBoy Gym&Sports strength hall',
  },
  heroAlt: {
    src: u('photo-1517836357463-d25dfeac3438'),
    alt: 'Wide view of the main training floor with racks and free weights',
  },
  intro: {
    src: u('photo-1571019613454-1cb2f99b2d8b'),
    alt: 'Members training together during an evening conditioning session',
  },
  introDetail: {
    src: u('photo-1581009146145-b5ef050c2e1e'),
    alt: 'Loaded barbell resting on a power rack',
  },
  cta: {
    src: u('photo-1540497077202-7c8a3999166f'),
    alt: 'Lifter chalking up before a working set',
  },
  about: {
    src: u('photo-1583454110551-21f2fa2afe61'),
    alt: 'Coach spotting a member through a barbell squat',
  },
  aboutFloor: {
    src: u('photo-1546483875-ad9014c88eba'),
    alt: 'Row of squat racks on the RoadBoy Gym&Sports strength floor',
  },
  coaching: {
    src: u('photo-1550345332-09e3ac987658'),
    alt: 'Trainer correcting a deadlift set-up',
  },
  community: {
    src: u('photo-1601422407692-ec4eeec1d9b3'),
    alt: 'Members talking after an evening session',
  },

  programs: {
    'beginner-strength': { src: u('photo-1526506118085-60ce8714f8c5'), alt: 'Beginner lifter learning the barbell back squat' },
    'fat-loss-conditioning': { src: u('photo-1605296867304-46d5465a13f1'), alt: 'Athlete finishing a hard conditioning interval' },
    'muscle-building': { src: u('photo-1567013127542-490d757e51fc'), alt: 'Dumbbell pressing on the gym floor' },
    'home-workout': { src: u('photo-1584466977773-e625c37cdd50'), alt: 'Home training session with a pair of dumbbells' },
    'athletic-performance': { src: u('photo-1552674605-db6ffd4facb5'), alt: 'Sprint and plyometric work on the turf lane' },
    'strong-foundations': { src: u('photo-1518611012118-696072aa579a'), alt: 'Member working through a controlled hip hinge' },
  } satisfies Record<string, GymImage>,

  categories: {
    chest: { src: u('photo-1532384748853-8f54a8f476e2'), alt: 'Barbell bench press' },
    back: { src: u('photo-1517838277536-f5f99be501cd'), alt: 'Cable row for the back' },
    legs: { src: u('photo-1541534741688-6078c6bfb5c5'), alt: 'Heavy barbell squat' },
    shoulders: { src: u('photo-1599058917765-a780eda07a3e'), alt: 'Standing overhead press' },
    arms: { src: u('photo-1596357395217-80de13130e92'), alt: 'Dumbbell curl' },
    core: { src: u('photo-1571902943202-507ec2618e8f'), alt: 'Core and trunk stability work' },
    'full-body': { src: u('photo-1558611848-73f7eb4001a1'), alt: 'Full body kettlebell circuit' },
    hiit: { src: u('photo-1534258936925-c58bed479fcb'), alt: 'High intensity intervals on the rower' },
  } satisfies Record<string, GymImage>,

  facilities: {
    strength: { src: u('photo-1579758629938-03607ccdbaba'), alt: 'The strength hall with calibrated plates and platforms' },
    cardio: { src: u('photo-1517344884509-a0c97ec11bcc'), alt: 'Cardio zone with treadmills and bikes' },
    functional: { src: u('photo-1533560904424-a0c61dc306fc'), alt: 'Functional turf lane with sleds and ropes' },
    freeweights: { src: u('photo-1519085360753-af0119f7cbe7'), alt: 'Free weight area with a full dumbbell rack' },
    changing: { src: u('photo-1507003211169-0a1dd7228f2d'), alt: 'Changing rooms and lockers' },
    recovery: { src: u('photo-1544005313-94ddf0286df2'), alt: 'Recovery and mobility area' },
  } satisfies Record<string, GymImage>,

  trainers: {
    'tunde-bakare': { src: u('photo-1568602471122-7832951cc4c5'), alt: 'Portrait of Tunde Bakare, head of strength' },
    'adaeze-okonkwo': { src: u('photo-1573497019940-1c28c88b4f3e'), alt: 'Portrait of Adaeze Okonkwo, strength and conditioning coach' },
    'marcus-idowu': { src: u('photo-1618355776464-8666794d2520'), alt: 'Portrait of Marcus Idowu, performance coach' },
    'zainab-yusuf': { src: u('photo-1580489944761-15a19d654956'), alt: 'Portrait of Zainab Yusuf, nutrition lead' },
    'david-eze': { src: u('photo-1500648767791-00dcc994a43e'), alt: 'Portrait of David Eze, conditioning coach' },
    'chloe-adeyemi': { src: u('photo-1494790108377-be9c29b29330'), alt: 'Portrait of Chloe Adeyemi, mobility and recovery coach' },
  } satisfies Record<string, GymImage>,

  members: {
    'kemi-a': { src: u('photo-1494790108377-be9c29b29330'), alt: 'Portrait of Kemi A.' },
    'seyi-o': { src: u('photo-1507003211169-0a1dd7228f2d'), alt: 'Portrait of Seyi O.' },
    'grace-n': { src: u('photo-1573497019940-1c28c88b4f3e'), alt: 'Portrait of Grace N.' },
    'daniel-m': { src: u('photo-1552058544-f2b08422138a'), alt: 'Portrait of Daniel M.' },
    'ibrahim-s': { src: u('photo-1531123897727-8f129e1688ce'), alt: 'Portrait of Ibrahim S.' },
    'tola-f': { src: u('photo-1517841905240-472988babdf9'), alt: 'Portrait of Tola F.' },
  } satisfies Record<string, GymImage>,

  transformations: {
    beforeA: { src: u('photo-1595152772835-219674b2a8a6'), alt: 'Member at the start of their training block' },
    afterA: { src: u('photo-1541101767792-f9b2b1c4f127'), alt: 'The same member on finishing the programme' },
    beforeB: { src: u('photo-1574680096145-d05b474e2155'), alt: 'Member at the start of their training block' },
    afterB: { src: u('photo-1512621776951-a57141f2eefd'), alt: 'The same member on finishing the programme' },
    beforeC: { src: u('photo-1498837167922-ddd27525d352'), alt: 'Member at the start of their training block' },
    afterC: { src: u('photo-1547592180-85f173990554'), alt: 'The same member on finishing the programme' },
    beforeD: { src: u('photo-1490645935967-10de6ba17061'), alt: 'Member at the start of their training block' },
    afterD: { src: u('photo-1559496417-e7f25cb247f3'), alt: 'The same member on finishing the programme' },
  } satisfies Record<string, GymImage>,

  gallery: [
    { src: u('photo-1534438327276-14e5300c3a48'), alt: 'Heavy single under the bar in the strength hall' },
    { src: u('photo-1517836357463-d25dfeac3438'), alt: 'The main training floor at peak hour' },
    { src: u('photo-1571019613454-1cb2f99b2d8b'), alt: 'Group conditioning class mid-round' },
    { src: u('photo-1546483875-ad9014c88eba'), alt: 'Squat racks lined along the north wall' },
    { src: u('photo-1533560904424-a0c61dc306fc'), alt: 'Sled push down the functional turf lane' },
    { src: u('photo-1517344884509-a0c97ec11bcc'), alt: 'Cardio zone overlooking the street' },
    { src: u('photo-1550345332-09e3ac987658'), alt: 'One-to-one coaching on deadlift technique' },
    { src: u('photo-1519085360753-af0119f7cbe7'), alt: 'Full dumbbell rack, 2.5kg to 60kg' },
    { src: u('photo-1470468969717-61d5d54fd036'), alt: 'Members catching their breath after a session' },
    { src: u('photo-1483721310020-03333e577078'), alt: 'Chalk, straps and a loaded bar' },
    { src: u('photo-1579758629938-03607ccdbaba'), alt: 'Competition platforms and calibrated plates' },
    { src: u('photo-1601422407692-ec4eeec1d9b3'), alt: 'Evening community session on the floor' },
  ] satisfies GymImage[],

  workouts: {
    upper: { src: u('photo-1532384748853-8f54a8f476e2'), alt: 'Upper body pressing session' },
    lower: { src: u('photo-1541534741688-6078c6bfb5c5'), alt: 'Lower body strength session' },
    fullBody: { src: u('photo-1558611848-73f7eb4001a1'), alt: 'Full body training session' },
    conditioning: { src: u('photo-1534258936925-c58bed479fcb'), alt: 'Conditioning intervals' },
    core: { src: u('photo-1571902943202-507ec2618e8f'), alt: 'Core training session' },
    mobility: { src: u('photo-1591258370814-01609b341790'), alt: 'Mobility and recovery session' },
    push: { src: u('photo-1599058917765-a780eda07a3e'), alt: 'Push day session' },
    pull: { src: u('photo-1517838277536-f5f99be501cd'), alt: 'Pull day session' },
    arms: { src: u('photo-1596357395217-80de13130e92'), alt: 'Arm training session' },
    hiit: { src: u('photo-1559496417-e7f25cb247f3'), alt: 'HIIT circuit session' },
    back: { src: u('photo-1517838277536-f5f99be501cd'), alt: 'Back training session' },
    chest: { src: u('photo-1532384748853-8f54a8f476e2'), alt: 'Chest training session' },
    legs: { src: u('photo-1541534741688-6078c6bfb5c5'), alt: 'Leg training session' },
    shoulders: { src: u('photo-1599058917765-a780eda07a3e'), alt: 'Shoulder training session' },
  } satisfies Record<string, GymImage>,

  og: { src: u('photo-1534438327276-14e5300c3a48'), alt: 'RoadBoy Gym&Sports' },
} as const
