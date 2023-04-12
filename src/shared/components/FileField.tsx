import { Box, Flex, FormLabel, IconButton, Text, useColorModeValue } from '@chakra-ui/react'
import { ExternalLinkIcon, TrashIcon } from '@heroicons/react/outline'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import type { Ref } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import type { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'

interface Props {
  gridArea: string
  control: Control<ActivityFormSchema>
  setImageValue: (value: string[] | null) => void
}

/* eslint-disable  @typescript-eslint/no-unused-vars */
function FileField(props: Props, ref: Ref<HTMLInputElement>) {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

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
          <input {...getInputProps()} data-testid="upload_img" />
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
                          //onClick={}
                          variant="ghost"
                          isRound={true}
                          size="sm"
                          aria-label={t('activity_form.image_open_button')}
                          icon={<ExternalLinkIcon style={{ width: '20px' }} />}
                          colorScheme="blackAlpha"
                          color={iconColor}
                        />
                        <IconButton
                          data-testid="delete-image"
                          //onClick={() => remove(file)}
                          variant="ghost"
                          isRound={true}
                          size="sm"
                          aria-label={t('activity_form.image_delete_button')}
                          icon={<TrashIcon style={{ width: '20px' }} />}
                          colorScheme="blackAlpha"
                          color={iconColor}
                        />
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
