import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/db";
import { adminProducts, hiddenProducts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await db.delete(adminProducts).where(eq(adminProducts.id, id));
  await db.delete(hiddenProducts).where(eq(hiddenProducts.id, id));
  return NextResponse.json({ success: true });
}
