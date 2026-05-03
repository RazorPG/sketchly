"use client"

import {
  Button,
  Description,
  Dropdown,
  Header,
  Label,
  Modal,
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
    kindModal,
    setKindModal,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    inputRef,
    submitRename,
  } = useHomeWorkspaceItem(title, id)

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
        <div className="flex flex-col text-left w-full mr-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={submitRename}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  submitRename()
                } else if (e.key === "Escape") {
                  setEditTitle(title)
                  setIsEditing(false)
                }
              }}
              className="text-lg font-medium text-gray-900 border-b border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent mb-[2px]"
            />
          ) : (
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {title}
            </h3>
          )}
          <p className="text-sm text-gray-500">
            {new Date(updateAt).toLocaleDateString()}
          </p>
        </div>

        {!isEditing && (
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
                      setIsEditing(true)
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
        )}
      </div>

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
                      handleDeleteWorkspace()
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
