import { useState, useEffect } from "react";

export interface TelemetryMessage {
  sector: string;
  event: string;
  timestamp: number;
  payload: Record<string, any>;
}

export function useCampaignStream(campaignId: string | null) {
  const [events, setEvents] = useState<TelemetryMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    let eventSource: EventSource | null = null;
    let lastEventId = "0-0";

    function connect() {
      eventSource = new EventSource("/api/streaming?campaignId=" + campaignId + "&lastEventId=" + lastEventId);

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          lastEventId = event.lastEventId || lastEventId;
          const parsed: TelemetryMessage = JSON.parse(event.data);
          setEvents((prev) => [...prev, parsed]);
        } catch (parseErr) {
          console.error("Failed to parse telemetry event", parseErr);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        setError("Connection lost. Reconnecting...");
        eventSource?.close();
        setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      eventSource?.close();
      setIsConnected(false);
    };
  }, [campaignId]);

  return { events, isConnected, error };
}