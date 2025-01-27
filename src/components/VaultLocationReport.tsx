import { Article } from '@mui/icons-material'
import {
  Box,
  Button,
  Table,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import { type ReactElement, useEffect, useState } from 'react'
import {
  type ListProps,
  TextField,
  useDataProvider,
  useListContext,
  Count
} from 'react-admin'
import ItemsReport from '../resources/items/ItemsReport'
import Printable from './Printable'
import * as constants from '../constants'
import SourceField from './SourceField'
import { DateTime } from 'luxon'
import ReportSignature from './ReportSignature'

type ReferenceItemById = Record<number, ReferenceItem>
interface Result {
  name: string
  count: number
}

function ProtectiveMarking() {
  const { data = [] } = useListContext<Item>()
  const dataProvider = useDataProvider()
  const [result, setResult] = useState<Result[]>([])

  const getTableData = async () => {
    const items: Record<number, number> = {}
    data.forEach((item) => {
      const count = items[item.protectiveMarking]
      if (typeof count !== 'number') {
        items[item.protectiveMarking] = 1
      } else {
        items[item.protectiveMarking] = count + 1
      }
    })
    const { data: protectiveMarkings } =
      await dataProvider.getMany<ReferenceItem>('protectiveMarking', {
        ids: Object.keys(items)
      })

    const protectiveMarkingById: ReferenceItemById = {}

    protectiveMarkings.forEach((protectiveMarking) => {
      protectiveMarkingById[protectiveMarking.id] = protectiveMarking
    })

    const result: Result[] = []

    Object.keys(items).forEach((itemKey: string) => {
      const key = Number(itemKey)
      const { name } = protectiveMarkingById[key]
      result.push({ name, count: items[key] })
    })
    return result
  }

  useEffect(() => {
    getTableData().then(setResult).catch(console.log)
  }, [data])

  return (
    <Box width={300} marginLeft='auto' marginTop={1} marginBottom={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>PM</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.map((item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

type Props = PartialBy<ListProps, 'children'>

export default function VaultLocationReport(props: Props): ReactElement {
  const [open, setOpen] = useState(false)
  const { selectedIds } = useListContext()

  const [locations, setLocations] = useState<ReferenceItemById>()
  const dataProvider = useDataProvider()
  useEffect(() => {
    dataProvider
      .getList<ReferenceItem>(constants.R_VAULT_LOCATION, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: { id: selectedIds }
      })
      .then(({ data }) => {
        const locations: ReferenceItemById = {}
        data.forEach((location) => {
          const { id } = location
          locations[id] = location
        })
        setLocations(locations)
      })
      .catch(console.log)
  }, [selectedIds.length])

  const handleOpen = (open: boolean) => () => {
    setOpen(open)
  }

  return (
    <>
      <Button
        startIcon={<Article />}
        sx={{ lineHeight: '1.5' }}
        size='small'
        onClick={handleOpen(true)}>
        Location Muster List
      </Button>
      <Printable open={open} onClose={handleOpen(false)}>
        <>
          {selectedIds.map((id, index) => {
            return (
              <>
                <Box padding={'20px'} key={id}>
                  <Typography variant='h4' textAlign='center' margin='10px'>
                    RCO - Location Muster List
                  </Typography>
                  <Typography variant='h5' textAlign='center' margin='10px'>
                    100% Muster List for {locations?.[id]?.name}, printed{' '}
                    {DateTime.fromISO(new Date().toISOString()).toFormat(
                      'dd/MMM/yyyy HH:mm'
                    )}{' '}
                    (
                    {
                      <Count
                        resource={constants.R_ITEMS}
                        sx={{ fontSize: '1.5rem' }}
                        filter={{ vaultLocation: id }}
                      />
                    }{' '}
                    items)
                  </Typography>
                  <ItemsReport
                    filter={{ vaultLocation: id }}
                    {...props}
                    footer={ProtectiveMarking}>
                    <TextField source='item_number' label='Item Number' />
                    <TextField source='mediaType' label='Media type' />
                    <SourceField
                      source='protectiveMarking'
                      reference='protectiveMarking'
                    />
                  </ItemsReport>
                  <ReportSignature id={id} />
                </Box>
                {selectedIds.length !== index + 1 && (
                  <div className='pagebreak' />
                )}
              </>
            )
          })}
        </>
      </Printable>
    </>
  )
}
