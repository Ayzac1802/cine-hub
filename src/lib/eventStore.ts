// Backend integration point: replace this in-memory store with a real-time database
// e.g. Supabase Realtime, Firebase RTDB, or a WebSocket server

export type Phase = 'lobby' | 'voting' | 'results' | 'finished';

export interface EventNode {
  id: string;
  parentId: string | null;
  name: string;
  votes: number;
  coverImage?: string;
  synopsis?: string;
}

export interface Participant {
  id: string;
  name: string;
  joinedAt: string;
}

export interface EventState {
  phase: Phase;
  currentParentId: string | null;
  winnerPath: string[];
  nodes: EventNode[];
  participants: Participant[];
  eventName?: string;
  passcode?: string;
  qrSize?: number;
}

export interface PersonalState {
  name: string | null;
  votes: Record<string, string>; // roundKey -> nodeId
}

// Initial demo data so the app feels live on first load
export const INITIAL_EVENT_STATE: EventState = {
  phase: 'lobby',
  currentParentId: null,
  winnerPath: [],
  eventName: 'CineHub Movie Night',
  passcode: '',
  qrSize: 200,
  participants: [
  { id: 'p-001', name: 'Maren K.', joinedAt: '2026-08-18T12:00:00Z' },
  { id: 'p-002', name: 'Theo R.', joinedAt: '2026-08-18T12:01:00Z' },
  { id: 'p-003', name: 'Yuki S.', joinedAt: '2026-08-18T12:02:00Z' },
  { id: 'p-004', name: 'Dani V.', joinedAt: '2026-08-18T12:03:00Z' },
  { id: 'p-005', name: 'Nico B.', joinedAt: '2026-08-18T12:04:00Z' }],

  nodes: [
  // Root categories
  { id: 'cat-thriller', parentId: null, name: 'Thriller', votes: 0 },
  { id: 'cat-scifi', parentId: null, name: 'Sci-Fi', votes: 0 },
  { id: 'cat-drama', parentId: null, name: 'Drama', votes: 0 },
  { id: 'cat-comedy', parentId: null, name: 'Comedy', votes: 0 },
  // Thriller children
  {
    id: 'thr-001', parentId: 'cat-thriller', name: 'Parasite', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1e3bf2fb2-1785140107256.png",
    synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.'
  },
  {
    id: 'thr-002', parentId: 'cat-thriller', name: 'Gone Girl', votes: 0,
    coverImage: "https://images.unsplash.com/photo-1709428730980-f4e86b4392f4",
    synopsis: 'On the morning of his fifth wedding anniversary, Nick Dunne reports that his wife Amy has gone missing, but all clues point to him.'
  },
  {
    id: 'thr-003', parentId: 'cat-thriller', name: 'Knives Out', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1e12c39a5-1773583193868.png",
    synopsis: 'A detective investigates the death of a patriarch of an eccentric, combative family after a mysterious death at his estate.'
  },
  // Sci-Fi children
  {
    id: 'sci-001', parentId: 'cat-scifi', name: 'Arrival', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_13e890502-1777582504939.png",
    synopsis: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.'
  },
  {
    id: 'sci-002', parentId: 'cat-scifi', name: 'Dune: Part Two', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_11f397a3e-1773583584182.png",
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
  },
  {
    id: 'sci-003', parentId: 'cat-scifi', name: 'Ex Machina', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_193c2b3e2-1787057962969.png",
    synopsis: 'A programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.'
  },
  // Drama children
  {
    id: 'dra-001', parentId: 'cat-drama', name: 'Past Lives', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_18c95d19e-1787057964169.png",
    synopsis: 'Two childhood sweethearts are separated when one emigrates from South Korea. They reunite years later in New York City, forcing them to confront destiny, love, and the lives they could have had.'
  },
  {
    id: 'dra-002', parentId: 'cat-drama', name: 'The Holdovers', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_18a44c788-1787057963774.png",
    synopsis: 'A curmudgeonly instructor at a New England prep school is forced to remain on campus over the holidays with a troubled student who has no place to go.'
  },
  // Comedy children
  {
    id: 'com-001', parentId: 'cat-comedy', name: 'Bottoms', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1a8d2a77e-1787057963780.png",
    synopsis: 'Two unpopular queer high schoolers start a fight club to meet girls before graduation.'
  },
  {
    id: 'com-002', parentId: 'cat-comedy', name: 'Booksmart', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_131891a63-1787057963762.png",
    synopsis: 'On the eve of their high school graduation, two academic overachievers realize they should have worked less and played more.'
  },
  {
    id: 'com-003', parentId: 'cat-comedy', name: 'The Lobster', votes: 0,
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_181e999da-1787057962243.png",
    synopsis: 'In a dystopian near future, single people must find a romantic partner within 45 days or be transformed into an animal of their choice.'
  }]

};

export const INITIAL_PERSONAL_STATE: PersonalState = {
  name: null,
  votes: {}
};

// Simulated voting state for demo (results phase with votes)
export const DEMO_VOTING_STATE: EventState = {
  phase: 'results',
  currentParentId: null,
  winnerPath: [],
  eventName: 'CineHub Movie Night',
  participants: [
  { id: 'p-001', name: 'Maren K.', joinedAt: '2026-08-18T12:00:00Z' },
  { id: 'p-002', name: 'Theo R.', joinedAt: '2026-08-18T12:01:00Z' },
  { id: 'p-003', name: 'Yuki S.', joinedAt: '2026-08-18T12:02:00Z' },
  { id: 'p-004', name: 'Dani V.', joinedAt: '2026-08-18T12:03:00Z' },
  { id: 'p-005', name: 'Nico B.', joinedAt: '2026-08-18T12:04:00Z' },
  { id: 'p-006', name: 'Priya M.', joinedAt: '2026-08-18T12:05:00Z' },
  { id: 'p-007', name: 'Luca F.', joinedAt: '2026-08-18T12:06:00Z' }],

  nodes: [
  { id: 'cat-thriller', parentId: null, name: 'Thriller', votes: 3 },
  { id: 'cat-scifi', parentId: null, name: 'Sci-Fi', votes: 2 },
  { id: 'cat-drama', parentId: null, name: 'Drama', votes: 1 },
  { id: 'cat-comedy', parentId: null, name: 'Comedy', votes: 1 },
  { id: 'thr-001', parentId: 'cat-thriller', name: 'Parasite', votes: 0 },
  { id: 'thr-002', parentId: 'cat-thriller', name: 'Gone Girl', votes: 0 },
  { id: 'thr-003', parentId: 'cat-thriller', name: 'Knives Out', votes: 0 },
  { id: 'sci-001', parentId: 'cat-scifi', name: 'Arrival', votes: 0 },
  { id: 'sci-002', parentId: 'cat-scifi', name: 'Dune: Part Two', votes: 0 },
  { id: 'sci-003', parentId: 'cat-scifi', name: 'Ex Machina', votes: 0 },
  { id: 'dra-001', parentId: 'cat-drama', name: 'Past Lives', votes: 0 },
  { id: 'dra-002', parentId: 'cat-drama', name: 'The Holdovers', votes: 0 },
  { id: 'com-001', parentId: 'cat-comedy', name: 'Bottoms', votes: 0 },
  { id: 'com-002', parentId: 'cat-comedy', name: 'Booksmart', votes: 0 },
  { id: 'com-003', parentId: 'cat-comedy', name: 'The Lobster', votes: 0 }]

};