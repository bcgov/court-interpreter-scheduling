export type SearchParams = {
  language: string;
  level: string[];
  location: string;
  dates: {
    startDate?: string;
    endDate?: string;
  }
}
