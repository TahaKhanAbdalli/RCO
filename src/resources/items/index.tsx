import React from 'react'
import { Create, Edit } from 'react-admin'
import ItemForm from '../../components/ItemForm'

const ItemList = React.lazy(async () => await import('./ItemList'))
const ItemShow = React.lazy(async () => await import('./ItemShow'))

const ItemCreate = (): React.ReactElement => {
  return (
    <Create>
      <ItemForm />
    </Create>
  )
}

const ItemEdit = (): React.ReactElement => {
  return (
    <Edit>
      <ItemForm />
    </Edit>
  )
}

const items = {
  create: ItemCreate,
  edit: ItemEdit,
  list: ItemList,
  show: ItemShow
}

export default items