// Raipur City Guardian Seed Data

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'
export type Status =
  | 'reported'
  | 'ai_analyzed'
  | 'municipal_verified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'inspection_verified'
  | 'citizen_verified'
  | 'rewarded'
  | 'rejected'
  | 'disputed'
  | 'rework'

export const LIFECYCLE: { key: Status; label: string }[] = [
  { key: 'reported', label: 'Reported' },
  { key: 'ai_analyzed', label: 'AI Analyzed' },
  { key: 'municipal_verified', label: 'Municipal Verified' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'inspection_verified', label: 'Inspection Verified' },
  { key: 'citizen_verified', label: 'Citizen Verified' },
  { key: 'rewarded', label: 'Rewarded' },
]

export const STATUS_LABEL: Record<Status, string> = {
  reported: 'Reported',
  ai_analyzed: 'AI Analyzed',
  municipal_verified: 'Verified',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  inspection_verified: 'Inspected',
  citizen_verified: 'Citizen OK',
  rewarded: 'Rewarded',
  rejected: 'Rejected',
  disputed: 'Disputed',
  rework: 'Rework',
}

export type Ward = {
  id: string
  official: string
  game: string
  area: string
  points: number
  resolved: number
  pending: number
  avgDays: number
  lat: number
  lng: number
}

// Raipur, Chhattisgarh Wards & Clans
export const WARDS: Ward[] = [
  { id: 'w1', official: 'Ward 1', game: 'Telibandha Titans', area: 'Marine Drive / Telibandha', points: 1940, resolved: 48, pending: 5, avgDays: 1.8, lat: 21.2384, lng: 81.6606 },
  { id: 'w2', official: 'Ward 2', game: 'Jaistambh Juggernauts', area: 'Jaistambh Chowk / Malviya Rd', points: 1720, resolved: 41, pending: 8, avgDays: 2.3, lat: 21.2422, lng: 81.6335 },
  { id: 'w3', official: 'Ward 3', game: 'Shankar Nagar Strikers', area: 'Shankar Nagar Sector 2', points: 1560, resolved: 36, pending: 6, avgDays: 2.7, lat: 21.2573, lng: 81.6628 },
  { id: 'w4', official: 'Ward 4', game: 'Pandri Pioneers', area: 'Pandri Cloth Market', points: 1420, resolved: 33, pending: 10, avgDays: 3.1, lat: 21.2612, lng: 81.6441 },
  { id: 'w5', official: 'Ward 5', game: 'Samta Superstars', area: 'Samta Colony / Byron Bazar', points: 1180, resolved: 27, pending: 9, avgDays: 3.4, lat: 21.2486, lng: 81.6198 },
  { id: 'w6', official: 'Ward 6', game: 'Tatibandh Thunder', area: 'Tatibandh / AIIMS Raipur', points: 980, resolved: 22, pending: 11, avgDays: 3.9, lat: 21.2598, lng: 81.5684 },
  { id: 'w7', official: 'Ward 7', game: 'Atal Nagar Avengers', area: 'Naya Raipur (Capitol Complex)', points: 1650, resolved: 38, pending: 4, avgDays: 2.0, lat: 21.1610, lng: 81.7876 },
]

export type Complaint = {
  id: string
  title: string
  category: 'Garbage' | 'Drainage' | 'Road Damage' | 'Streetlight' | 'Water Leakage' | 'Illegal Dumping'
  severity: Severity
  status: Status
  wardId: string
  image: string
  afterImage?: string
  location: string
  lat: number
  lng: number
  reportedBy: string
  reportedAt: string
  deadline: string
  upvotes: number
  description: string
  ai: {
    confidence: number
    approach: string
    effort: string
    timeline: string
    similar: string
  }
}

const day = 24 * 60 * 60 * 1000
const now = Date.now()
const iso = (offsetDays: number) => new Date(now + offsetDays * day).toISOString()

