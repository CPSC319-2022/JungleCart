import React, {useRef, useId} from "react";
import Image from "next/image";
import styles from "./ImageInput.module.css"

export const ImageInput = ({image, updateImage, required = false}) => {

  const photoId = useId()

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    if (!imageFile || !ALLOWED_TYPES.includes(imageFile.type)) {
      toast.error("Please upload a png, jpeg or jpg file")
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(imageFile)
    reader.onloadend = () => {
      const imagePreview = reader.result;
      updateImage({file: imageFile, preview: imagePreview, name: imageFile.name});
    }
  }

  return (
    <>
      <div className={styles.inputGroup}>
        <div className={styles.label}>Photo</div>
        <div className={styles.inputContainer}>
          <input className={styles.fileInput} type="file" id={photoId} onChange={handleImageChange}/>
          <label htmlFor={photoId} tabIndex="0">Upload</label>
          <span className={styles.textHolder}>{image? (image.name || "Product Image") : "Upload Photo"}</span>
        </div>
      </div>
      <div className={styles.imagePreview}>{
        image ?
          <Image src={image.preview || image.url} fill style={{objectFit: "cover"}} alt="Product" />
          :
          <p>Image Preview</p>
      }</div>
    </>
  )
}