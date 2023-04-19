import { Box, Flex, FormLabel, IconButton, Text, useColorModeValue } from '@chakra-ui/react'
import { ExternalLinkIcon, TrashIcon } from '@heroicons/react/outline'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'

interface Props {
  gridArea: string
  onChange: (files: File[]) => void
  label: string
  maxFiles?: number
  labelBgColorLightTheme?: string
  labelBgColorDarkTheme?: string
  initialFiles?: File[]
}

const compressionOptions = {
  maxSizeMB: 3.0,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'jpg'
}

/* eslint-disable  @typescript-eslint/no-unused-vars */
function FileField(props: Props) {
  const { t } = useTranslation()
  const {
    onChange,
    maxFiles = 1,
    labelBgColorDarkTheme,
    labelBgColorLightTheme,
    gridArea,
    label = t('files.attachments'),
    initialFiles = []
  } = props
  const [files, setFiles] = useState<File[]>(initialFiles)

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map(async (file: File) => {
      const isBiggerThanMaxSize = file.size > compressionOptions.maxSizeMB * 1024 * 1024

      switch (file.type) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          try {
            const compressedFile = isBiggerThanMaxSize
              ? await imageCompression(file, compressionOptions)
              : file
            setFiles((prev) => [...prev, compressedFile])
          } catch (e) {}
          break
        case 'application/pdf':
          setFiles((prev) => [...prev, file])
      }
    })
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: maxFiles })

  const handleRemove = (file: number) => {
    setFiles(files.filter((f) => files.indexOf(f) !== file))
  }

  const handlePreview = (file: File) => {
    if (file.type === 'application/pdf') {
      window.open(URL.createObjectURL(file), '_blank')
    } else {
      const image = new Image()
      image.src = URL.createObjectURL(file)
      const newWindow = window.open('', '_blank')
      if (newWindow !== null) {
        newWindow.document.write(image.outerHTML)
      }
    }
  }

  useEffect(() => {
    onChange(files)
  }, [onChange, files])

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
          {...getRootProps()}
        >
          <input
            {...getInputProps()}
            data-testid="upload_img"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
          />
          {files.length == 0 ? (
            <Flex align="center">
              <Text color="gray.500">{t('files.uploadFiles')}</Text>
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
                          icon={<ExternalLinkIcon style={{ width: '20px' }} />}
                          colorScheme="blackAlpha"
                          color={iconColor}
                        />
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

export default FileField
