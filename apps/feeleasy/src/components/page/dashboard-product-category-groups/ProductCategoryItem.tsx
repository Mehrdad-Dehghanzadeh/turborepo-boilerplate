import Paper from '@mui/material/Paper'
import BusinessIcon from '@mui/icons-material/Business'
import { ProductCategoryGroups } from '@models/ProductCategoryGroups'
import Chip from '@mui/material/Chip'
import './ProductCategoryItem.scss'

type PropsType = {
  productCategory: ProductCategoryGroups
}

export default function ({ productCategory }: Readonly<PropsType>) {
  return (
    <Paper component="section" className="product-category">
      <div className="product-category__top">
        <BusinessIcon className="product-category__icon" />
      </div>

      <div className="product-category__content">
        <ul className="product-category-list">
          <li className="product-category-list__item">
            <i className="product-category-list__title">نام مجموعه</i>
            <span className="product-category-list__text">{productCategory?.name}</span>
          </li>

          <li className="product-category-list__item">
            <i className="product-category-list__title">کد مجموعه</i>
            <span className="product-category-list__text">{productCategory?.code}</span>
          </li>

          <li className="d-flex flex-wrap">
            <i className="product-category-list__title ">گروه‌های محصول: </i>
            {productCategory?.categories.map((category) => (
              <span key={category.code} className="d-block mx-1 mb-2">
                <Chip
                  label={category?.name}
                  variant="outlined"
                  size="small"
                  component="span"
                />
              </span>
            ))}
          </li>
        </ul>
      </div>
    </Paper>
  )
}
