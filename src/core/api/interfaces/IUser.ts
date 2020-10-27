interface IUserRole {
  id: number
  name: string
}

interface WorkingAgreement {
  id: number
  holidaysQuantity: number
  yearDuration: number
}

export interface IUser {
  id: number
  username: string
  name: string
  departmentId: number
  email?: string
  genre: string
  hiringDate: Date
  photoUrl?: string
  role: IUserRole
  dayDuration?: number
  agreementYearDuration?: number
  agreement: WorkingAgreement
}
