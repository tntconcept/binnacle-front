import BaseApiResponse from "interfaces/base/BaseApiResponse"

export interface IProject extends BaseApiResponse {
  billable: boolean,
  open: boolean
}