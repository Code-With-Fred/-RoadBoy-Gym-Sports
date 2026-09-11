import { SITE } from './site'

/**
 * The FAQ. Shared by the accordion and the FAQPage structured data, so the
 * rich result can never drift from what the page actually says.
 */
export const FAQS = [
  {
    question: 'Do you deliver across Nigeria?',
    answer: `Yes. ${SITE.name} delivers to customers across Nigeria.`,
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Orders are typically delivered within 3 days, depending on location and product availability.',
  },
  {
    question: 'Is delivery really free?',
    answer: 'Yes. RoadBoy provides free nationwide delivery.',
  },
  {
    question: 'Do you install the equipment?',
    answer: 'Yes. Installation and setup are provided at no additional cost.',
  },
  {
    question: 'How does payment on delivery work?',
    answer: 'You pay when the equipment arrives and has been verified.',
  },
  {
    question: 'Can I order equipment for a commercial gym?',
    answer:
      'Yes. RoadBoy supplies equipment for home gyms, commercial gyms, hotels, offices and other fitness facilities.',
  },
  {
    question: 'How do I place an order?',
    answer:
      "Simply select the equipment you're interested in and click the WhatsApp order button. Our team will help you confirm availability, pricing and delivery details.",
  },
  {
    question: 'Can you help me choose equipment?',
    answer:
      'Yes. Contact us on WhatsApp and tell us what you’re building, your available space and the type of training you need. Our team can guide you.',
  },
] as const
