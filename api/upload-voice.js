// Vercel Serverless Function — Upload voice recording to GitHub repo
// Requires GITHUB_TOKEN env var in Vercel settings
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not set' });

  const { path, content, message } = req.body;
  if (!path || !content) return res.status(400).json({ error: 'path and content required' });

  const repo = 'diegoaroca33/toki-app';
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    // Check if file exists (to get sha for update)
    let sha = null;
    try {
      const existing = await fetch(url, {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
      });
      if (existing.ok) {
        const data = await existing.json();
        sha = data.sha;
      }
    } catch (e) { /* file doesn't exist, that's fine */ }

    // Create or update file
    const body = {
      message: message || `Add voice: ${path}`,
      content: content, // base64 encoded
      branch: 'main'
    };
    if (sha) body.sha = sha;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      return res.status(200).json({ ok: true, path });
    } else {
      const err = await response.json();
      return res.status(response.status).json({ error: err.message || 'GitHub error' });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
