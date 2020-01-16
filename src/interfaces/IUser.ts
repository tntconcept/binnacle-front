export interface IUser {
  id: number;
  username: string;
  name: string;
  departmentId: number;
  email?: string;
  genre: string;
  hiringDate: Date
  photoUrl?: string;
  role: {
    id: number;
    name: string;
  };
  dayDuration?: number;
}