// Real complaints positioned across Raipur, Chhattisgarh OpenStreetMap
export const COMPLAINTS: Complaint[] = [
  {
    id: 'CG-1042',
    title: 'Deep pothole on GE Road near Jaistambh Chowk',
    category: 'Road Damage',
    severity: 'Critical',
    status: 'in_progress',
    wardId: 'w2',
    image: '/images/pothole.png',
    afterImage: '/images/road-fixed.png',
    location: 'GE Road, Jaistambh Chowk, Raipur',
    lat: 21.2422,
    lng: 81.6335,
    reportedBy: 'Anurag Tiwari',
    reportedAt: iso(-3),
    deadline: iso(2.1),
    upvotes: 56,
    description: 'Deep road cavity causing severe evening traffic jams near Jaistambh Chowk flyover.',
    ai: {
      confidence: 95,
      approach: 'Cold-mix asphalt patch followed by hot bitumen resurfacing within 48h.',
      effort: '1 roller, 4 workers, 1.2 tonne bitumen',
      timeline: '2-3 days',
      similar: 'Resolved similarly near Pandri with rapid-curing mix in 36 hours.',
    },
  },
  {
    id: 'CG-1043',
    title: 'Garbage accumulation outside Pandri Cloth Market',
    category: 'Garbage',
    severity: 'High',
    status: 'assigned',
    wardId: 'w4',
    image: '/images/garbage.png',
    location: 'Pandri Main Market Gate 2, Raipur',
    lat: 21.2612,
    lng: 81.6441,
    reportedBy: 'Radhika Prajapati',
    reportedAt: iso(-1),
    deadline: iso(1.5),
    upvotes: 38,
    description: 'Commercial packaging and food waste piling outside shops, stray cattle blocking lane.',
    ai: {
      confidence: 92,
      approach: 'Dispatch compaction truck, sanitize spot, install 2 wet/dry segregation bins.',
      effort: '1 compactor vehicle, 3 sanitation workers',
      timeline: '24 hours',
      similar: 'Resolved in Shankar Nagar with night collection drive.',
    },
  },
  {
    id: 'CG-1044',
    title: 'Blocked stormwater drain overflowing on Marine Drive',
    category: 'Drainage',
    severity: 'High',
    status: 'reported',
    wardId: 'w1',
    image: '/images/drainage.png',
    location: 'Telibandha Talab (Marine Drive), Raipur',
    lat: 21.2384,
    lng: 81.6606,
    reportedBy: 'Vrushali Jain',
    reportedAt: iso(-0.4),
    deadline: iso(4),
    upvotes: 42,
    description: 'Drain grating choked with silt and plastic bottles, runoff entering walkway.',
    ai: {
      confidence: 90,
      approach: 'Deploy suction jetting machine, clear silt trap, install plastic barrier grid.',
      effort: '1 suction jetting unit, 4 workers',
      timeline: '2-4 days',
      similar: 'Cleaned at Shankar Nagar using mechanical excavator in 48h.',
    },
  },
  {
    id: 'CG-1045',
    title: 'High-mast streetlight dead in Shankar Nagar Sector 2',
    category: 'Streetlight',
    severity: 'Medium',
    status: 'resolved',
    wardId: 'w3',
    image: '/images/streetlight.png',
    location: 'VIP Club Corner, Shankar Nagar, Raipur',
    lat: 21.2573,
    lng: 81.6628,
    reportedBy: 'Priyanshu Arya',
    reportedAt: iso(-4),
    deadline: iso(-0.8),
    upvotes: 24,
    description: 'Entire intersection in darkness, risky for evening commuters and walkers.',
    ai: {
      confidence: 96,
      approach: 'Replace 120W LED fixture and inspect pole junction breaker.',
      effort: '1 hydraulic bucket truck, 2 electricians',
      timeline: '18 hours',
      similar: 'Fixed in Samta Colony in under 12 hours.',
    },
  },
  {
    id: 'CG-1046',
    title: 'Illegal construction dumping near AIIMS Raipur',
    category: 'Illegal Dumping',
    severity: 'Medium',
    status: 'ai_analyzed',
    wardId: 'w6',
    image: '/images/garbage.png',
    location: 'Tatibandh, near AIIMS Gate 4, Raipur',
    lat: 21.2598,
    lng: 81.5684,
    reportedBy: 'Ashish Balodia',
    reportedAt: iso(-0.8),
    deadline: iso(3),
    upvotes: 19,
    description: 'Debris dumped along service road, narrowing ambulance route.',
    ai: {
      confidence: 89,
      approach: 'Clear debris with loader, serve notice on nearby construction site.',
      effort: '1 JCB loader, 2 dumper trucks',
      timeline: '2 days',
      similar: 'Cleared at Atal Nagar Expressway within 24h.',
    },
  },
  {
    id: 'CG-1047',
    title: 'Drinking water pipeline burst in Samta Colony',
    category: 'Water Leakage',
    severity: 'Critical',
    status: 'disputed',
    wardId: 'w5',
    image: '/images/drainage.png',
    location: 'Near Ram Mandir, Samta Colony, Raipur',
    lat: 21.2486,
    lng: 81.6198,
    reportedBy: 'Virat Kohli',
    reportedAt: iso(-5),
    deadline: iso(-1.2),
    upvotes: 62,
    description: 'Fresh municipal water gushing onto the road for 3 days, low pressure in homes.',
    ai: {
      confidence: 94,
      approach: 'Isolate main valve, weld crack clamp, restore pressure and road tarmac.',
      effort: 'Emergency plumbing squad of 6, mini excavator',
      timeline: '1-2 days',
      similar: 'Repaired in Telibandha with collar sleeve in 20 hours.',
    },
  },
  {
    id: 'CG-1048',
    title: 'Overflowing dustbins on VIP Road',
    category: 'Garbage',
    severity: 'Low',
    status: 'citizen_verified',
    wardId: 'w1',
    image: '/images/garbage.png',
    afterImage: '/images/cleanup.png',
    location: 'VIP Road, near Magneto Mall turn, Raipur',
    lat: 21.2435,
    lng: 81.6812,
    reportedBy: 'MS Dhoni',
    reportedAt: iso(-6),
    deadline: iso(-4),
    upvotes: 31,
    description: 'Weekend food crowd waste overflowing from bins onto footpath.',
    ai: {
      confidence: 93,
      approach: 'Increase pickup schedule to twice daily on weekends.',
      effort: '1 collection truck',
      timeline: '1 day',
      similar: 'Route optimized near Marine Drive successfully.',
    },
  },
]

