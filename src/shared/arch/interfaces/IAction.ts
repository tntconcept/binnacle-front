import { ICustomStatusMessages } from 'shared/components/notifications/http-status-code-message'

export interface IAction<Param = void> {
  execute: (param: Param) => Promise<void>
}

type ShowAlertErrorFn = (error: any) => ICustomStatusMessages | undefined

export interface IActionOptions {
  showAlertError?: boolean | ShowAlertErrorFn
}
