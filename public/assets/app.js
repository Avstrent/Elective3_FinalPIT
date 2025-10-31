const rfidsBody = document.getElementById('rfids-body');
const logsBody = document.getElementById('logs-body');
const liveUpdates = document.getElementById('live-updates');

async function fetchRFIDs() {
  const res = await fetch('/api/rfids');
  const data = await res.json();
  renderRFIDs(data);
}

function renderRFIDs(items) {
  rfidsBody.innerHTML = '';
  items.forEach(row => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <th scope="row"><code>${row.uid}</code></th>
      <td>
        <input
          class="form-control form-control-sm owner-input"
          data-uid="${row.uid}"
          value="${row.owner || ''}"
          aria-label="Owner name for UID ${row.uid}"
        />
      </td>
      <td class="text-center">
        <div class="form-check form-switch d-inline-block">
          <input
            class="form-check-input status-toggle"
            type="checkbox"
            role="switch"
            id="sw-${row.uid}"
            ${checked}
            data-uid="${row.uid}"
            aria-label="Toggle active status for UID ${row.uid}"
          >
          <label class="form-check-label" for="sw-${row.uid}">${checked ? '1' : '0'}</label>
        </div>
      </td>
    `;
    rfidsBody.appendChild(tr);
  });

  rfidsBody.querySelectorAll('.status-toggle').forEach(el => {
    el.addEventListener('change', async (e) => {
      const uid = e.target.dataset.uid;
      const active = e.target.checked ? 1 : 0;
      await fetch(`/api/rfids/${encodeURIComponent(uid)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ active })
      });
      const label = e.target.closest('.form-switch').querySelector('.form-check-label');
      if (label) label.textContent = active ? '1' : '0';
      if (liveUpdates) liveUpdates.textContent = `RFID ${uid} status set to ${active}.`;
    });
  });

  rfidsBody.querySelectorAll('.owner-input').forEach(el => {
    el.addEventListener('change', async (e) => {
      const uid = e.target.dataset.uid;
      const owner = e.target.value;
      await fetch(`/api/rfids/${encodeURIComponent(uid)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ owner })
      });
      if (liveUpdates) liveUpdates.textContent = `Owner for UID ${uid} updated.`;
    });
  });
}

async function fetchLogs() {
  const res = await fetch('/api/logs?limit=100');
  const data = await res.json();
  renderLogs(data);
}

function renderLogs(items) {
  logsBody.innerHTML = '';
  items.forEach(row => {
    const tr = document.createElement('tr');
    const tsIso = row.ts || '';
    tr.innerHTML = `
      <th scope="row" class="text-muted">${row.id}</th>
      <td><code>${row.uid}</code></td>
      <td>${Number(row.status) === 1 ? '<span class="badge text-bg-success">1</span>' : '<span class="badge text-bg-danger">0</span>'}</td>
      <td><time datetime="${tsIso}">${tsIso}</time></td>
    `;
    logsBody.appendChild(tr);
  });
}

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const uid = document.getElementById('uid').value.trim();
  const owner = document.getElementById('owner').value.trim();
  if (!uid) return;
  const res = await fetch('/api/rfids', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ uid, owner, active: 1 })
  });
  if (res.ok) {
    document.getElementById('uid').value = '';
    document.getElementById('owner').value = '';
    await fetchRFIDs();
    if (liveUpdates) liveUpdates.textContent = `RFID ${uid} added.`;
  } else {
    const msg = await res.json().catch(() => ({}));
    alert('Add failed: ' + (msg.error || res.statusText));
  }
});

document.getElementById('refresh-logs').addEventListener('click', fetchLogs);


function connectSSE() {
  const es = new EventSource('/api/stream');
  es.addEventListener('ping', () => {});
  es.addEventListener('rfids', async (e) => {
    if (liveUpdates) liveUpdates.textContent = 'RFID list updated.';
    await fetchRFIDs();
  });
  es.addEventListener('logs', async (e) => {
    try {
      const data = JSON.parse(e.data || '{}');
      if (liveUpdates && data && data.uid !== undefined && data.status !== undefined) {
        liveUpdates.textContent = `New scan: UID ${data.uid} -> ${data.status}.`;
      }
    } catch (_) { }
    await fetchLogs();
  });
  es.onerror = () => {
    es.close();
    setTimeout(connectSSE, 2000);
  };
}

(async function init() {
  await fetchRFIDs();
  await fetchLogs();
  connectSSE();
})();
