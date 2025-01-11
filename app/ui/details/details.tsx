import { useState } from "react";
import styles from "./details.module.css";
import { Modal } from "@/app/ui/modal/modal";
import { Paginator } from "@/components/data/paginator";

function Property({ title, value, formatter }: any) {
  let formattedValue = value;

  if (typeof formatter === "function") {
    formattedValue = formatter(value);
  }

  return (
    <div className={styles.propertyBox}>
      <span className={styles.propertyName}>{title}</span>
      <span className={styles.propertyValue}>{formattedValue}</span>
    </div>
  );
}

interface ProductDetailsProps {
  product: any;
  onProductUpdated: (product: any) => void;
}
export const ProductDetails = ({
  product,
  onProductUpdated,
}: ProductDetailsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [meta, setMeta] = useState<any>({});

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

  const onImageChangeClick = () => {
    setIsModalOpen(true);
    fetchImages(1);
  };
  const onModalClose = () => {
    setIsModalOpen(false);
  };
  const onSelectImage = async (image: any) => {
    try {
      setIsModalOpen(false);

      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId: image.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product image");
      }
      const updatedProduct = await response.json();
      onProductUpdated(updatedProduct);
    } catch (error) {
      console.error("Error updating product image:", error);
    }
  };

  const category = product.category;
  const manufacturer = product.manufacturer;
  const supplier = product.supplier;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{product.name}</div>

      <div className={styles.content}>
        <div className={styles.imageBox}>
          {product.image && (
            <>
              <img src={product.image.href} />
              <span className={styles.changeImage} onClick={onImageChangeClick}>
                change image
              </span>
            </>
          )}
          {!product.image && (
            <span className={styles.changeImage} onClick={onImageChangeClick}>
              add image
            </span>
          )}
        </div>
        <div className={styles.propertyBoxes}>
          {category && <Property title="Category" value={category.name} />}
          {manufacturer && (
            <Property title="Manufacturer" value={manufacturer.name} />
          )}
          {product.manufacturerPartNo && (
            <Property
              title="Manufacturer Part No"
              value={product.manufacturerPartNo}
            />
          )}
          {supplier && <Property title="Supplier" value={supplier.name} />}
          {product.supplierPartNo && (
            <Property title="Supplier Part No" value={product.supplierPartNo} />
          )}
          {product.cost !== null && (
            <Property
              title="Cost"
              value={product.cost}
              formatter={(v: any) =>
                v === null || v === "" ? null : "£" + v.toFixed(2)
              }
            />
          )}
          <Property title="Qty In Stock" value={product.qtyInStock} />
          {product.location && (
            <Property title="Location" value={product.location} />
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image: any, index) => (
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
    </div>
  );
};
