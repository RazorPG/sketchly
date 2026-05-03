import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/config/prisma"

// create a new workspace
export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const workspace = await prisma.workspace.create({
      data: { ownerId: userId, strokes: {} },
    })

    return NextResponse.json(workspace)
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating workspace" },
      { status: 500 }
    )
  }
}

// get all workspaces of current user
export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")

    const where: any = { ownerId: userId }
    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      }
    }

    const workspaces = await prisma.workspace.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(workspaces)
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting workspaces" },
      { status: 500 }
    )
  }
}
