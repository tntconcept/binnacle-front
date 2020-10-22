import React, { useState } from 'react'
import ImageFile from 'pages/binnacle/ActivityForm/ImageFile'
import { useTranslation } from 'react-i18next'
import { openImageInTab } from 'pages/binnacle/ActivityForm/utils'
import { useShowErrorNotification } from 'core/features/Notifications/useShowErrorNotification'
import { ReactComponent as ThrashIcon } from 'heroicons/outline/trash.svg'
import { ReactComponent as ExternalLinkIcon } from 'heroicons/outline/external-link.svg'
import { fetchActivityImage } from 'api/ActivitiesAPI'
import { IconButton, Flex, Text, Spinner } from '@chakra-ui/core'

interface IUploadImage {
  activityId?: number
  activityHasImg: boolean
  imgBase64: string | null
  handleChange: (imgBase64: string | null) => void
}

const UploadImage: React.FC<IUploadImage> = (props) => {
  const { t } = useTranslation()
  const showErrorNotification = useShowErrorNotification()
  const [isFetchingImg, setIsFetchingImg] = useState(false)

  const [showActions, setShowActions] = useState(() => {
    if (props.activityHasImg && props.imgBase64 === null) {
      return true
    } else {
      return props.imgBase64 !== null
    }
  })

  const openImage = async () => {
    if (props.imgBase64 === null) {
      try {
        setIsFetchingImg(true)
        const image = await fetchActivityImage(props.activityId!)
        props.handleChange(image)
        setIsFetchingImg(false)
        openImageInTab(image)
      } catch (e) {
        setIsFetchingImg(false)
        showErrorNotification(e)
      }
    } else {
      openImageInTab(props.imgBase64)
    }
  }

  const uploadImage = (value: string | null) => {
    props.handleChange(value)
    setShowActions(true)
  }

  const removeImage = () => {
    props.handleChange(null)
    setShowActions(false)
  }

  return (
    <Flex gridColumn="col / span 6" align="center">
      <Text as="span" mr="10px">
        {t('activity_form.image')}
      </Text>
      <Flex align="center">
        <ImageFile
          label={t('activity_form.image_upload')}
          value={props.imgBase64}
          onChange={uploadImage}
        />
        {showActions && (
          <IconButton
            data-testid="open-image"
            onClick={openImage}
            isLoading={isFetchingImg}
            variant="ghost"
            isRound={true}
            size="sm"
            aria-label={t('activity_form.image_open_button')}
            icon={<ExternalLinkIcon style={{ width: '20px' }} />}
          />
        )}
        {showActions && (
          <IconButton
            data-testid="delete-image"
            onClick={removeImage}
            variant="ghost"
            isRound={true}
            size="sm"
            aria-label={t('activity_form.image_delete_button')}
            icon={<ThrashIcon style={{ width: '20px' }} />}
          />
        )}
        {isFetchingImg && <Spinner label={t('accessibility.loading')} />}
      </Flex>
    </Flex>
  )
}

export default UploadImage
