import React, {useState} from "react"
import imageCompression from "browser-image-compression"
import classes from "./ImageFile.module.css"
import HideVisually from "core/components/HideVisually"
import {ReactComponent as Upload} from "assets/icons/upload.svg"

const options = {
  maxSizeMB: 3.0,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};

interface IImageFile {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

const ImageFile: React.FC<IImageFile> = props => {
  const [error, setError] = useState<any>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const imageFile = event.target.files[0];
    const isBiggerThanMaxSize =
      imageFile.size > options.maxSizeMB * 1024 * 1024;

    try {
      const compressedImage = isBiggerThanMaxSize
        ? await imageCompression(imageFile, options)
        : imageFile;
      const imageData = await imageCompression.getDataUrlFromFile(
        compressedImage
      );

      props.onChange(imageData.split("base64,")[1]);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  return (
    <label htmlFor="imageFile" className={classes.label}>
      <span className={classes.icon}>
        <Upload aria-hidden={true} />
      </span>
      {props.label}
      <HideVisually>
        <input
          type="file"
          accept="image/jpeg"
          id="imageFile"
          onChange={handleChange}
        />
      </HideVisually>
    </label>
  );
};

export default ImageFile;
