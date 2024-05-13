import { ProjectBillingType } from '../../features/shared/project/domain/project-billing-type'

export class ProjectTypeMother {
  static noBillableProjectType(): ProjectBillingType {
    return {
      billableByDefault: false,
      name: 'NO_BILLABLE',
      type: 'NEVER'
    }
  }

  static closedPriceProjectType(): ProjectBillingType {
    return {
      billableByDefault: true,
      name: 'CLOSED_PRICE',
      type: 'ALWAYS'
    }
  }

  static timeAndMaterialsProjectType(): ProjectBillingType {
    return {
      billableByDefault: true,
      name: 'TIME_AND_MATERIALS',
      type: 'OPTIONAL'
    }
  }
}
