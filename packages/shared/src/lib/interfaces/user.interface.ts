export interface IUser {
  _id: string,
  email: string,
  name: string,
  company: string,
  role: 'admin' | 'company' | 'client',
}

export interface IUserToken {
  id: string,
  iat: number,
  company: string,
  role: 'admin' | 'company' | 'client',
}
