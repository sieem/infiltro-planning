export interface IUser {
  _id: string,
  email: string,
  name: string,
  company: string,
  role: 'admin' | 'company' | 'client',
}
