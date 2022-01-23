export interface IPointerIcon {
  executor: 'david' | 'roel' | 'together' | 'default' | 'warning',
  type: 'default' | 'planned',
  urgency: 'normal' | 'warning',
  url: string
}

export const defaultPointerUrl = 'default-faded.png';

export const pointers: IPointerIcon[] = [
  {
    executor: 'david',
    type: 'planned',
    urgency: 'normal',
    url: 'david-planned.png',
  },
  {
    executor: 'david',
    type: 'default',
    urgency: 'normal',
    url: 'david-faded.png',
  },
  {
    executor: 'david',
    type: 'planned',
    urgency: 'warning',
    url: 'david-planned-warning.png',
  },
  {
    executor: 'david',
    type: 'default',
    urgency: 'warning',
    url: 'david-faded-warning.png',
  },
  {
    executor: 'roel',
    type: 'planned',
    urgency: 'normal',
    url: 'roel-planned.png',
  },
  {
    executor: 'roel',
    type: 'default',
    urgency: 'normal',
    url: 'roel-faded.png',
  },
  {
    executor: 'roel',
    type: 'planned',
    urgency: 'warning',
    url: 'roel-planned-warning.png',
  },
  {
    executor: 'roel',
    type: 'default',
    urgency: 'warning',
    url: 'roel-faded-warning.png',
  },
  {
    executor: 'together',
    type: 'planned',
    urgency: 'normal',
    url: 'together-planned.png',
  },
  {
    executor: 'together',
    type: 'default',
    urgency: 'normal',
    url: 'together-faded.png',
  },
  {
    executor: 'together',
    type: 'planned',
    urgency: 'warning',
    url: 'together-planned-warning.png',
  },
  {
    executor: 'together',
    type: 'default',
    urgency: 'warning',
    url: 'together-faded-warning.png',
  },
  {
    executor: 'default',
    type: 'planned',
    urgency: 'normal',
    url: 'default-planned.png',
  },
  {
    executor: 'default',
    type: 'default',
    urgency: 'normal',
    url: 'default-faded.png',
  },
  {
    executor: 'default',
    type: 'planned',
    urgency: 'warning',
    url: 'default-planned-warning.png',
  },
  {
    executor: 'default',
    type: 'default',
    urgency: 'warning',
    url: 'default-faded-warning.png',
  },
];
