import { Box, Flex, FormLabel, IconButton, Text, useColorModeValue } from '@chakra-ui/react'
import { ExternalLinkIcon, TrashIcon } from '@heroicons/react/outline'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import type { Ref } from 'react'
import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import type { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'

interface Props {
  gridArea: string
  control: Control<ActivityFormSchema>
  onChange: (files: File[]) => void
}

const compressionOptions = {
  maxSizeMB: 3.0,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'jpg'
}

/* eslint-disable  @typescript-eslint/no-unused-vars */
function FileField(props: Props, ref: Ref<HTMLInputElement>) {
  const { onChange } = props
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])

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
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  const remove = (file: File) => {
    setFiles(files.filter((f) => f != file))
  }

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>, file: File) => {
    event.preventDefault()
    remove(file)
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

  return (
    <Box gridArea={props.gridArea}>
      <Box position="relative" width="full" borderRadius="4px">
        <FormLabel
          backgroundColor={useColorModeValue('white', 'gray.700')}
          color={'gray.200'}
          sx={{
            m: 0,
            position: 'absolute',
            top: '-10px',
            left: '13px',
            zIndex: '1'
          }}
        >
          {t('activity_form.image')}
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
              <Text color="gray.500">{t('activity_form.image_upload')}</Text>
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
                          data-testid="open-image"
                          onClick={(event) => {
                            event.stopPropagation()
                            handlePreview(file)
                          }}
                          variant="ghost"
                          isRound={true}
                          size="sm"
                          aria-label={t('activity_form.image_open_button')}
                          icon={<ExternalLinkIcon style={{ width: '20px' }} />}
                          colorScheme="blackAlpha"
                          color={iconColor}
                        />
                        <label htmlFor={`hidden-input-${i}`}>
                          <IconButton
                            data-testid="delete-image"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleRemove(event, file)
                            }}
                            variant="ghost"
                            isRound={true}
                            size="sm"
                            aria-label={t('activity_form.image_delete_button')}
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

export default forwardRef(FileField)
