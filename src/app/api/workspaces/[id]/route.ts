import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/config/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id: workspaceId } = await params

    const body = await req.json()
    const workspace = await prisma.workspace.update({
      where: { ownerId: userId, id: workspaceId },
      data: body,
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
      where: { ownerId: userId, id: workspaceId },
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
