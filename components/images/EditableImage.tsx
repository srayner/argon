import React, { useState } from "react";
import { Image } from "@/types/entities";
import ImageGalleryModal from "./ImageGalleryModal";

interface EditableImageProps {
  image?: Image;
  onImageChange: (newImage: Image) => void;
}

const EditableImage: React.FC<EditableImageProps> = ({ image, onImageChange }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const updateImage = (image: Image) => {
    setIsModalOpen(false);
    onImageChange(image);
  };

  return (
    <>
      <div className="text-sm">
        {image ? (
          <div>
            <img src={image.href} alt={image.name} className="w-full h-auto" />
            <button onClick={showModal} className="text-blue-500 underline">
              change Image
            </button>
          </div>
        ) : (
          <button onClick={showModal} className="text-blue-500 underline">
            add Image
          </button>
        )}
      </div>
      <ImageGalleryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSelectImage={updateImage}
      />
    </>
  );
};

export default EditableImage;