// 13 Team Members / Citizens requested by the user
export type Citizen = {
  name: string
  email: string
  ward: string
  zone: string
  points: number
  gems: number
  elixir: number
  clan: string
  clanRole: string
  clanTrophies: number
  townHallLevel: number
  level: number
  xp: number
  avatar: string
  title: string
  reports: number
  badge: string
}

export const TEAM_MEMBERS: Citizen[] = [
  {
    name: 'Anurag Tiwari',
    email: 'anurag@cityguardian.in',
    ward: 'Ward 2',
    zone: 'Zone 1 - Jaistambh',
    points: 580,
    gems: 95,
    elixir: 520,
    clan: 'Jaistambh Juggernauts',
    clanRole: 'Clan Leader',
    clanTrophies: 2150,
    townHallLevel: 9,
    level: 9,
    xp: 85,
    avatar: 'mario',
    title: 'Grand Guardian of Raipur',
    reports: 18,
    badge: 'Diamond Guardian',
  },
  {
    name: 'Radhika Prajapati',
    email: 'radhika@cityguardian.in',
    ward: 'Ward 4',
    zone: 'Zone 4 - Pandri',
    points: 540,
    gems: 90,
    elixir: 490,
    clan: 'Pandri Pioneers',
    clanRole: 'Co-Leader',
    clanTrophies: 1980,
    townHallLevel: 8,
    level: 8,
    xp: 75,
    avatar: 'peach',
    title: 'Clean City Champion',
    reports: 16,
    badge: 'Gold Guardian',
  },
  {
    name: 'Vrushali Jain',
    email: 'vrushali@cityguardian.in',
    ward: 'Ward 1',
    zone: 'Zone 2 - Telibandha',
    points: 510,
    gems: 85,
    elixir: 480,
    clan: 'Telibandha Titans',
    clanRole: 'Co-Leader',
    clanTrophies: 1940,
    townHallLevel: 8,
    level: 8,
    xp: 70,
    avatar: 'archer',
    title: 'Marine Drive Warden',
    reports: 15,
    badge: 'Gold Guardian',
  },
  {
    name: 'Priyanshu Arya',
    email: 'priyanshu@cityguardian.in',
    ward: 'Ward 3',
    zone: 'Zone 3 - Shankar Nagar',
    points: 480,
    gems: 80,
    elixir: 440,
    clan: 'Shankar Nagar Strikers',
    clanRole: 'Elder',
    clanTrophies: 1820,
    townHallLevel: 8,
    level: 7,
    xp: 80,
    avatar: 'luigi',
    title: 'Master Pothole Smasher',
    reports: 14,
    badge: 'Gold Guardian',
  },
  {
    name: 'Ashish Balodia',
    email: 'ashish@cityguardian.in',
    ward: 'Ward 6',
    zone: 'Zone 5 - Tatibandh',
    points: 460,
    gems: 75,
    elixir: 430,
    clan: 'Tatibandh Thunder',
    clanRole: 'Elder',
    clanTrophies: 1790,
    townHallLevel: 7,
    level: 7,
    xp: 65,
    avatar: 'builder',
    title: 'Rapid Action Specialist',
    reports: 13,
    badge: 'Silver Guardian',
  },
  {
    name: 'Virat Kohli',
    email: 'virat@cityguardian.in',
    ward: 'Ward 5',
    zone: 'Zone 1 - Raipur Central',
    points: 620,
    gems: 120,
    elixir: 600,
    clan: 'Samta Superstars',
    clanRole: 'Clan Champion',
    clanTrophies: 2400,
    townHallLevel: 10,
    level: 10,
    xp: 95,
    avatar: 'barbarian',
    title: 'Legendary Finisher',
    reports: 22,
    badge: 'Crown Guardian',
  },
  {
    name: 'MS Dhoni',
    email: 'msdhoni@cityguardian.in',
    ward: 'Ward 1',
    zone: 'Zone 2 - Telibandha',
    points: 610,
    gems: 115,
    elixir: 590,
    clan: 'Telibandha Titans',
    clanRole: 'Grand Strategist',
    clanTrophies: 2350,
    townHallLevel: 10,
    level: 10,
    xp: 90,
    avatar: 'builder',
    title: 'Captain Cool',
    reports: 20,
    badge: 'Crown Guardian',
  },
  {
    name: 'Ramesh Sharma',
    email: 'ramesh@cityguardian.in',
    ward: 'Ward 2',
    zone: 'Zone 1 - Jaistambh',
    points: 410,
    gems: 65,
    elixir: 390,
    clan: 'Jaistambh Juggernauts',
    clanRole: 'Member',
    clanTrophies: 1650,
    townHallLevel: 7,
    level: 6,
    xp: 55,
    avatar: 'mario',
    title: 'Street Vigilante',
    reports: 11,
    badge: 'Silver Guardian',
  },
  {
    name: 'Vishal Rathor',
    email: 'vishal@cityguardian.in',
    ward: 'Ward 4',
    zone: 'Zone 4 - Pandri',
    points: 390,
    gems: 60,
    elixir: 370,
    clan: 'Pandri Pioneers',
    clanRole: 'Member',
    clanTrophies: 1580,
    townHallLevel: 7,
    level: 6,
    xp: 45,
    avatar: 'luigi',
    title: 'Waste Buster',
    reports: 10,
    badge: 'Silver Guardian',
  },
  {
    name: 'Kanak Sonare',
    email: 'kanak@cityguardian.in',
    ward: 'Ward 7',
    zone: 'Zone 5 - Naya Raipur',
    points: 370,
    gems: 55,
    elixir: 350,
    clan: 'Atal Nagar Avengers',
    clanRole: 'Member',
    clanTrophies: 1510,
    townHallLevel: 6,
    level: 5,
    xp: 60,
    avatar: 'peach',
    title: 'Green Earth Protector',
    reports: 9,
    badge: 'Bronze Guardian',
  },
  {
    name: 'Palak Sharma',
    email: 'palak@cityguardian.in',
    ward: 'Ward 3',
    zone: 'Zone 3 - Shankar Nagar',
    points: 350,
    gems: 50,
    elixir: 340,
    clan: 'Shankar Nagar Strikers',
    clanRole: 'Member',
    clanTrophies: 1450,
    townHallLevel: 6,
    level: 5,
    xp: 50,
    avatar: 'archer',
    title: 'Eco Warrior',
    reports: 8,
    badge: 'Bronze Guardian',
  },
  {
    name: 'Divyansh Mandrai',
    email: 'divyansh@cityguardian.in',
    ward: 'Ward 6',
    zone: 'Zone 5 - Tatibandh',
    points: 330,
    gems: 45,
    elixir: 320,
    clan: 'Tatibandh Thunder',
    clanRole: 'Member',
    clanTrophies: 1390,
    townHallLevel: 6,
    level: 5,
    xp: 40,
    avatar: 'builder',
    title: 'Drainage Scout',
    reports: 7,
    badge: 'Bronze Guardian',
  },
  {
    name: 'Anshika Agrawala',
    email: 'anshika@cityguardian.in',
    ward: 'Ward 5',
    zone: 'Zone 1 - Samta Colony',
    points: 310,
    gems: 40,
    elixir: 310,
    clan: 'Samta Superstars',
    clanRole: 'Member',
    clanTrophies: 1340,
    townHallLevel: 5,
    level: 4,
    xp: 65,
    avatar: 'peach',
    title: 'Civic Explorer',
    reports: 6,
    badge: 'Rookie Hero',
  },
]

