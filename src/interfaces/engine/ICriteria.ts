export interface ICriteriaItem {
  [key: string]: string | number | ICriteriaItem | ICriteriaItem[];
}

export interface ICriteria {
  [key: string]: ICriteriaItem | ICriteriaItem[] | ICriteria | ICriteria[];
}
