import axios from 'axios';

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

type AirtableCreateResponse = {
  records: Array<{
    id: string;
    createdTime: string;
    fields: Record<string, unknown>;
  }>;
};

function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeFields(fields: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value !== undefined)
  );
}

export async function createAirtableRecord({
  baseId,
  table,
  fields,
  typecast = true,
}: {
  baseId?: string;
  table?: string;
  fields: Record<string, unknown>;
  typecast?: boolean;
}) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    throw new Error('fields must be a non-empty object');
  }

  const normalizedFields = normalizeFields(fields);
  if (Object.keys(normalizedFields).length === 0) {
    throw new Error('fields must include at least one defined value');
  }

  const resolvedBaseId = requireEnv('AIRTABLE_BASE_ID', baseId ?? process.env.AIRTABLE_BASE_ID);
  const resolvedTable = requireEnv('AIRTABLE_TABLE_NAME', table ?? process.env.AIRTABLE_TABLE_NAME);
  const apiKey = requireEnv('AIRTABLE_API_KEY', process.env.AIRTABLE_API_KEY);

  const url = `${AIRTABLE_API_URL}/${resolvedBaseId}/${encodeURIComponent(resolvedTable)}`;

  const response = await axios.post<AirtableCreateResponse>(
    url,
    {
      records: [{ fields: normalizedFields }],
      typecast,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    }
  );

  const record = response.data?.records?.[0];
  if (!record) {
    throw new Error('Airtable response did not include a record');
  }

  return {
    id: record.id,
    createdTime: record.createdTime,
    fields: record.fields,
  };
}
