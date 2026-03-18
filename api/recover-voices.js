// Vercel Serverless Function — List and fetch voice files from GitHub repo
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not set' });

  const repo = 'diegoaroca33/toki-app';
  const { folder } = req.query; // e.g. "diego"
  if (!folder) return res.status(400).json({ error: 'folder param required' });

  const path = `public/audio/voices/${folder}`;
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const listRes = await fetch(url, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (!listRes.ok) return res.status(404).json({ error: 'Folder not found' });
    
    const files = await listRes.json();
    if (!Array.isArray(files)) return res.status(404).json({ error: 'Not a folder' });

    // Fetch each file's content
    const voices = {};
    for (const file of files) {
      if (!file.name.endsWith('.webm')) continue;
      const fileRes = await fetch(file.url, {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
      });
      if (fileRes.ok) {
        const data = await fileRes.json();
        const key = file.name.replace('.webm', '');
        voices[key] = `data:audio/webm;base64,${data.content.replace(/\n/g, '')}`;
      }
    }

    return res.status(200).json({ ok: true, folder, voices, count: Object.keys(voices).length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
