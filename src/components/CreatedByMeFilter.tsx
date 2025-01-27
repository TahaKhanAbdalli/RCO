import {
  type Identifier,
  useGetIdentity,
  useListContext,
  useNotify
} from 'react-admin'
import { useEffect } from 'react'
import { Chip } from '@mui/material'

interface Props {
  label?: string
  source: string
}

export default function CreatedByMeFilter(props: Props) {
  const { source } = props
  const { data, isLoading } = useGetIdentity()
  const { setFilters, displayedFilters, filterValues } = useListContext()
  const notify = useNotify()
  const loading: boolean = isLoading

  useEffect(() => {
    if (!loading) {
      const createdBy: Identifier | undefined = data?.id
      if (createdBy === undefined) {
        notify('User not found!', { type: 'error' })
        return
      }
      setFilters({ ...filterValues, [source]: createdBy }, displayedFilters)
    }
  }, [loading])

  if (loading) return null

  return <Chip sx={{ marginBottom: '9px' }} label={data?.fullName} />
}
