export interface CategoryGroups {
  code: string
  name: string
}

export interface ProductCategoryGroups extends CategoryGroups {
  categories: CategoryGroups[] | []
}
