import { ICustomStatusMessages } from 'shared/components/Notifications/HttpStatusCodeMessage'

export interface IAction<Param = void> {
  execute: (param: Param) => Promise<void>
}

type ShowAlertErrorFn = (error: any) => ICustomStatusMessages | undefined

export interface IActionOptions {
  showAlertError?: boolean | ShowAlertErrorFn
}
