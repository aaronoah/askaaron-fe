let source: EventSource | null = null;

self.onmessage = function (event) {
    // const eventSource = new EventSource(`${baseUrl}/conversation?session_id=${sessionId}`);
  if (event.data.type === 'start') {
    const url = event.data.url;
    source = new EventSource(url);

    source.onmessage = (e) => {
      self.postMessage({ type: 'message', data: e.data });
    };

    source.onerror = (e) => {
      self.postMessage({ type: 'error', error: e });
    };

    source.addEventListener("end", () => {
      source ? source.close() : null;
    });
  }

  if (event.data.type === 'stop' && source) {
    source.close();
    self.postMessage({ type: 'closed' });
  }
};