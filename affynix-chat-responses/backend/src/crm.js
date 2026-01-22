export async function create_contact(data) {
  return { success: true, contact_id: "cnt_123", data };
}

export async function add_notes_to_contact(data) {
  return { success: true, data };
}

export async function schedule_appointment(data) {
  return { success: true, appointment_id: "apt_456", data };
}

export async function update_appointment(data) {
  return { success: true, data };
}

export async function sendIntakeToApix(data) {
  return { success: true, data };
}

function escapeAirtableFormulaValue(value) {
  return String(value ?? "").replace(/'/g, "\\'");
}

function buildAirtableFields(payload) {
  const fields = {};
  if (!payload || typeof payload !== "object") {
    return fields;
  }
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) {
      fields[key] = value;
    }
  }
  return fields;
}

export async function airtable_upsert_contact(payload) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_CONTACTS || "Contacts";
  const emailField = process.env.AIRTABLE_CONTACT_EMAIL_FIELD || "email";

  if (!apiKey || !baseId) {
    console.warn("[Airtable] Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID - skipping upsert.");
    return { skipped: true };
  }

  const email = payload?.email ? String(payload.email).trim() : "";
  if (!email) {
    return { error: "Missing email for Airtable upsert." };
  }

  const baseUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  const filterByFormula = encodeURIComponent(`{${emailField}}='${escapeAirtableFormulaValue(email)}'`);
  const searchUrl = `${baseUrl}?maxRecords=1&filterByFormula=${filterByFormula}`;

  const searchRes = await fetch(searchUrl, { headers });
  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    throw new Error(`Airtable lookup failed: ${searchRes.status} ${errorText}`);
  }

  const searchData = await searchRes.json();
  const existingRecord = Array.isArray(searchData.records) ? searchData.records[0] : null;
  const fields = buildAirtableFields(payload);
  const body = JSON.stringify({ fields });

  if (existingRecord?.id) {
    const updateRes = await fetch(`${baseUrl}/${existingRecord.id}`, {
      method: "PATCH",
      headers,
      body
    });
    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      throw new Error(`Airtable update failed: ${updateRes.status} ${errorText}`);
    }
    const updated = await updateRes.json();
    return { success: true, action: "updated", recordId: updated.id, record: updated };
  }

  const createRes = await fetch(baseUrl, {
    method: "POST",
    headers,
    body
  });
  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Airtable create failed: ${createRes.status} ${errorText}`);
  }
  const created = await createRes.json();
  return { success: true, action: "created", recordId: created.id, record: created };
}
