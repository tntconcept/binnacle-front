import React, {useEffect, useState} from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import {useTranslation} from "react-i18next"
import {useQuery} from "react-query"
import Combobox, {ComboboxOption} from "core/components/TextField/Combobox"
import {UseComboboxState} from "downshift"
import {ORGANIZATIONS_ENDPOINT, PROJECTS_ENDPOINT} from "services/endpoints"
import {IOrganization} from "interfaces/IOrganization"
import {IProject} from "interfaces/IProject"
import {IProjectRole} from "interfaces/IProjectRole"
import {index} from "services/HttpClient"
import FieldMessage from "core/components/FieldMessage"
import useModal from "core/hooks/useModal"
import ErrorModal from "core/components/ErrorModal/ErrorModal"
import getErrorMessage from "services/HttpClient/HttpErrorMapper"

const fetchOrganizations = async () =>
  await index(ORGANIZATIONS_ENDPOINT).json<IOrganization[]>();

const fetchProjectsByOrganization = async ({ organizationId }: any) =>
  await index(
    `${ORGANIZATIONS_ENDPOINT}/${organizationId}/projects`
  ).json<IProject[]>();

const fetchRolesByProject = async ({ projectId }: any) =>
  await index(`${PROJECTS_ENDPOINT}/${projectId}/roles`).json<
    IProjectRole[]
  >();

interface IChooseRole {
  formik: any;
  initialOrganization?: IOrganization;
  initialProject?: IProject;
}

const ChooseRole: React.FC<IChooseRole> = props => {
  const { t } = useTranslation();
  const [error, setError] = useState<Error | null>(null);
  const { modalIsOpen, toggleModal } = useModal();

  const organizations = useQuery<IOrganization[], {}>(
    "organizations",
    fetchOrganizations
  );

  const organizationDataExists =
    organizations.data !== null && props.formik.values.organization;
  const organizationId = props.formik.values.organization
    ? props.formik.values.organization.id
    : organizationDataExists
      ? organizations.data![0].id
      : null;

  const projects = useQuery<IProject[], { organizationId: number }>(
    organizationDataExists && ["projects", { organizationId: organizationId }],
    fetchProjectsByOrganization
  );

  const projectDataExists =
    projects.data !== null && props.formik.values.project;
  const projectId = props.formik.values.project
    ? props.formik.values.project.id
    : projectDataExists
      ? projects.data![0].id
      : null;

  const roles = useQuery<IProjectRole[], { projectId: number }>(
    projectDataExists && ["roles", { projectId: projectId }],
    fetchRolesByProject
  );

  const handleOrganizationSelect = (
    changes: Partial<UseComboboxState<ComboboxOption>>
  ) => {
    formik.setFieldValue("organization", changes.selectedItem);
    formik.setFieldValue("project", undefined);
    formik.setFieldValue("role", undefined);
  };

  const handleProjectSelect = (
    changes: Partial<UseComboboxState<ComboboxOption>>
  ) => {
    if (changes.selectedItem) {
      formik.setValues({
        ...formik.values,
        // @ts-ignore
        billable: changes.selectedItem.billable,
        project: changes.selectedItem,
        role: undefined
      });
    }
  };

  const handleProjectRoleSelect = (
    changes: Partial<UseComboboxState<ComboboxOption>>
  ) => {
    formik.setFieldValue("role", changes.selectedItem);
  };

  const { formik } = props;

  const projectsDisabled =
    organizations.isLoading ||
    organizations.error !== null ||
    formik.values.organization === undefined;
  const rolesDisabled =
    projects.isLoading ||
    projects.error !== null ||
    formik.values.project === undefined;

  useEffect(() => {
    if (organizations.error || projects.error || roles.error) {
      setError(organizations.error || projects.error || roles.error);
      if (!modalIsOpen) {
        toggleModal();
      }
    }
  }, [
    organizations.error,
    projects.error,
    roles.error,
    toggleModal,
    modalIsOpen
  ]);

  console.log(formik.errors, formik.touched);

  return (
    <div className={styles.entitiesContainer}>
      <Combobox
        label={t("activity_form.organization")}
        name="organization"
        options={organizations.data || []}
        initialSelectedItem={formik.values.organization}
        onSelect={handleOrganizationSelect}
        isLoading={organizations.isLoading}
        hasError={organizations.error}
        isDisabled={organizations.error !== null}
      >
        <FieldMessage
          isError={formik.errors.organization && formik.touched.organization}
          errorText={formik.errors.organization}
        />
      </Combobox>
      <Combobox
        label={t("activity_form.project")}
        name="project"
        options={projects.data || []}
        initialSelectedItem={formik.values.project}
        onSelect={handleProjectSelect}
        isLoading={projects.isLoading}
        hasError={projects.error}
        isDisabled={projectsDisabled}
      >
        <FieldMessage
          isError={
            formik.errors.project && formik.touched.project && !projectsDisabled
          }
          errorText={formik.errors.project}
        />
      </Combobox>
      <Combobox
        label={t("activity_form.role")}
        name="role"
        options={roles.data || []}
        initialSelectedItem={formik.values.role}
        onSelect={handleProjectRoleSelect}
        isLoading={roles.isLoading}
        hasError={roles.error}
        isDisabled={projectsDisabled || rolesDisabled}
      >
        <FieldMessage
          isError={
            formik.errors.role &&
            formik.touched.role &&
            !(projectsDisabled || rolesDisabled)
          }
          errorText={formik.errors.role}
        />
      </Combobox>
      {modalIsOpen && (
        <ErrorModal
          message={getErrorMessage(error as any)}
          onCancel={toggleModal}
          onConfirm={toggleModal}
          cancelText={t("actions.cancel")}
          confirmText={t("actions.accept")}
        />
      )}
    </div>
  );
};

export default ChooseRole;

/* Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */
