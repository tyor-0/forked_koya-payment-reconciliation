const ACCESS_KEY = process.env.POSITIONSTACK_KEY; 

async function getAddress(lat, lng) {

  const url = `http://api.positionstack.com/v1/reverse?access_key=${ACCESS_KEY}&query=${lat},${lng}&limit=1`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.error) throw new Error(`${json.error.code}: ${json.error.message}`);
  if (!json.data || json.data.length === 0) return null;

  const first = json.data[0];
  // `label` is Positionstack's pre-formatted full address
  return first.label || [first.name, first.street, first.locality, first.region, first.country]
    .filter(Boolean).join(", ");
}

getAddress(6.4410, 3.5357)
  .then(addr => console.log("Full address:", addr ?? "No result found"))
  .catch(err => console.error("Error:", err.message));