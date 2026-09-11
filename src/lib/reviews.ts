/**
 * Customer reviews.
 *
 * This array is intentionally empty. Nothing here is invented, because a
 * fabricated review is both dishonest and the single easiest thing for a
 * sceptical buyer to catch — a fake name attached to a stock photo does more
 * damage than an empty section.
 *
 * The Reviews section switches over automatically: while this is empty it shows
 * an honest "we publish real feedback only" panel, and the moment you add your
 * first entry it renders a proper review wall.
 *
 * To add one, ask the customer's permission first, then:
 *
 *   export const REVIEWS: Review[] = [
 *     {
 *       id: 'r1',
 *       name: 'Chidi O.',
 *       location: 'Lekki, Lagos',
 *       purchased: 'Treadmill and adjustable bench',
 *       quote: 'Delivered in two days and set up the same afternoon.',
 *       image: { src: '/images/reviews/chidi.jpg', alt: 'Treadmill installed in a home gym' },
 *     },
 *   ]
 */

export interface Review {
  id: string
  /** Use the name the customer agreed to be shown under. */
  name: string
  location: string
  /** What they bought — this is what makes a review believable. */
  purchased: string
  quote: string
  /** Best of all: a photo of the delivered, installed equipment. */
  image?: { src: string; alt: string }
}

export const REVIEWS: Review[] = []
