import { productImage } from './images'
import { waCustom, waProduct } from './whatsapp'

/**
 * The equipment catalogue — RoadBoy's current price list.
 *
 * This is the file the owner edits most. Each entry is plain data: add, remove
 * or reorder freely and the grid, the filter tabs, the counts and the WhatsApp
 * messages all follow.
 *
 * Rules the data keeps to, so the page never tells a buyer something untrue:
 *
 *   priceNaira — whole Naira as a number, e.g. 830000. `null` renders
 *                "Price on request".
 *   specs      — only facts from the supplier's list. Nothing is estimated;
 *                a spec that was not supplied is simply left out.
 *
 * Products appear in the order below. The first `INITIAL_VISIBLE` show on
 * load; the rest sit behind "Show all" (still in the HTML for search engines).
 */

export type CategoryFilter = 'cardio' | 'strength' | 'games' | 'recovery'

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  /** Shown on the card. */
  category: string
  /** Drives the filter tabs. */
  filter: CategoryFilter
  /**
   * null renders a designed "photo on request" tile. That is deliberate: a
   * stock photo of a *different* machine would mislead the buyer, so a product
   * only shows a picture when the picture is the right kind of product.
   */
  image: { src: string; alt: string; representative: boolean } | null
  /** Whole Naira. null renders "Price on request". */
  priceNaira: number | null
  description: string
  specs: ProductSpec[]
  availability: string
  /** Optional override; otherwise a product-specific message is generated. */
  whatsappMessage?: string
}

const AVAILABLE = 'Available to order'

