import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/modal/Modal";
import { Paginator } from "@/components/data/paginator";
import { Image } from "@/types/entities";
import { Meta } from "@/types/pagination";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: Image) => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [meta, setMeta] = useState<Meta>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const fetchImages = async (page: number) => {
    try {
      const response = await fetch(`/api/images?page=${page}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setImages(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages(1); // page 1
    }
  }, [isOpen]);

  return (
    <Modal isVisible={isOpen} onClose={onClose} showCloseCross>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image: Image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.href}
              alt={image.name}
              className="w-full h-32 object-cover rounded-lg cursor-pointer"
              onClick={() => onSelectImage(image)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="text-white font-bold">{image.name}</span>
            </div>
          </div>
        ))}
      </div>
      <Paginator
        totalItems={meta.totalItems}
        itemsPerPage={meta.pageSize}
        currentPage={meta.currentPage}
        onPageChange={fetchImages}
      />
    </Modal>
  );
};

export default ImageGalleryModal;