export const CITIZENS = TEAM_MEMBERS

// Default active citizen
export const CURRENT_CITIZEN = TEAM_MEMBERS[0]

export type Partner = {
  id: string
  name: string
  type: 'Cafe' | 'Restaurant' | 'Retail' | 'CSR'
  coupons: number
  redemptions: number
  events: number
  impact: number
  status: 'verified' | 'pending' | 'rejected'
  image: string
}

export const PARTNERS: Partner[] = [
  { id: 'p1', name: 'Madhuram Sweets & Cafe', type: 'Cafe', coupons: 6, redemptions: 240, events: 4, impact: 980, status: 'verified', image: '/images/cafe.png' },
  { id: 'p2', name: 'Mocha Cafe Raipur', type: 'Restaurant', coupons: 4, redemptions: 195, events: 3, impact: 840, status: 'verified', image: '/images/cafe.png' },
  { id: 'p3', name: 'Raipur GreenRoots Foundation', type: 'CSR', coupons: 2, redemptions: 110, events: 7, impact: 1120, status: 'verified', image: '/images/cleanup.png' },
  { id: 'p4', name: 'Chhattisgarh Khadi & Retail', type: 'Retail', coupons: 3, redemptions: 88, events: 2, impact: 490, status: 'verified', image: '/images/cafe.png' },
]

