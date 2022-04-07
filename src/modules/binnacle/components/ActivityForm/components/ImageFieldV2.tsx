import { Box, Flex, IconButton, Text, useColorModeValue } from '@chakra-ui/react'
import imageCompression from 'browser-image-compression'
import { ExternalLinkIcon, TrashIcon } from '@heroicons/react/outline'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import { openImageInTab } from 'modules/binnacle/components/ActivityForm/utils/open-image-in-tab'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import type { Ref } from 'react'
import { forwardRef, useState } from 'react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { useDropzone } from 'react-dropzone'

const compressionOptions = {
  maxSizeMB: 3.0,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'jpg'
}

interface Props {
  gridArea: string
  control: Control<ActivityFormSchema>
  setImageValue: (value: string | null) => void
}

/* eslint-disable  @typescript-eslint/no-unused-vars */
function ImageField(props: Props, ref: Ref<HTMLInputElement>) {
  const { t } = useTranslation()
  const value = useWatch({ control: props.control, name: 'imageBase64' })
  const { activity } = useGlobalState(ActivityFormState)

  const [hasImage, setHasImage] = useState(() => {
    if (activity?.hasImage && value === null) {
      return true
    } else {
      return value !== null
    }
  })

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDropAccepted: async (files) => {
      const imageFile = files[0]
      const isBiggerThanMaxSize = imageFile.size > compressionOptions.maxSizeMB * 1024 * 1024

      try {
        const compressedImage = isBiggerThanMaxSize
          ? await imageCompression(imageFile, compressionOptions)
          : imageFile

        const imageData = await imageCompression.getDataUrlFromFile(compressedImage)
        addImage(imageData.split('base64,')[1])
      } catch (e) {
        // do something
      }
    },
    maxFiles: 1,
    disabled: hasImage
  })

  const openImage = async () => {
    if (value !== null) {
      openImageInTab(value)
    }
  }

  const addImage = (imageValue: string | null) => {
    props.setImageValue(imageValue)
    setHasImage(true)
  }

  const removeImage = () => {
    props.setImageValue(null)
    setHasImage(false)
  }

  const bgColor = useColorModeValue('gray.100', 'gray.600')
  const iconColor = useColorModeValue('black', 'white')

  return (
    <Box gridArea={props.gridArea}>
      <Flex align="start">
        <Text as="span" mr="10px">
          {t('activity_form.image')}
        </Text>
        <Flex
          direction="column"
          align="center"
          justify="center"
          sx={{
            w: 'full',
            h: '52px',
            p: 2,
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: bgColor,
            borderRadius: '2px',
            transition: 'border 0.24s ease-in-out'
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} data-testid="upload_img" />
          {!hasImage ? (
            <Text color="gray.500">{t('activity_form.image_upload')}</Text>
          ) : (
            <Flex align="center">
              {hasImage && (
                <IconButton
                  data-testid="open-image"
                  onClick={openImage}
                  variant="ghost"
                  isRound={true}
                  size="sm"
                  aria-label={t('activity_form.image_open_button')}
                  icon={<ExternalLinkIcon style={{ width: '20px' }} />}
                  colorScheme="blackAlpha"
                  color={iconColor}
                />
              )}
              {hasImage && (
                <IconButton
                  data-testid="delete-image"
                  onClick={removeImage}
                  variant="ghost"
                  isRound={true}
                  size="sm"
                  aria-label={t('activity_form.image_delete_button')}
                  icon={<TrashIcon style={{ width: '20px' }} />}
                  colorScheme="blackAlpha"
                  color={iconColor}
                />
              )}
              {acceptedFiles.map((file, index) => (
                <Text key={index}>{file.name}</Text>
              ))}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default forwardRef(ImageField)
