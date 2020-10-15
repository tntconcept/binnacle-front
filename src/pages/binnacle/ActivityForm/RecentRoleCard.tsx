import React from 'react'
import { ReactComponent as UsersIcon } from 'assets/icons/users.svg'
import { ReactComponent as UserIcon } from 'assets/icons/user.svg'
import { ReactComponent as OfficeIcon } from 'assets/icons/office-building.svg'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { useFormikContext } from 'formik'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import { useTranslation } from 'react-i18next'
import { VisuallyHidden, Icon, Text, Box } from '@chakra-ui/core'

interface IRecentRoleCard {
  id: number
  name: string
  value: IRecentRole
  checked: boolean
}

const RecentRoleCard: React.FC<IRecentRoleCard> = (props) => {
  const { t } = useTranslation()
  const { values, setValues } = useFormikContext<ActivityFormValues>()

  const handleChange = (event: any) => {
    setValues(
      {
        ...values,
        recentRole: {
          id: props.value.id,
          name: props.value.name,
          projectName: props.value.projectName,
          projectBillable: props.value.projectBillable,
          organizationName: props.value.organizationName,
          requireEvidence: props.value.requireEvidence,
          // Date will be overridden in activity form
          date: new Date()
        },
        billable: props.value.projectBillable
      },
      false
    )
  }

  return (
    <>
      <VisuallyHidden
        as="input"
        id={props.id.toString()}
        // @ts-ignore
        name={props.name}
        type="radio"
        value={props.value.id}
        checked={props.checked}
        onChange={handleChange}
        data-testid={'role_' + props.value.id}
      />
      <Box
        as="label"
        // @ts-ignore
        htmlFor={props.id.toString()}
        d="inline-flex"
        py="6px"
        px="8px"
        flexDir="column"
        borderStyle="solid"
        borderWidth={props.checked ? '2px' : '1px'}
        borderColor={props.checked ? '#1f1c53' : '#D0CFE3'}
        borderRadius="4px"
        fontSize="sm"
        userSelect="none"
        cursor="pointer"
        outline="none"
      >
        <Text maxWidth="27ch" isTruncated>
          <Icon
            as={OfficeIcon}
            aria-label={t('activity_form.organization') + ':'}
            color="gray.400"
            mr={1}
          />
          {props.value.organizationName}
        </Text>
        <Text maxWidth="27ch" isTruncated>
          <Icon
            as={UsersIcon}
            aria-label={t('activity_form.project') + ':'}
            color="gray.400"
            mr={1}
          />
          {props.value.projectName}
        </Text>
        <Text maxWidth="27ch" isTruncated>
          <Icon as={UserIcon} aria-label={t('activity_form.role') + ':'} color="gray.400" mr={1} />
          {props.value.name}
        </Text>
      </Box>
    </>
  )
}

export default RecentRoleCard
