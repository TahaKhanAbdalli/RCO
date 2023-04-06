import React from 'react'
import {
  CreateButton,
  Datagrid,
  FunctionField,
  type Identifier,
  List,
  TopToolbar
} from 'react-admin'

export default function ReferenceDataList(
  item: ReferenceItem
): React.ReactElement {
  const cName: string = item.name
  const ListActions = () => (
    <TopToolbar>
      <CreateButton to={`/reference-data/${cName}/create`} />
    </TopToolbar>
  )
  return (
    <List actions={<ListActions />}>
      <Datagrid
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `/reference-data/${cName}/${cID}`
        }}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
      </Datagrid>
    </List>
  )
}
