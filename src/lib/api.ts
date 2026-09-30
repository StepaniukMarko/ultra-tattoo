import { site } from './site';

export type LeadPayload = {
  name: string;
  phone?: string;
  telegram?: string;
  message?: string;
};

/**
 * Submits a lead to the existing Flask backend (/api/lead), which stores it
 * and forwards a Telegram notification. Returns true on success.
 * If NEXT_PUBLIC_API_BASE is not set, resolves false gracefully (no crash).
 */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  if (!site.apiBase) {
    // No backend configured (e.g. preview without env) — fail soft.
    return false;
  }
  try {
    const res = await fetch(`${site.apiBase.replace(/\/$/, '')}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return Boolean(data.success ?? res.ok);
  } catch {
    return false;
  }
}
