// Reverse geocoding using OpenStreetMap Nominatim (Free, no API key required)

async function getAddress(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  // Nominatim usage policy requires a custom User-Agent header
  const res = await fetch(url, {
    headers: {
      "User-Agent": "KoyaPaymentReconciliation/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();

  if (json.error) {
    throw new Error(json.error);
  }

  // json.display_name contains the full formatted address string
  return json.display_name || null;
}

// Example usage
getAddress(6.4410, 3.5357)
  .then((addr) => console.log("Full address:", addr ?? "No result found"))
  .catch((err) => console.error("Error:", err.message));
