interface UserRole {
  id: number
  name: string
}

interface WorkingAgreement {
  id: number
  holidaysQuantity: number
  yearDuration: number
}

export interface User {
  id: number
  username: string
  name: string
  departmentId: number
  email?: string
  genre: string
  hiringDate: Date
  photoUrl?: string
  role: UserRole
  dayDuration?: number
  agreementYearDuration?: number
  agreement: WorkingAgreement
}
