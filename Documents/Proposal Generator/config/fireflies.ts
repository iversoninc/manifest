export const FIREFLIES_API_ENDPOINT = 'https://api.fireflies.ai/graphql';

export interface FirefliesMeeting {
  id: string;
  title: string;
  date: string;
  transcript?: string;
  summary?: {
    keywords: string[];
    action_items: string[];
    overview: string;
  };
  duration?: number;
  meeting_attendees?: Array<{
    displayName: string;
    email: string;
  }>;
}

export interface FirefliesConfig {
  apiKey: string;
}

// GraphQL Queries
export const MEETINGS_QUERY = `
  query GetTranscripts($limit: Int, $skip: Int) {
    transcripts(limit: $limit, skip: $skip) {
      id
      title
      date
      duration
      meeting_attendees {
        displayName
        email
      }
      summary {
        keywords
        action_items
        overview
      }
      transcript_url
    }
  }
`;

export const MEETING_TRANSCRIPT_QUERY = `
  query GetTranscript($id: String!) {
    transcript(id: $id) {
      id
      title
      date
      duration
      sentences {
        text
        speaker_name
        start_time
        end_time
      }
      summary {
        keywords
        action_items
        overview
      }
    }
  }
`;
