import React from 'react'
import {
  BulkDeleteButton,
  CreateButton,
  DatagridConfigurable,
  FilterButton,
  List,
  SearchInput,
  SelectColumnsButton,
  TextField,
  TopToolbar
} from 'react-admin'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import DateFilter, { ResetDateFilter } from '../../components/DateFilter'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'

const omitColumns: string[] = ['createdAt']

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <CreatedByMeFilter
    key='createdByMe'
    source='createdBy_eq'
    label='Created By Me'
  />,
  <SourceInput
    key='createdBy'
    source='createdBy'
    reference={constants.R_USERS}
  />,
  <DateFilter key='createdAt' source='createdAt' label='Created At' />
]

export default function ProjectList(): React.ReactElement {
  const ListActions = () => (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <SelectColumnsButton />
    </TopToolbar>
  )

  return (
    <List actions={<ListActions />} perPage={25} filters={filters}>
      <ResetDateFilter source='createdAt' />
      <DatagridConfigurable
        omit={omitColumns}
        rowClick='show'
        bulkActionButtons={<BulkDeleteButton mutationMode='pessimistic' />}>
        <TextField source='name' />
        <TextField source='remarks' />
        <TextField source='createdAt' label='Created' />
      </DatagridConfigurable>
    </List>
  )
}
