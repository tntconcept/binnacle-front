import { Flex, IconButton, Spinner, Text, VisuallyHidden } from '@chakra-ui/react'
import imageCompression from 'browser-image-compression'
import { ExternalLinkIcon, TrashIcon, UploadIcon } from '@heroicons/react/outline'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import { openImageInTab } from 'modules/binnacle/components/ActivityForm/utils/open-image-in-tab'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import React, { forwardRef, useState } from 'react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { useShowErrorNotification } from 'shared/components/Notifications/useShowErrorNotification'
import { container } from 'tsyringe'
import { ACTIVITY_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'
import type { ActivityRepository } from 'modules/binnacle/data-access/interfaces/activity-repository'

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

function ImageField(props: Props) {
  const { t } = useTranslation()
  const value = useWatch({ control: props.control, name: 'imageBase64' })

  const { activity } = useGlobalState(ActivityFormState)
  const showErrorNotification = useShowErrorNotification()
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  const [hasImage, setHasImage] = useState(() => {
    if (activity?.hasEvidence && value === null) {
      return true
    } else {
      return value !== null
    }
  })

  const openImage = async () => {
    // user added an image
    if (value !== null) {
      openImageInTab(value)

      // the activity has image, we need to download it
    } else if (activity?.hasEvidence) {
      try {
        setIsLoadingImage(true)
        const image = await container
          .resolve<ActivityRepository>(ACTIVITY_REPOSITORY)
          .getActivityImage(activity.id)
        props.setImageValue(image)
        setIsLoadingImage(false)
        openImageInTab(image)
      } catch (e) {
        setIsLoadingImage(false)
        showErrorNotification(e)
      }
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

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-expect-error
    const imageFile = event.target.files[0]
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
  }

  return (
    <Flex gridArea={props.gridArea} align="center">
      <Text as="span" mr="10px">
        {t('activity_form.image')}
      </Text>
      <Flex align="center">
        <div>
          <VisuallyHidden
            as="input"
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            id="imageFile"
            data-testid="upload_img"
            onChange={handleChange}
          />
          <IconButton
            as="label"
            htmlFor="imageFile"
            aria-label={t('activity_form.image_upload')}
            variant="ghost"
            isRound={true}
            size="sm"
            icon={<UploadIcon style={{ width: '20px' }} />}
            cursor="pointer"
          />
        </div>
        {hasImage && (
          <IconButton
            data-testid="open-image"
            onClick={openImage}
            isLoading={isLoadingImage}
            variant="ghost"
            isRound={true}
            size="sm"
            aria-label={t('activity_form.image_open_button')}
            icon={<ExternalLinkIcon style={{ width: '20px' }} />}
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
          />
        )}
        {isLoadingImage && <Spinner label={t('accessibility.loading')} />}
      </Flex>
    </Flex>
  )
}

export default forwardRef(ImageField)
