import React from 'react'
import imageCompression from 'browser-image-compression'
import { ReactComponent as Upload } from 'assets/icons/upload.svg'
import { IconButton, VisuallyHidden } from '@chakra-ui/core'

const options = {
  maxSizeMB: 3.0,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'jpg'
}

interface IImageFile {
  label: string
  value: string | null
  onChange: (value: string | null) => void
}

const ImageFile: React.FC<IImageFile> = (props) => {
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const imageFile = event.target.files[0]
    const isBiggerThanMaxSize = imageFile.size > options.maxSizeMB * 1024 * 1024

    try {
      const compressedImage = isBiggerThanMaxSize
        ? await imageCompression(imageFile, options)
        : imageFile

      const imageData = await imageCompression.getDataUrlFromFile(compressedImage)

      props.onChange(imageData.split('base64,')[1])
    } catch (e) {
      // do something
    }
  }

  return (
    <div>
      <VisuallyHidden
        as="input"
        // @ts-ignore
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        id="imageFile"
        data-testid="upload_img"
        onChange={handleChange}
      />
      <IconButton
        as="label"
        htmlFor="imageFile"
        aria-label={props.label}
        variant="ghost"
        isRound={true}
        size="sm"
        icon={<Upload style={{ width: '20px' }} />}
        cursor="pointer"
      />
    </div>
  )
}

export default ImageFile
