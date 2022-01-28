import { Control } from 'react-hook-form'
import { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import { container } from 'tsyringe'
import { CombosRepository } from 'modules/binnacle/data-access/repositories/combos-repository'
import { ComboField } from 'shared/components/FormFields/ComboField'

interface ComboProps {
  onChange: (item: any) => void
  control: Control<ActivityFormSchema>
}

export const OrganizationsCombo = (props: ComboProps) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Organization[]>([])

  useEffect(() => {
    const combosRepo = container.resolve(CombosRepository)

    setLoading(true)
    combosRepo
      .getOrganizations()
      .then((organizations) => {
        setItems(organizations)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <ComboField
      control={props.control}
      name="organization"
      label={t('activity_form.organization')}
      items={items}
      onChange={props.onChange}
      isDisabled={false}
      isLoading={loading}
    />
  )
}
