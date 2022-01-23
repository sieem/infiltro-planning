export interface ISortables {
  type: 'company' | 'dateCreated' | 'projectType' | 'projectName' | 'street' | 'city' | 'postalCode' | 'name' | 'tel' | 'email' | 'executor' | 'datePlanned' | 'hourPlanned' | 'status',
  name: string,
  sort: boolean
}

