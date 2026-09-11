import { IMAGES } from './images'
import { waProduct } from './whatsapp'

/**
 * The equipment catalogue.
 *
 * This is the file the owner edits most. Each entry is plain data — add, remove
 * or reorder freely and the grid, the filter tabs and the WhatsApp messages all
 * follow automatically.
 *
 * Two deliberate blanks, because inventing either would mislead a buyer about
 * to spend six figures:
 *
 *   price — `null` renders "Price on request" and sends them to WhatsApp.
 *           Fill it in as a plain string, e.g. price: '₦450,000'.
 *   specs — empty renders "Full specifications on request". Fill it in with
 *           real figures from the actual stock, e.g.
 *           specs: [{ label: 'Motor', value: '2.5 HP' }]
 */

export type CategoryFilter = 'treadmills' | 'cardio' | 'strength' | 'free-weights' | 'accessories'

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
  image: { src: string; alt: string }
  /** null = "Price on request". Set a string like '₦450,000' to show a price. */
  price: string | null
  description: string
  specs: ProductSpec[]
  availability: string
  /** Optional override; otherwise a product-specific message is generated. */
  whatsappMessage?: string
}

const AVAILABLE = 'Available to order'

export const PRODUCTS: Product[] = [
  {
    id: 'treadmill',
    name: 'Treadmill',
    category: 'Treadmills',
    filter: 'treadmills',
    image: IMAGES.products.treadmill,
    price: null,
    description:
      'Motorised treadmills for home and commercial use. Tell us your space and how many people will use it daily and we will match you to the right model.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'exercise-bike',
    name: 'Exercise Bike',
    category: 'Exercise Bikes',
    filter: 'cardio',
    image: IMAGES.products.bike,
    price: null,
    description:
      'Upright, recumbent and spin bikes. A quiet, low-impact option that suits small rooms and apartments.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'dumbbells',
    name: 'Dumbbells',
    category: 'Free Weights',
    filter: 'free-weights',
    image: IMAGES.products.dumbbells,
    price: null,
    description:
      'Fixed and adjustable dumbbells, sold individually or as a full rack set. The most useful first purchase for any home gym.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'weight-plates',
    name: 'Weight Plates',
    category: 'Free Weights',
    filter: 'free-weights',
    image: IMAGES.products.plates,
    price: null,
    description:
      'Rubber, bumper and cast iron plates in standard and Olympic bore. Available as loose plates or a complete loaded set.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'gym-bench',
    name: 'Gym Bench',
    category: 'Benches',
    filter: 'strength',
    image: IMAGES.products.bench,
    price: null,
    description:
      'Flat, incline and fully adjustable benches. Pairs with dumbbells or a rack to turn one corner into a complete training station.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'multi-gym',
    name: 'Multi-Gym Machine',
    category: 'Multi-Gym',
    filter: 'strength',
    image: IMAGES.products.multiGym,
    price: null,
    description:
      'All-in-one stations covering pressing, pulling and leg work in a single footprint. The efficient choice when floor space is tight.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'power-rack',
    name: 'Power Rack',
    category: 'Racks',
    filter: 'strength',
    image: IMAGES.products.powerRack,
    price: null,
    description:
      'Squat and power racks with safety catches, for training heavy on your own with confidence. The backbone of a serious setup.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'pull-up-bar',
    name: 'Pull-Up Bar',
    category: 'Pull-Up Bars',
    filter: 'strength',
    image: IMAGES.products.pullUpBar,
    price: null,
    description:
      'Wall-mounted, ceiling-mounted and free-standing pull-up stations. Our installers fix it properly and safely.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'kettlebells',
    name: 'Kettlebells',
    category: 'Free Weights',
    filter: 'free-weights',
    image: IMAGES.products.kettlebells,
    price: null,
    description:
      'Cast iron and competition kettlebells, sold singly or as a graduated set. Small footprint, wide range of training.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'cable-machine',
    name: 'Cable Machine',
    category: 'Cable Machines',
    filter: 'strength',
    image: IMAGES.products.cableMachine,
    price: null,
    description:
      'Single and dual pulley stations with attachments. Adds dozens of exercises to a gym without adding dozens of machines.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'leg-machine',
    name: 'Leg Machine',
    category: 'Leg Machines',
    filter: 'strength',
    image: IMAGES.products.legMachine,
    price: null,
    description:
      'Leg press, extension, curl and hack squat machines for commercial floors and well-equipped home gyms.',
    specs: [],
    availability: AVAILABLE,
  },
  {
    id: 'accessories',
    name: 'Gym Accessories',
    category: 'Accessories',
    filter: 'accessories',
    image: IMAGES.products.accessories,
    price: null,
    description:
      'Mats, resistance bands, skipping ropes, barbells, collars, storage racks and gym flooring. Everything that finishes a setup.',
    specs: [],
    availability: AVAILABLE,
  },
]

/** Filter tabs. `all` is prepended by the catalogue component. */
export const CATEGORY_TABS: Array<{ value: CategoryFilter | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'treadmills', label: 'Treadmills' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength' },
  { value: 'free-weights', label: 'Free Weights' },
  { value: 'accessories', label: 'Accessories' },
]

/** The WhatsApp link for a product, honouring any per-product override. */
export function productLink(product: Product): string {
  if (!product.whatsappMessage) return waProduct(product.name)
  return `https://wa.me/2348053594533?text=${encodeURIComponent(product.whatsappMessage)}`
}
