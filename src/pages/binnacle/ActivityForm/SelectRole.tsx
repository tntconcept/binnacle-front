import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IOrganization } from 'api/interfaces/IOrganization'
import { IProject } from 'api/interfaces/IProject'
import { IProjectRole } from 'api/interfaces/IProjectRole'
import { fetchOrganizations } from 'api/OrganizationAPI'
import { fetchProjectsByOrganization } from 'api/ProjectsAPI'
import { fetchRolesByProject } from 'api/RoleAPI'
import { Field, FieldProps, useFormikContext } from 'formik'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import { FormControl, FormErrorMessage, Stack } from '@chakra-ui/core'
import { FloatingLabelCombobox } from 'core/components/FloatingLabelCombobox'

interface IBaseRequest {
  isLoading: boolean
  error?: Error
}

interface IOrganizationRequest extends IBaseRequest {
  data?: IOrganization[]
}

interface IProjectRequest extends IBaseRequest {
  data?: IProject[]
}

interface IProjectRoleRequest extends IBaseRequest {
  data?: IProjectRole[]
}

const SelectRole: React.FC = () => {
  const { t } = useTranslation()
  const { setFieldValue, values } = useFormikContext<ActivityFormValues>()

  const [organizations, setOrganizations] = useState<IOrganizationRequest>({
    data: undefined,
    isLoading: false,
    error: undefined
  })

  useEffect(() => {
    if (!organizations.data) {
      setOrganizations((prevState) => ({ ...prevState, isLoading: true }))
      fetchOrganizations()
        .then((data) =>
          setOrganizations((prevState) => ({
            ...prevState,
            isLoading: false,
            data: data
          }))
        )
        .catch((err) =>
          setOrganizations((prevState) => ({
            ...prevState,
            error: err,
            isLoading: false
          }))
        )
    }
  }, [organizations.data])

  const [projects, setProjects] = useState<IProjectRequest>({
    data: undefined,
    isLoading: false,
    error: undefined
  })

  useEffect(() => {
    // console.log("formikOrganization", formik.values.organization)
    if (values.organization !== undefined) {
      setProjects((prevState) => ({ ...prevState, isLoading: true }))
      fetchProjectsByOrganization(values.organization.id)
        .then((data) =>
          setProjects((prevState) => ({
            ...prevState,
            isLoading: false,
            data: data
          }))
        )
        .catch((err) =>
          setProjects((prevState) => ({
            ...prevState,
            error: err,
            isLoading: false
          }))
        )
    }
  }, [values.organization])

  const [projectRoles, setProjectRoles] = useState<IProjectRoleRequest>({
    data: undefined,
    isLoading: false,
    error: undefined
  })

  useEffect(() => {
    if (values.project !== undefined) {
      setProjectRoles((prevState) => ({ ...prevState, isLoading: true }))
      fetchRolesByProject(values.project.id)
        .then((data) =>
          setProjectRoles((prevState) => ({
            ...prevState,
            isLoading: false,
            data: data
          }))
        )
        .catch((err) =>
          setProjectRoles((prevState) => ({
            ...prevState,
            error: err,
            isLoading: false
          }))
        )
    }
  }, [values.project])

  const handleOrganizationSelect = useCallback(
    (value: IOrganization) => {
      setFieldValue('organization', value, true)
      setFieldValue('project', undefined, false)
      setFieldValue('role', undefined, false)
    },
    [setFieldValue]
  )

  const handleProjectSelect = useCallback(
    (value: IProject) => {
      setFieldValue('billable', value.billable, false)
      setFieldValue('project', value, true)
      setFieldValue('role', undefined, false)
    },
    [setFieldValue]
  )

  const handleProjectRoleSelect = useCallback(
    (value: IProjectRole) => {
      setFieldValue('role', value, true)
    },
    [setFieldValue]
  )

  const projectsDisabled =
    organizations.isLoading ||
    organizations.error !== undefined ||
    values.organization === undefined
  const rolesDisabled =
    projects.isLoading || projects.error !== undefined || values.project === undefined

  return (
    <Stack direction={['column', 'row']} spacing={4}>
      <Field name="organization">
        {({ field, meta }: FieldProps) => (
          <FormControl id="organization" isInvalid={meta.error !== undefined && meta.touched}>
            <FloatingLabelCombobox
              name={field.name}
              value={field.value}
              onChange={handleOrganizationSelect}
              onBlur={field.onBlur}
              label={t('activity_form.organization')}
              items={organizations.data || []}
              isLoading={organizations.isLoading}
              isDisabled={organizations.error !== undefined}
              data-testid="organization_combobox"
            />
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <Field name="project">
        {({ field, meta }: FieldProps) => (
          <FormControl
            id="project"
            isInvalid={meta.error !== undefined && meta.touched && !projectsDisabled}
          >
            <FloatingLabelCombobox
              name={field.name}
              value={field.value}
              onChange={handleProjectSelect}
              onBlur={field.onBlur}
              label={t('activity_form.project')}
              items={projects.data || []}
              isLoading={projects.isLoading}
              isDisabled={projectsDisabled}
              data-testid="project_combobox"
            />
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <Field name="role">
        {({ field, meta }: FieldProps) => (
          <FormControl
            id="role"
            isInvalid={
              meta.error !== undefined && meta.touched && !(projectsDisabled || rolesDisabled)
            }
          >
            <FloatingLabelCombobox
              name={field.name}
              value={field.value}
              onChange={handleProjectRoleSelect}
              onBlur={field.onBlur}
              label={t('activity_form.role')}
              items={projectRoles.data || []}
              isLoading={projectRoles.isLoading}
              isDisabled={projectsDisabled || rolesDisabled}
              data-testid="role_combobox"
            />
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
    </Stack>
  )
}

export default SelectRole
