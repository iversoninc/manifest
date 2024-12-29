import { useState, useEffect } from 'react';
import { 
  FIREFLIES_API_ENDPOINT, 
  MEETINGS_QUERY, 
  MEETING_TRANSCRIPT_QUERY,
  type FirefliesMeeting,
  type FirefliesConfig
} from '../config/fireflies';

interface MeetingSelectorProps {
  apiKey: string;
  onMeetingsSelected: (meetings: FirefliesMeeting[]) => void;
}

export default function MeetingSelector({ apiKey, onMeetingsSelected }: MeetingSelectorProps) {
  const [meetings, setMeetings] = useState<FirefliesMeeting[]>([]);
  const [selectedMeetings, setSelectedMeetings] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (apiKey) {
      fetchMeetings();
    }
  }, [apiKey]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(FIREFLIES_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          query: MEETINGS_QUERY,
          variables: {
            limit: 50,
            skip: 0
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const fetchedMeetings = data.data.transcripts.map((meeting: any) => ({
        id: meeting.id,
        title: meeting.title || 'Untitled Meeting',
        date: new Date(meeting.date).toLocaleDateString(),
        duration: meeting.duration,
        meeting_attendees: meeting.meeting_attendees,
        summary: meeting.summary
      }));

      setMeetings(fetchedMeetings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch meetings';
      console.error('Error in fetchMeetings:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingToggle = (meetingId: string) => {
    const newSelected = new Set(selectedMeetings);
    if (newSelected.has(meetingId)) {
      newSelected.delete(meetingId);
    } else {
      newSelected.add(meetingId);
    }
    setSelectedMeetings(newSelected);
  };

  const handleLoadTranscripts = async () => {
    try {
      setLoading(true);
      setError(null);

      const selectedMeetingsList = meetings.filter(m => selectedMeetings.has(m.id));
      const transcripts = await Promise.all(
        selectedMeetingsList.map(async (meeting) => {
          const response = await fetch(FIREFLIES_API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'x-api-key': apiKey
            },
            body: JSON.stringify({
              query: MEETING_TRANSCRIPT_QUERY,
              variables: { id: meeting.id }
            })
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch transcript for meeting ${meeting.id}`);
          }

          const data = await response.json();
          
          if (data.errors) {
            throw new Error(data.errors[0].message);
          }

          const transcript = data.data.transcript;
          return {
            ...meeting,
            transcript: transcript.sentences.map((s: any) => `${s.speaker_name}: ${s.text}`).join('\n'),
            summary: transcript.summary
          };
        })
      );

      onMeetingsSelected(transcripts);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load transcripts';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meeting-selector">
      <h3>Select Meetings</h3>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="meeting-list">
            {meetings.length === 0 ? (
              <div className="no-meetings">No meetings found</div>
            ) : (
              meetings.map((meeting) => (
                <div key={meeting.id} className="meeting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedMeetings.has(meeting.id)}
                      onChange={() => handleMeetingToggle(meeting.id)}
                    />
                    <div className="meeting-details">
                      <span className="meeting-title">{meeting.title}</span>
                      <div className="meeting-info">
                        <span className="meeting-date">{meeting.date}</span>
                        {meeting.duration && (
                          <span className="meeting-duration">
                            ({Math.round(meeting.duration)} min)
                          </span>
                        )}
                        {meeting.meeting_attendees && meeting.meeting_attendees.length > 0 && (
                          <span className="meeting-attendees">
                            {meeting.meeting_attendees.length} attendees
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              ))
            )}
          </div>
          <button
            onClick={handleLoadTranscripts}
            disabled={selectedMeetings.size === 0 || loading}
            className="load-button"
          >
            {loading ? 'Loading...' : 'Load Selected Transcripts'}
          </button>
        </>
      )}
      <style jsx>{`
        .meeting-selector {
          padding: 1rem;
          background: #1a1a1a;
          border-radius: 8px;
          margin: 1rem 0;
        }
        .meeting-list {
          max-height: 300px;
          overflow-y: auto;
          margin: 1rem 0;
          border: 1px solid #333;
          border-radius: 4px;
        }
        .meeting-item {
          padding: 0.75rem;
          border-bottom: 1px solid #333;
        }
        .meeting-item:last-child {
          border-bottom: none;
        }
        .meeting-item label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
        }
        .meeting-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .meeting-title {
          font-weight: 500;
        }
        .meeting-info {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          font-size: 0.875rem;
          color: #888;
        }
        .meeting-date {
          color: #888;
        }
        .meeting-duration {
          color: #666;
        }
        .meeting-attendees {
          color: #666;
          font-size: 0.75rem;
        }
        .error {
          color: #ff4444;
          margin: 1rem 0;
          padding: 0.5rem;
          background: rgba(255, 68, 68, 0.1);
          border-radius: 4px;
        }
        .loading {
          text-align: center;
          padding: 1rem;
          color: #888;
        }
        .no-meetings {
          text-align: center;
          padding: 1rem;
          color: #888;
        }
        .load-button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .load-button:hover {
          background: #0060df;
        }
        .load-button:disabled {
          background: #444;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
