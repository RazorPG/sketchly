import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/config/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id: workspaceId } = await params

    const workspace = await prisma.workspace.findUnique({
      where: { id_ownerId: { ownerId: userId, id: workspaceId } },
    })

    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(workspace, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching workspace" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id: workspaceId } = await params

    const { strokes, history } = await req.json()
    if (strokes === undefined && history === undefined) {
      return NextResponse.json(
        { message: "No update data provided" },
        { status: 400 }
      )
    }

    const data: any = {}
    if (strokes !== undefined) data.strokes = strokes
    if (history !== undefined) data.history = history

    const workspace = await prisma.workspace.update({
      where: { id_ownerId: { ownerId: userId, id: workspaceId } },
      data,
    })

    return NextResponse.json(
      { message: "Workspace updated successfully", workspace },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating workspace" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id: workspaceId } = await params
    await prisma.workspace.delete({
      where: { id_ownerId: { ownerId: userId, id: workspaceId } },
    })

    return NextResponse.json(
      { message: "Workspace deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting workspace" },
      { status: 500 }
    )
  }
}