export const PRODUCTS: Product[] = [
  {
    id: 'treadmill-2-5hp',
    name: '2.5HP Treadmill',
    category: 'Treadmill',
    filter: 'cardio',
    image: productImage('treadmill-2-5hp'),
    priceNaira: 830_000,
    description:
      'Technofitness motorised treadmill, supplied with a waist massager, a pair of 2lb dumbbells and a twister.',
    specs: [
      { label: 'Brand', value: 'Technofitness' },
      { label: 'Motor', value: '2.5 HP' },
      { label: 'Max user weight', value: '120 kg' },
      { label: 'Includes', value: 'Waist massager, 2lb dumbbells, twister' },
    ],
    availability: AVAILABLE,
  },
  {
    id: 'ab-coaster',
    name: 'Ab Coaster',
    category: 'Core',
    filter: 'strength',
    image: productImage('ab-coaster'),
    priceNaira: 400_000,
    description: 'A guided abdominal machine for focused core training.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'platform-treadmill',
    name: 'Platform Treadmill with Remote Control',
    category: 'Treadmill',
    filter: 'cardio',
    image: productImage('platform-treadmill'),
    priceNaira: 420_000,
    description: 'A compact platform treadmill operated by remote control.',
    specs: [
      { label: 'Control', value: 'Remote control' },
      { label: 'Max user weight', value: '120 kg' },
    ],
    availability: AVAILABLE,
  },
  {
    id: 'joola-table-tennis',
    name: 'JOOLA Table Tennis Table',
    category: 'Table Tennis',
    filter: 'games',
    image: productImage('joola-table-tennis'),
    priceNaira: 750_000,
    description: 'JOOLA table tennis table with an aluminium top board on big-tyre wheels.',
    specs: [
      { label: 'Brand', value: 'JOOLA' },
      { label: 'Top board', value: 'Aluminium' },
      { label: 'Wheels', value: 'Big tyre' },
    ],
    availability: AVAILABLE,
  },
  {
    id: 'soccer-board-6ft',
    name: '6ft Soccer Board',
    category: 'Table Football',
    filter: 'games',
    image: productImage('soccer-board-6ft'),
    priceNaira: 600_000,
    description: 'A six-foot soccer board (table football) for homes, lounges, offices and game rooms.',
    specs: [{ label: 'Size', value: '6 ft' }],
    availability: AVAILABLE,
  },
  {
    id: 'three-station-gym',
    name: '3-Station Gym',
    category: 'Multi-Gym',
    filter: 'strength',
    image: productImage('three-station-gym'),
    priceNaira: 1_200_000,
    description: 'A three-station multi-gym that brings a range of strength exercises onto one frame.',
    specs: [{ label: 'Stations', value: '3' }],
    availability: AVAILABLE,
  },
  {
    id: 'power-tower',
    name: 'Power Tower',
    category: 'Bodyweight',
    filter: 'strength',
    image: productImage('power-tower'),
    priceNaira: 350_000,
    description: 'Pull-ups, dips and hanging knee raises on a single station.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'plate-fitness-board',
    name: 'Plate Fitness Board',
    category: 'Fitness Plate',
    filter: 'recovery',
    image: productImage('plate-fitness-board'),
    priceNaira: 120_000,
    description: 'A plate fitness board for home use. Message us for a photo and video of this exact model.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'stair-climber',
    name: 'Stair Climber',
    category: 'Stair Climber',
    filter: 'cardio',
    image: productImage('stair-climber'),
    priceNaira: 300_000,
    description: 'Stair-climbing cardio that builds leg strength and endurance.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'big-ab-crunch',
    name: 'Big Ab Crunch',
    category: 'Core',
    filter: 'strength',
    image: productImage('big-ab-crunch'),
    priceNaira: 330_000,
    description: 'An ab crunch machine for guided core training.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'squat-machine-horse-rider',
    name: 'Squat Machine (Horse Rider)',
    category: 'Lower Body',
    filter: 'strength',
    image: productImage('squat-machine-horse-rider'),
    priceNaira: 340_000,
    description: 'A horse-rider style squat machine for lower-body training.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'smc-table-tennis',
    name: 'SMC Top Table Tennis Table',
    category: 'Table Tennis',
    filter: 'games',
    image: productImage('smc-table-tennis'),
    priceNaira: 600_000,
    description: 'Table tennis table with an SMC top board.',
    specs: [{ label: 'Top board', value: 'SMC' }],
    availability: AVAILABLE,
  },
  {
    id: 'weight-bench-lat-pulldown',
    name: 'Weight Bench with Lat Pulldown',
    category: 'Bench',
    filter: 'strength',
    image: productImage('weight-bench-lat-pulldown'),
    priceNaira: 330_000,
    description: 'A weight bench with a built-in lat pulldown for back and upper-body work.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'massage-gun-double-head',
    name: 'Double Head Massage Gun',
    category: 'Massage',
    filter: 'recovery',
    image: productImage('massage-gun-double-head'),
    priceNaira: 60_000,
    description: 'A handheld massage gun with a double head, for recovery after training.',
    specs: [{ label: 'Head', value: 'Double' }],
    availability: AVAILABLE,
  },
  {
    id: 'snooker-8ft',
    name: '8ft Foreign Snooker Table',
    category: 'Snooker',
    filter: 'games',
    image: productImage('snooker-8ft'),
    priceNaira: 1_150_000,
    description: 'An imported eight-foot snooker table, supplied with a double set of accessories.',
    specs: [
      { label: 'Size', value: '8 ft' },
      { label: 'Accessories', value: 'Double set' },
    ],
    availability: AVAILABLE,
  },
  {
    id: 'rowing-machine',
    name: 'Semi-Commercial Rowing Machine',
    category: 'Rowing',
    filter: 'cardio',
    image: productImage('rowing-machine'),
    priceNaira: 600_000,
    description: 'A semi-commercial rowing machine for full-body cardio at home or in a small gym.',
    specs: [{ label: 'Grade', value: 'Semi-commercial' }],
    availability: AVAILABLE,
  },
  {
    id: 'foot-massager-4d',
    name: '4D Foot Massager',
    category: 'Massage',
    filter: 'recovery',
    image: productImage('foot-massager-4d'),
    priceNaira: 180_000,
    description: 'A 4D foot massager for relief after long days and hard sessions.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'standing-mini-stepper',
    name: 'Standing Mini Stepper',
    category: 'Stepper',
    filter: 'cardio',
    image: productImage('standing-mini-stepper'),
    priceNaira: 240_000,
    description: 'A standing mini stepper, supplied with a pair of aerobic dumbbells and a waist twister.',
    specs: [{ label: 'Includes', value: 'Aerobic dumbbells, waist twister' }],
    availability: AVAILABLE,
  },
  {
    id: 'home-weight-bench-lat-pulldown',
    name: 'Home Use Weight Bench with Lat Pulldown',
    category: 'Bench',
    filter: 'strength',
    image: productImage('home-weight-bench-lat-pulldown'),
    priceNaira: 300_000,
    description: 'A home-use weight bench with a lat pulldown attachment.',
    specs: [{ label: 'Use', value: 'Home' }],
    availability: AVAILABLE,
  },
  {
    id: 'snooker-4-in-1-6ft',
    name: '4-in-1 6ft Foreign Snooker Table',
    category: 'Snooker',
    filter: 'games',
    image: productImage('snooker-4-in-1-6ft'),
    priceNaira: 620_000,
    description:
      'An imported six-foot snooker table that also plays table tennis, and serves as a home or office table.',
    specs: [
      { label: 'Size', value: '6 ft' },
      { label: 'Converts to', value: 'Table tennis, home or office table' },
    ],
    availability: AVAILABLE,
  },
  {
    id: 'platform-massager',
    name: 'Platform Massager with Bluetooth',
    category: 'Massage',
    filter: 'recovery',
    image: productImage('platform-massager'),
    priceNaira: 230_000,
    description: 'A platform massager with Bluetooth, operated by remote control.',
    specs: [
      { label: 'Connectivity', value: 'Bluetooth' },
      { label: 'Control', value: 'Remote control' },
      { label: 'Max user weight', value: '120 kg' },
    ],
    availability: AVAILABLE,
  },
  {
    id: 'single-station-gym',
    name: 'Single Station Gym',
    category: 'Multi-Gym',
    filter: 'strength',
    image: productImage('single-station-gym'),
    priceNaira: 750_000,
    description: 'A single-station home gym combining several strength exercises in one machine.',
    specs: [{ label: 'Stations', value: '1' }],
    availability: AVAILABLE,
  },
  {
    id: 'spinning-bike',
    name: 'Home Use Spinning Bike',
    category: 'Exercise Bike',
    filter: 'cardio',
    image: productImage('spinning-bike'),
    priceNaira: 350_000,
    description: 'A home-use spinning bike for indoor cycling workouts.',
    specs: [
      { label: 'Use', value: 'Home' },
      { label: 'Max user weight', value: '120 kg' },
    ],
    availability: AVAILABLE,
  },
  {
    id: 'crazy-fit-massager',
    name: 'Crazy Fit Massager',
    category: 'Massage',
    filter: 'recovery',
    image: productImage('crazy-fit-massager'),
    priceNaira: 430_000,
    description: 'A Crazy Fit massager with a higher user weight capacity.',
    specs: [{ label: 'Max user weight', value: '130 kg' }],
    availability: AVAILABLE,
  },
  {
    id: 'massage-gun-single-head',
    name: 'Single Head Massage Gun',
    category: 'Massage',
    filter: 'recovery',
    image: productImage('massage-gun-single-head'),
    priceNaira: 50_000,
    description: 'A handheld single-head massage gun for recovery after training.',
    specs: [{ label: 'Head', value: 'Single' }],
    availability: AVAILABLE,
  },
  {
    id: 'mini-stepper-lat-pull',
    name: 'Mini Stepper with Lat Pull',
    category: 'Stepper',
    filter: 'cardio',
    image: productImage('mini-stepper-lat-pull'),
    priceNaira: 150_000,
    description: 'A mini stepper with lat pull, working the legs and upper body together.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'sit-up-bench',
    name: 'Sit-Up Bench',
    category: 'Core',
    filter: 'strength',
    image: productImage('sit-up-bench'),
    priceNaira: 120_000,
    description: 'A sit-up bench for core training at home.',
    specs: [],
    availability: AVAILABLE,
  },
]

/** How many products the "All" tab shows before "Show all". */
export const INITIAL_VISIBLE = 8

export const CATEGORY_TABS: Array<{ value: CategoryFilter | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength' },
  { value: 'games', label: 'Sports & Games' },
  { value: 'recovery', label: 'Massage & Recovery' },
]

/** The WhatsApp link for a product, honouring any per-product override. */
export function productLink(product: Product): string {
  return product.whatsappMessage ? waCustom(product.whatsappMessage) : waProduct(product.name, product.priceNaira)
}
