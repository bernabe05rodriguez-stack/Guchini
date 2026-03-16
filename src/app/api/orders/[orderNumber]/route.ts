export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyAdminToken } from "@/lib/auth"

const VALID_STATUSES = ["pending", "paid", "preparing", "ready", "delivered", "cancelled"]

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const order = await prisma.order.findUnique({ where: { orderNumber: params.orderNumber }, include: { items: true } })
    if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

    return NextResponse.json({
      ...order, order_number: order.orderNumber, created_at: order.createdAt,
      estimated_wait_minutes: order.estimatedWaitMinutes,
      location: order.location,
      customer_name: order.customerName,
      order_items: order.items.map(i => ({ ...i, item_type: i.itemType, item_id: i.itemId, item_name: i.itemName, unit_price: i.unitPrice })),
    })
  } catch (error) {
    console.error("Order GET error:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value
    if (!adminToken) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    const admin = await verifyAdminToken(adminToken)
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const body = await request.json()
    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    const data = await prisma.order.update({ where: { orderNumber: params.orderNumber }, data: { status: body.status } })
    return NextResponse.json(data)
  } catch (error) {
    console.error("Order PATCH error:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
