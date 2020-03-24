import {IUser} from "api/interfaces/IUser"
import httpClient from "api/HttpClient"
import endpoints from "api/endpoints"

export const getLoggedUser = async () => await httpClient(endpoints.user).json<IUser>()
