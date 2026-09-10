import { ClinicService, Practitioner } from '../types';

export const CLINIC_SERVICES: ClinicService[] = [
  {
    id: 'swedish-massage',
    title: 'Full Body Swedish Massage',
    category: 'Massage Therapy',
    tagline: 'Gentle, flowing strokes to ease muscle tension and soothe the nervous system.',
    description: 'A classic whole-body treatment utilizing long glides, kneading, and circular motions. Designed to dissolve daily stress, stimulate lymphatic flow, and restore harmonic circulation.',
    durations: [
      { minutes: 60, price: 140 },
      { minutes: 90, price: 195 },
    ],
    popular: true,
    recommendedTimeOfDay: 'Afternoon & Evening',
  },
  {
    id: 'deep-tissue',
    title: 'Deep Tissue Therapeutic Massage',
    category: 'Targeted Bodywork',
    tagline: 'Intense trigger-point release for chronic fascia strain and athletic recovery.',
    description: 'Slow, deep-pressurized strokes targeting inner muscle bands, tendons, and myofascial layers. Ideal for repetitive strain, posture correction, and sports conditioning.',
    durations: [
      { minutes: 60, price: 160 },
      { minutes: 90, price: 220 },
    ],
    popular: true,
    recommendedTimeOfDay: 'Midday or 3:00 PM - 5:00 PM',
  },
  {
    id: 'hydrafacial-glow',
    title: 'Serenity Hydrafacial Glow',
    category: 'Aesthetic Wellness',
    tagline: 'Multi-stage vortex infusion cleansing, diamond micro-exfoliation, and peptide hydration.',
    description: 'Clinical grade facial treatment delivering instant radiance without downtime. Cleanses pores deeply with botanical acids while infusing potent antioxidants, hyaluronic acid, and peptides.',
    durations: [
      { minutes: 60, price: 185 },
      { minutes: 75, price: 235 },
    ],
    popular: false,
    recommendedTimeOfDay: 'Morning to Afternoon',
  },
  {
    id: 'hot-stone',
    title: 'Basalt Hot Stone Therapy',
    category: 'Thermal Healing',
    tagline: 'Heated volcanic basalt stones melting chronic adhesions and grounding energy.',
    description: 'Smooth river-polished volcanic stones heated to therapeutic temperatures placed along spinal meridians and worked deeply into tight back and neck muscles with aromatic botanical oils.',
    durations: [
      { minutes: 75, price: 175 },
      { minutes: 90, price: 210 },
    ],
    popular: false,
    recommendedTimeOfDay: 'Late Afternoon or 5:00 PM',
  },
];

export const CLINIC_PRACTITIONERS: Practitioner[] = [
  {
    id: 'elena-vance',
    name: 'Elena Vance, LMT',
    role: 'Lead Neuromuscular & Swedish Specialist',
    specialties: ['Swedish Massage', 'Myofascial Release', 'Stress Decompression'],
    bio: '12 years of clinical bodywork practice with certification in holistic nervous system regulation.',
  },
  {
    id: 'marcus-hayes',
    name: 'Marcus Hayes, LMT',
    role: 'Senior Sports & Deep Tissue Therapist',
    specialties: ['Deep Tissue', 'Trigger Point Therapy', 'Post-Trauma Rehabilitation'],
    bio: 'Former Olympic training center recovery specialist focusing on structural fascial alignment.',
  },
  {
    id: 'dr-chloe-lin',
    name: 'Dr. Chloe Lin, DAOM',
    role: 'Director of Holistic Dermatology & Aesthetics',
    specialties: ['Hydrafacial Glow', 'Microneedling', 'Facial Acupressure'],
    bio: 'Doctor of Acupuncture and Oriental Medicine specializing in regenerative non-invasive skincare.',
  },
  {
    id: 'maya-thorne',
    name: 'Maya Thorne, LMT',
    role: 'Master Thermal & Basalt Bodywork Practitioner',
    specialties: ['Basalt Hot Stone', 'Aromatherapy', 'Ayurvedic Marma Points'],
    bio: 'Specialized in thermotherapy and ancient geothermal healing traditions.',
  },
];

export const AVAILABLE_TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '11:45 AM',
  '01:15 PM',
  '02:30 PM',
  '03:00 PM',
  '04:15 PM',
  '05:00 PM',
  '06:30 PM',
];
