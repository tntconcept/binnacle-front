import { PaperClipIcon } from '@heroicons/react/24/outline'
import { FC, useState } from 'react'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { Spinner } from '@chakra-ui/react'
import { useResolve } from '../../../../../../../../shared/di/use-resolve'
import { ActivityErrorMessage } from '../../../../domain/services/activity-error-message'
import { openFilePreview } from '../../../../../../../../shared/utils/open-file-preview'
import { GetActivityEvidenceQry } from '../../../../application/get-activity-evidence-qry'
import { Uuid } from '../../../../../attachments/domain/uuid'

interface Props {
  evidenceUuid: Uuid
  evidenceKey: number
}

export const EvidenceIcon: FC<Props> = (props) => {
  const { evidenceUuid, evidenceKey } = props
  const activityErrorMessage = useResolve(ActivityErrorMessage)
  const { useCase: getActivityEvidenceQry } = useGetUseCase(GetActivityEvidenceQry)

  const [showSpinner, setShowSpinner] = useState(false)

  const handlePreview = () => {
    getActivityEvidenceQry
      .execute(evidenceUuid, { showToastError: true, errorMessage: activityErrorMessage.get })
      .then((file) => {
        openFilePreview(file)
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
