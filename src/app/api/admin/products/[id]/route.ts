import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/db";
import { adminProducts, hiddenProducts } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "ahsanzaidi51272@gmail.com";
const SECRET = process.env.NEXTAUTH_SECRET || "clothhaus-secret-key-change-in-production";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: SECRET });
  if (token?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await db.update(adminProducts).set({
    name: body.name,
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
    images: body.images.filter(Boolean),
    category: body.category,
    colors: body.colors,
    sizes: body.sizes,
    description: body.description,
    inStock: body.inStock,
    isNew: body.isNew,
    isFeatured: body.isFeatured,
  }).where(eq(adminProducts.id, id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: _req, secret: SECRET });
  if (token?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  // DB product — permanently delete
  await db.delete(adminProducts).where(eq(adminProducts.id, id));
  // Also remove from hidden if exists
  await db.delete(hiddenProducts).where(eq(hiddenProducts.id, id));
  return NextResponse.json({ success: true });
}
