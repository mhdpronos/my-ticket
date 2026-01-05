export type BookmakerId = '1xbet' | 'betwinner' | 'melbet';

export interface Bookmaker {
  id: BookmakerId;
  name: string;
}

export type OddsByBookmaker = Record<BookmakerId, number>;
