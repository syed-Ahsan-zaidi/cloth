import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

const ADMIN_EMAIL = "ahsanzaidi51272@gmail.com";
const SECRET = process.env.NEXTAUTH_SECRET || "clothhaus-secret-key-change-in-production";

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
  const token = await getToken({ req, secret: SECRET });

  if (!token?.email || token.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return NextResponse.json(allOrders);
}
