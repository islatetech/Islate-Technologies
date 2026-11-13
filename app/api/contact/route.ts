import { NextResponse } from "next/server";

/**
 * Demo contact and quote endpoint. Validates the message and acknowledges it.
 * Connect an email provider or CRM here when the site goes live.
 */
export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();
    const hasContact = /^\S+@\S+\.\S+$/.test(email ?? "") || String(phone ?? "").replace(/\D/g, "").length >= 10;
    if (!name?.trim() || !hasContact || !message?.trim()) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
