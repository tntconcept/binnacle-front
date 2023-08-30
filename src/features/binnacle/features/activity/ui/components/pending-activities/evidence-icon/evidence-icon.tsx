import { PaperClipIcon } from '@heroicons/react/24/outline'
import { FC, useEffect, useState } from 'react'
import { Spinner } from '@chakra-ui/react'
import { Id } from '@archimedes/arch'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { GetActivityEvidenceQry } from '../../../../application/get-activity-image-qry'

const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const supportedImagesSet = new Set(supportedImageTypes)

interface Props {
  activityId: Id
  evidenceKey: number
}

export const EvidenceIcon: FC<Props> = (props) => {
  const { activityId, evidenceKey } = props
  const { useCase: getActivityEvidenceQry } = useGetUseCase(GetActivityEvidenceQry)

  const [isLoadingEvidence, setIsLoadingEvidence] = useState(true)
  const [evidence, setEvidence] = useState<File | undefined>(undefined)

  useEffect(() => {
    getActivityEvidenceQry.execute(activityId).then((evidence) => {
      setEvidence(evidence)
      setIsLoadingEvidence(false)
    })
  }, [activityId])

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

  return (
    <>
      {isLoadingEvidence ? (
        <Spinner />
      ) : (
        <PaperClipIcon
          onClick={() => {
            if (evidence !== undefined) {
              handlePreview(evidence)
            }
          }}
          style={{ cursor: 'pointer' }}
          key={'icon' + evidenceKey}
          data-testid={`evidence_${evidenceKey}`}
          width={'20px'}
        />
      )}
    </>
  )
}
