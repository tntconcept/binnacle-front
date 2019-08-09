import MockAdapter from 'axios-mock-adapter'
import {axiosClient} from "../services/axiosClient"

// This sets the mock adapter on the instance of axios
export const axiosMock = new MockAdapter(axiosClient)
