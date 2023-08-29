import { PaperClipIcon } from '@heroicons/react/24/outline'
import { FC, useState } from 'react'
import { Id } from '@archimedes/arch'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { GetActivityEvidenceQry } from '../../../../application/get-activity-image-qry'
import { Spinner } from '@chakra-ui/react'
import { useResolve } from '../../../../../../../../shared/di/use-resolve'
import { ActivityErrorMessage } from '../../../../domain/services/activity-error-message'

const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const supportedImagesSet = new Set(supportedImageTypes)

interface Props {
  activityId: Id
  evidenceKey: number
}

export const EvidenceIcon: FC<Props> = (props) => {
  const { activityId, evidenceKey } = props
  const activityErrorMessage = useResolve(ActivityErrorMessage)
  const { useCase: getActivityEvidenceQry } = useGetUseCase(GetActivityEvidenceQry)

  const [showSpinner, setShowSpinner] = useState(false)

  const handlePreview = () => {
    getActivityEvidenceQry
      .execute(activityId, { showToastError: true, errorMessage: activityErrorMessage.get })
      .then((file) => {
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
      })
      .finally(() => setShowSpinner(false))
  }

  return (
    <>
      {showSpinner ? (
        <Spinner />
      ) : (
        <PaperClipIcon
          onClick={() => {
            setShowSpinner(true)
            handlePreview()
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
