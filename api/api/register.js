// Register Guild Commands: /item, /craft, /drop
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const secret = (new URL(req.url, 'http://x')).searchParams.get('secret') || req.headers['x-secret'];
  if (!secret || secret !== process.env.REGISTER_SECRET)
    return res.status(403).json({ message: 'Forbidden' });

  const APP   = process.env.DISCORD_APPLICATION_ID;
  const GUILD = process.env.DISCORD_GUILD_ID;
  const TOKEN = process.env.DISCORD_BOT_TOKEN;

  const url = `https://discord.com/api/v10/applications/${APP}/guilds/${GUILD}/commands`;
  const defs = [
    { name:'item',  description:'ค้นหาไอเท็ม', type:1, options:[{type:3,name:'name',description:'ชื่อไอเท็ม',required:true}] },
    { name:'craft', description:'ดูวัสดุที่ต้องใช้คราฟต์', type:1, options:[{type:3,name:'name',description:'ชื่อไอเท็ม',required:true}] },
    { name:'drop',  description:'ดูแหล่งดรอป', type:1, options:[{type:3,name:'name',description:'ชื่อไอเท็ม',required:true}] }
  ];

  const r = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': `Bot ${TOKEN}`, 'Content-Type':'application/json' },
    body: JSON.stringify(defs)
  });
  const text = await r.text();
  if (!r.ok) return res.status(r.status).send(text);
  return res.json({ ok:true, result: JSON.parse(text) });
}