export type Coupon = {
  id: string
  partner: string
  title: string
  cost: number
  stock: number
  category: Partner['type']
  expiry: string
  image: string
}

export const COUPONS: Coupon[] = [
  { id: 'c1', partner: 'Madhuram Sweets & Cafe', title: 'Free Special Chai & Samosa', cost: 70, stock: 45, category: 'Cafe', expiry: iso(20), image: '/images/cafe.png' },
  { id: 'c2', partner: 'Mocha Cafe Raipur', title: '20% off Dinner Voucher', cost: 120, stock: 30, category: 'Restaurant', expiry: iso(30), image: '/images/cafe.png' },
  { id: 'c3', partner: 'Madhuram Sweets & Cafe', title: 'Buy 1 Get 1 Kaju Katli (250g)', cost: 90, stock: 50, category: 'Cafe', expiry: iso(15), image: '/images/cafe.png' },
  { id: 'c4', partner: 'Chhattisgarh Khadi & Retail', title: 'Rs.150 off on Handloom Khadi', cost: 140, stock: 25, category: 'Retail', expiry: iso(45), image: '/images/hero-city.png' },
  { id: 'c5', partner: 'Raipur GreenRoots Foundation', title: 'Adopt & Plant a Tree at Marine Drive', cost: 50, stock: 200, category: 'CSR', expiry: iso(90), image: '/images/cleanup.png' },
  { id: 'c6', partner: 'Mocha Cafe Raipur', title: 'Free Choco Frappe with Sandwich', cost: 85, stock: 35, category: 'Restaurant', expiry: iso(18), image: '/images/cafe.png' },
]

