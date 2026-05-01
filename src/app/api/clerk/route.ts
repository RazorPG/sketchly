import { Webhook } from "svix"
import { headers } from "next/headers"
import { NextResponse, NextRequest } from "next/server"
import prisma from "@/config/prisma"

export async function POST(req: NextRequest) {
  try {
    const signingSecret = process.env.SIGNING_SECRET

    if (!signingSecret) {
      return NextResponse.json(
        { error: "Missing webhook signing secret" },
        { status: 500 }
      )
    }

    const wh = new Webhook(signingSecret)
    const headerPayload = await headers()

    const svixId = headerPayload.get("svix-id")
    const svixTimestamp = headerPayload.get("svix-timestamp")
    const svixSignature = headerPayload.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing required svix headers" },
        { status: 400 }
      )
    }

    // Verify webhook payload sent by Clerk
    const payload = await req.json()
    const body = JSON.stringify(payload)
    const verification = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { data: any; type: string }
    const { data, type } = verification

    switch (type) {
      case "user.created": {
        const email = data.email_addresses?.[0]?.email_address

        if (!email) {
          console.error("Email not found:", data)
          return new Response("Email missing", { status: 400 })
        }

        await prisma.user.create({
          data: {
            id: data.id,
            email: email,
            name: `${data.first_name || ""} ${data.last_name || ""}`,
            imageUrl: data.image_url,
          },
        })

        break
      }
      case "user.updated":
        await prisma.user.update({
          where: { id: data.id },
          data: {
            email: data.email_addresses?.[0]?.email_address,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            imageUrl: data.image_url,
          },
        })
        break
      case "user.deleted":
        await prisma.user.delete({ where: { id: data.id } })
        break
      default:
        console.log("Unhandled event type: ", type)
    }

    return NextResponse.json({ message: "Event received" })
  } catch (error) {
    console.error("Clerk webhook verification failed:", error)
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    )
  }
}
