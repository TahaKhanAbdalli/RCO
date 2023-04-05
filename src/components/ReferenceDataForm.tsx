import React from 'react'
import { SimpleForm, TextInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required()
})

export default function ReferenceDataForm(): React.ReactElement {
  const defaultValues = {
    name: ''
  }
  return (
    <SimpleForm defaultValues={defaultValues} resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
    </SimpleForm>
  )
}