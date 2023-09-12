import { FileField } from '../../../../../../../../shared/components/file-field'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { GetActivityEvidenceQry } from '../../../../application/get-activity-evidence-qry'
import { openFilePreview } from '../../../../../../../../shared/utils/open-file-preview'
import { RemoteFile } from '../../../../../attachments/domain/remote-file'
import { Uuid } from '../../../../../../../../shared/types/uuid'

interface Props {
  files?: (File | RemoteFile)[]
  onChange: (file: (File | RemoteFile)[]) => void
  isReadOnly?: boolean
}

export const ActivityEvidence: FC<Props> = (props) => {
  const { t } = useTranslation()
  const { executeUseCase: getActivityEvidenceQry, isLoading } =
    useGetUseCase(GetActivityEvidenceQry)

  const handlePreviewClick = (uuid: Uuid) => {
    getActivityEvidenceQry(uuid).then(async (evidence) => {
      openFilePreview(evidence)
    })
  }

  return (
    <FileField
      label={t('activity_form.evidences')}
      gridArea="evidence"
      files={props.files}
      onChange={props.onChange}
      isLoading={isLoading}
      isReadOnly={props.isReadOnly}
      handlePreviewClick={handlePreviewClick}
    />
  )
}
