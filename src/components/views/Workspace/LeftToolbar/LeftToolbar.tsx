"use client"

import { FiEdit2, FiTrash2, FiDownload } from "react-icons/fi"
import { FaRegHandPaper } from "react-icons/fa"
import { BsEraser } from "react-icons/bs"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Slider,
  Label,
  Modal,
  Button,
} from "@heroui/react"
import useLeftToolbar from "./useLeftToolbar"

export default function fLeftToolbar() {
  const {
    activeTool,
    setTool,
    strokeColor,
    handleColorChange,
    strokeWidth,
    setStrokeWidth,
    clearCanvas,
    downloadAsJpeg,
    isOpenModal,
    setIsOpenModal,
  } = useLeftToolbar()

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-2 flex flex-col items-center gap-3 w-15 z-10">
      {/* Tools */}
      <button
        suppressHydrationWarning
        onClick={() => setTool("pen")}
        className={`p-2 hover:text-gray-800 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors ${
          activeTool === "pen"
            ? "bg-blue-50 text-blue-600"
            : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        }`}
      >
        <FiEdit2 className="text-lg" />
      </button>

      <button
        suppressHydrationWarning
        onClick={() => setTool("eraser")}
        className={`p-2 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer ${activeTool === "eraser" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
      >
        <BsEraser className="text-lg" />
      </button>

      <button
        suppressHydrationWarning
        onClick={() => setTool("hand")}
        className={`p-2 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer ${activeTool === "hand" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
      >
        <FaRegHandPaper className="text-lg" />
      </button>

      <div className="w-6 border-b border-gray-200 my-1"></div>

      {/* Properties */}
      <div className="relative w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer overflow-hidden group">
        <input
          type="color"
          value={strokeColor}
          onChange={handleColorChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title="Change color"
        />
        <div
          className="w-6 h-6 border border-gray-300 shadow-sm pointer-events-none group-hover:scale-110 transition-transform shrink-0"
          style={{ backgroundColor: strokeColor }}
        ></div>
      </div>

      <Popover>
        <PopoverTrigger suppressHydrationWarning>
          <button
            suppressHydrationWarning
            className="p-2 w-full flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Change brush size"
          >
            <div
              className="rounded-full transition-all"
              style={{
                width: 20,
                height: 20,
                backgroundColor: strokeColor,
              }}
            ></div>
          </button>
        </PopoverTrigger>
        <PopoverContent placement="right">
          <div className="px-4 py-3 w-48">
            <Slider
              aria-label="Brush size"
              step={1}
              minValue={1}
              maxValue={32}
              defaultValue={8}
              value={strokeWidth}
              onChange={value => setStrokeWidth(value as number)}
              className="max-w-md"
            >
              <Label>Brush Size</Label>
              <Slider.Output />
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-6 border-b border-gray-200 my-1"></div>

      <button
        suppressHydrationWarning
        onClick={() => setIsOpenModal(true)}
        className="p-2 text-gray-500 bg-transparent hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
      >
        <FiTrash2 className="text-lg" />
      </button>

      <button
        suppressHydrationWarning
        onClick={downloadAsJpeg}
        title="Download drawing"
        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
      >
        <FiDownload className="text-lg" />
      </button>

      {/* modal action clear canvas */}
      <Modal isOpen={isOpenModal} onOpenChange={() => setIsOpenModal(false)}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-90">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Icon className="bg-default text-foreground">
                  <FiTrash2 className="size-5" />
                </Modal.Icon>
                <Modal.Heading>Clear Canvas</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Apakah Anda yakin ingin menghapus semua coretan?{" "}
                  <span className="font-semibold text-red-600">
                    Aksi ini tidak dapat dibatalkan.
                  </span>
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onPress={() => setIsOpenModal(false)}
                  variant="secondary"
                >
                  Batal
                </Button>
                <Button
                  onPress={() => {
                    clearCanvas()
                    setIsOpenModal(false)
                  }}
                  variant="danger-soft"
                >
                  Hapus Semua
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  )
}