export type CityEvent = {
  id: string
  title: string
  host: string
  date: string
  place: string
  points: number
  rsvps: number
  image: string
  kind: 'Drive' | 'Plantation' | 'Workshop' | 'Notice'
}

export const EVENTS: CityEvent[] = [
  { id: 'e1', title: 'Telibandha Marine Drive Cleanliness Drive', host: 'Raipur Nagar Nigam - Ward 1', date: iso(3), place: 'Marine Drive Promenade, Raipur', points: 40, rsvps: 142, image: '/images/cleanup.png', kind: 'Drive' },
  { id: 'e2', title: 'Naya Raipur Green Plantation Raid', host: 'Raipur GreenRoots Foundation', date: iso(6), place: 'Central Park, Atal Nagar', points: 50, rsvps: 228, image: '/images/cleanup.png', kind: 'Plantation' },
  { id: 'e3', title: 'Commercial Waste Segregation Seminar', host: 'Madhuram Cafe & Pandri Vyapari Sangh', date: iso(9), place: 'Pandri Market Hall', points: 25, rsvps: 76, image: '/images/cafe.png', kind: 'Workshop' },
  { id: 'e4', title: 'Monsoon Silt Desilting Municipal Notice', host: 'Raipur Nagar Nigam', date: iso(1), place: 'All 70 Wards Raipur', points: 0, rsvps: 0, image: '/images/drainage.png', kind: 'Notice' },
]

export const ZONES = [
  { id: 'z1', name: 'Zone 1 - Jaistambh / Malviya', lat: 21.2422, lng: 81.6335, aqi: 88, temp: 31 },
  { id: 'z2', name: 'Zone 2 - Telibandha / Marine Drive', lat: 21.2384, lng: 81.6606, aqi: 68, temp: 30 },
  { id: 'z3', name: 'Zone 3 - Shankar Nagar / VIP', lat: 21.2573, lng: 81.6628, aqi: 74, temp: 29 },
  { id: 'z4', name: 'Zone 4 - Pandri / Mowa', lat: 21.2612, lng: 81.6441, aqi: 104, temp: 32 },
  { id: 'z5', name: 'Zone 5 - Tatibandh / AIIMS', lat: 21.2598, lng: 81.5684, aqi: 62, temp: 30 },
  { id: 'z7', name: 'Zone 7 - Atal Nagar (Naya Raipur)', lat: 21.1610, lng: 81.7876, aqi: 48, temp: 28 },
]

export const POINT_RULES = [
  { issue: 'Broken streetlight', points: 10, deadline: '1-2 days' },
  { issue: 'Garbage accumulation', points: 15, deadline: '1-3 days' },
  { issue: 'Drainage blockage', points: 30, deadline: '2-7 days' },
  { issue: 'Dangerous road damage', points: 40, deadline: '1-4 weeks' },
  { issue: 'Major infrastructure', points: 50, deadline: 'Several months' },
]

export const TREND = [
  { day: 'Mon', reported: 18, resolved: 14 },
  { day: 'Tue', reported: 24, resolved: 19 },
  { day: 'Wed', reported: 16, resolved: 21 },
  { day: 'Thu', reported: 29, resolved: 23 },
  { day: 'Fri', reported: 25, resolved: 26 },
  { day: 'Sat', reported: 32, resolved: 24 },
  { day: 'Sun', reported: 21, resolved: 28 },
]

export const CATEGORY_SPLIT = [
  { name: 'Garbage', value: 36 },
  { name: 'Road', value: 24 },
  { name: 'Drainage', value: 18 },
  { name: 'Streetlight', value: 12 },
  { name: 'Water', value: 10 },
]

export function wardById(id: string) {
  return WARDS.find((w) => w.id === id) ?? WARDS[0]
}

export function aqiLevel(aqi: number) {
  if (aqi <= 50) return { label: 'Good', color: '#2fa84f' }
  if (aqi <= 100) return { label: 'Moderate', color: '#fbbf24' }
  if (aqi <= 150) return { label: 'Unhealthy (SG)', color: '#f7931e' }
  if (aqi <= 200) return { label: 'Unhealthy', color: '#e52521' }
  return { label: 'Hazardous', color: '#6b2fa0' }
}
