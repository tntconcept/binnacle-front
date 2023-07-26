import {
  Box,
  Flex,
  FormLabel,
  IconButton,
  Spinner,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { ArrowTopRightOnSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import imageCompression from 'browser-image-compression'
import { FC, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

interface Props {
  gridArea: string
  onChange: (files: File[]) => void
  label: string
  maxFiles?: number
  labelBgColorLightTheme?: string
  labelBgColorDarkTheme?: string
  files?: File[]
  isLoading?: boolean
  isReadOnly?: boolean
}

const compressionOptions = {
  maxSizeMB: 3.0,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'jpg'
}

const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const supportedImagesSet = new Set(supportedImageTypes)

export const FileField: FC<Props> = (props) => {
  const { t } = useTranslation()
  const {
    onChange,
    maxFiles = 1,
    labelBgColorDarkTheme,
    labelBgColorLightTheme,
    gridArea,
    label = t('files.attachments'),
    files = [],
    isLoading = false,
    isReadOnly = false
  } = props

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.map(async (file: File) => {
      if (!file.type) return
      const isBiggerThanMaxSize = file.size > compressionOptions.maxSizeMB * 1024 * 1024

      if (supportedImagesSet.has(file.type)) {
        const compressedFile = isBiggerThanMaxSize
          ? await imageCompression(file, compressionOptions)
          : file
        onChange([...files, compressedFile])
        return
      }

      onChange([...files, file])
    })
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: maxFiles })

  const flexRootProps = () => {
    if (isReadOnly) return {}
    return getRootProps()
  }

  const handleRemove = (file: number) => {
    onChange(files.filter((f) => files.indexOf(f) !== file))
  }

  const handlePreview = (file: File) => {
    if (!supportedImagesSet.has(file.type)) {
      window.open(URL.createObjectURL(file), '_blank')
      return
    }

    const image = new Image()
    image.src = URL.createObjectURL(file)
    const newWindow = window.open('', '_blank')

    if (newWindow !== null) {
      newWindow.document.write(image.outerHTML)
    }
  }

  const bgColor = useColorModeValue('gray.100', 'gray.600')
  const iconColor = useColorModeValue('black', 'white')
  const labelBgColor = useColorModeValue(
    labelBgColorLightTheme ?? 'white',
    labelBgColorDarkTheme ?? 'gray.700'
  )

  return (
    <Box gridArea={gridArea}>
      <Box position="relative" width="full" borderRadius="4px">
        <FormLabel
          backgroundColor={labelBgColor}
          sx={{
            m: 0,
            position: 'absolute',
            top: '-12px',
            left: '14px',
            padding: '0 4px',
            zIndex: '1'
          }}
        >
          {label}
        </FormLabel>
        <Flex
          direction="column"
          align="center"
          justify="center"
          sx={{
            w: 'full',
            h: files.length == 0 ? '52px' : 'auto',
            p: 2,
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: bgColor,
            borderRadius: '2px',
            transition: 'border 0.24s ease-in-out'
          }}
          {...flexRootProps()}
        >
          <input
            {...getInputProps()}
            data-testid="upload_img"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            disabled={isReadOnly}
          />
          {isLoading ? (
            <Spinner />
          ) : files.length === 0 ? (
            <Flex align="center">
              {!isReadOnly && <Text color="gray.500">{t('files.uploadFiles')}</Text>}
            </Flex>
          ) : (
            <Flex align="center">
              <ul>
                {files.map((file, i) => (
                  <li key={file.name} style={{ listStyle: 'none' }}>
                    <>
                      <Text key={i}>
                        {file.name}
                        <IconButton
                          data-testid="open-file"
                          onClick={(event) => {
                            event.stopPropagation()
                            handlePreview(file)
                          }}
                          variant="ghost"
                          isRound={true}
                          size="sm"
                          aria-label={t('files.previewFile')}
                          icon={<ArrowTopRightOnSquareIcon style={{ width: '20px' }} />}
                          colorScheme="blackAlpha"
                          color={iconColor}
                        />
                        {!isReadOnly && (
                          <label htmlFor={`hidden-input-${i}`}>
                            <IconButton
                              data-testid="delete-file"
                              onClick={(event) => {
                                event.stopPropagation()
                                handleRemove(i)
                              }}
                              variant="ghost"
                              isRound={true}
                              size="sm"
                              aria-label={t('files.deleteFile')}
                              icon={<TrashIcon style={{ width: '20px' }} />}
                              colorScheme="blackAlpha"
                              color={iconColor}
                            />
                          </label>
                        )}
                      </Text>
                    </>
                  </li>
                ))}
              </ul>
            </Flex>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
