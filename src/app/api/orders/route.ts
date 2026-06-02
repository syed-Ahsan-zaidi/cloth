import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, isAdmin } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const order = await db.insert(orders).values({
    id: body.id,
    status: "pending",
    customer: body.customer,
    items: body.items,
    paymentMethod: body.paymentMethod,
    subtotal: body.subtotal,
    shipping: body.shipping,
    total: body.total,
  }).returning();
  return NextResponse.json(order[0], { status: 201 });
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return NextResponse.json(allOrders);
}
