"use client"

import {
  Button,
  Description,
  Dropdown,
  Header,
  Input,
  Label,
  Modal,
  Surface,
  TextField,
} from "@heroui/react"
import Link from "next/link"
import { BiPencil, BiTrash } from "react-icons/bi"
import { FiImage, FiMoreHorizontal, FiTrash2 } from "react-icons/fi"
import useHomeWorkspaceItem from "./useHomeWorkspaceItem"

interface Props {
  title: string
  id: string
  updateAt: Date
}

function HomeWorkspaceItem({ title, id, updateAt }: Props) {
  const {
    handleDeleteWorkspace,
    isOpenModal,
    setIsOpenModal,
    handleRenameWorkspace,
    kindModal,
    setKindModal,
  } = useHomeWorkspaceItem()

  return (
    <div
      suppressHydrationWarning
      className="flex flex-col items-start justify-between border-2 border-gray-200 rounded-xl overflow-hidden w-full h-56"
    >
      <Link
        href={`/workspace/${id}`}
        className="w-full h-full flex items-center justify-center bg-gray-50 cursor-pointer"
      >
        <FiImage className="text-4xl text-gray-300" />
      </Link>
      <div className="flex items-center justify-between w-full border-t border-gray-200 p-4">
        <div className="flex flex-col text-left">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">
            {new Date(updateAt).toLocaleDateString()}
          </p>
        </div>

        <Dropdown>
          <Button
            aria-label="Menu"
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            variant="ghost"
          >
            <FiMoreHorizontal className="text-lg" />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Section>
                <Header>Actions</Header>
                <Dropdown.Item
                  id="edit-file"
                  textValue="Edit file"
                  onAction={() => {
                    setIsOpenModal(true)
                    setKindModal("rename")
                  }}
                >
                  <div className="flex h-8 items-start justify-center pt-px">
                    <BiPencil className="size-4 shrink-0 text-muted" />
                  </div>
                  <div className="flex flex-col">
                    <Label>Rename</Label>
                    <Description>Rename workspace</Description>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item
                  id="delete-file"
                  textValue="Delete file"
                  variant="danger"
                  onAction={() => {
                    setIsOpenModal(true)
                    setKindModal("delete")
                  }}
                >
                  <div className="flex h-8 items-start justify-center pt-px">
                    <BiTrash className="size-4 shrink-0 text-danger" />
                  </div>
                  <div className="flex flex-col">
                    <Label>Delete workspace</Label>
                    <Description>Move to trash</Description>
                  </div>
                </Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>

      {/* modal rename workspace */}
      {kindModal === "rename" && (
        <Modal isOpen={isOpenModal} onOpenChange={() => setIsOpenModal(false)}>
          <Modal.Backdrop>
            <Modal.Container placement="auto">
              <Modal.Dialog className="sm:max-w-md">
                <Modal.CloseTrigger />
                <Modal.Body className="p-6">
                  <Surface variant="default">
                    <form
                      id="rename-form"
                      className="flex flex-col gap-4"
                      onSubmit={e => {
                        setIsOpenModal(false)

                        const form = e.currentTarget
                        const input = form.elements.namedItem(
                          "name"
                        ) as HTMLInputElement
                        const newTitle = input.value

                        handleRenameWorkspace(id, newTitle)
                      }}
                    >
                      <TextField
                        className="w-full"
                        name="name"
                        type="text"
                        defaultValue={title}
                      >
                        <Label>Rename</Label>
                        <Input placeholder="rename workspace" />
                      </TextField>
                    </form>
                  </Surface>
                </Modal.Body>
                <Modal.Footer>
                  <Button slot="close" variant="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" form="rename-form">
                    Save
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* modal delete workspace */}
      {kindModal === "delete" && (
        <Modal isOpen={isOpenModal} onOpenChange={() => setIsOpenModal(false)}>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-90">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Icon className="bg-default text-foreground">
                    <FiTrash2 className="size-5" />
                  </Modal.Icon>
                  <Modal.Heading>Removing Workspace</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure you want to remove this workspace?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onPress={() => setIsOpenModal(false)}
                    variant="secondary"
                  >
                    Close
                  </Button>
                  <Button
                    onPress={() => {
                      handleDeleteWorkspace(id)
                      setIsOpenModal(false)
                    }}
                    variant="danger-soft"
                  >
                    Remove Workspace
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </div>
  )
}

export default HomeWorkspaceItem
