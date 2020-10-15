import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IOrganization } from 'api/interfaces/IOrganization'
import { IProject } from 'api/interfaces/IProject'
import { IProjectRole } from 'api/interfaces/IProjectRole'
import { fetchOrganizations } from 'api/OrganizationAPI'
import { fetchProjectsByOrganization } from 'api/ProjectsAPI'
import { fetchRolesByProject } from 'api/RoleAPI'
import { Combobox } from 'core/components'
import { useFormikContext } from 'formik'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import { ComboboxOption } from 'core/components/Combobox/Combobox'
import { Stack } from '@chakra-ui/core'

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
  const formik = useFormikContext<ActivityFormValues>()

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
    if (formik.values.organization !== undefined) {
      setProjects((prevState) => ({ ...prevState, isLoading: true }))
      fetchProjectsByOrganization(formik.values.organization.id)
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
  }, [formik.values.organization])

  const [projectRoles, setProjectRoles] = useState<IProjectRoleRequest>({
    data: undefined,
    isLoading: false,
    error: undefined
  })

  useEffect(() => {
    if (formik.values.project !== undefined) {
      setProjectRoles((prevState) => ({ ...prevState, isLoading: true }))
      fetchRolesByProject(formik.values.project.id)
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
  }, [formik.values.project])

  const handleOrganizationSelect = (value: ComboboxOption) => {
    formik.setFieldValue('organization', value, true)
    formik.setFieldValue('project', undefined, false)
    formik.setFieldValue('role', undefined, false)
  }

  const handleProjectSelect = (value: ComboboxOption) => {
    if (value) {
      formik.setValues(
        {
          ...formik.values,
          // @ts-ignore
          billable: value.billable,
          // @ts-ignore
          project: value,
          role: undefined
        },
        true
      )
    }
  }

  const handleProjectRoleSelect = (value: ComboboxOption) => {
    formik.setFieldValue('role', value)
  }

  const projectsDisabled =
    organizations.isLoading ||
    organizations.error !== undefined ||
    formik.values.organization === undefined
  const rolesDisabled =
    projects.isLoading || projects.error !== undefined || formik.values.project === undefined

  return (
    <Stack direction={['column', 'row']} spacing={4}>
      <Combobox
        label={t('activity_form.organization')}
        name="organization"
        options={organizations.data || []}
        value={formik.values.organization}
        onChange={handleOrganizationSelect}
        isLoading={organizations.isLoading}
        isDisabled={organizations.error !== undefined}
        // @ts-ignore
        hasError={formik.errors.organization && formik.touched.organization}
        errorText={formik.errors.organization}
      />
      <Combobox
        label={t('activity_form.project')}
        name="project"
        options={projects.data || []}
        value={formik.values.project}
        onChange={handleProjectSelect}
        isLoading={projects.isLoading}
        isDisabled={projectsDisabled}
        // @ts-ignore
        hasError={formik.errors.project && formik.touched.project && !projectsDisabled}
        errorText={formik.errors.project}
      />
      <Combobox
        label={t('activity_form.role')}
        name="role"
        options={projectRoles.data || []}
        value={formik.values.role}
        onChange={handleProjectRoleSelect}
        isLoading={projectRoles.isLoading}
        isDisabled={projectsDisabled || rolesDisabled}
        // @ts-ignore
        hasError={formik.errors.role && formik.touched.role && !(projectsDisabled || rolesDisabled)}
        errorText={formik.errors.role}
      />
    </Stack>
  )
}

export default SelectRole
