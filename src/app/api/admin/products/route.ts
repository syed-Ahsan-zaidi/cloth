import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/db";
import { adminProducts, hiddenProducts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const [dbProds, hidden] = await Promise.all([
    db.select().from(adminProducts).orderBy(desc(adminProducts.createdAt)),
    db.select().from(hiddenProducts),
  ]);
  const hiddenIds = new Set(hidden.map((h) => h.id));
  return NextResponse.json({ dbProducts: dbProds, hiddenIds: [...hiddenIds] });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  // Hide a static product
  if (body.action === "hide") {
    await db.insert(hiddenProducts).values({ id: body.id }).onConflictDoNothing();
    return NextResponse.json({ success: true });
  }

  // Add new product (or override static product with same ID)
  const id = body.id || `PROD-${Date.now()}`;
  const values = {
    id,
    name: body.name,
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
    images: body.images.filter(Boolean),
    category: body.category,
    colors: body.colors.filter(Boolean),
    sizes: body.sizes.filter(Boolean),
    description: body.description,
    inStock: body.inStock ?? true,
    isNew: body.isNew ?? false,
    isFeatured: body.isFeatured ?? false,
  };

  const product = await db.insert(adminProducts).values(values)
    .onConflictDoUpdate({ target: adminProducts.id, set: values })
    .returning();

  return NextResponse.json(product[0], { status: 201 });
}
