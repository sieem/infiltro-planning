export interface IStatuses {
  type: 'contractSigned' | 'toContact' | 'toPlan' | 'proposalSent' | 'planned' | 'onHold' | 'onHoldByClient' | 'executed' | 'reportAvailable' | 'conformityAvailable' | 'completed' | 'deleted',
  name: string,
  onlyAdmin: boolean
}
