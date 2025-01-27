import { Box, Typography } from '@mui/material'
import React from 'react'
import { TextField, Show, SimpleShowLayout, DateField } from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import ItemsReport from '../items/ItemsReport'

interface Props {
  batchId: string
}

export default function BatchReport(props: Props): React.ReactElement {
  const { batchId } = props

  return (
    <Box padding={'20px'}>
      <Typography variant='h4' textAlign='center' margin='10px'>
        Batch Report
      </Typography>

      <Show actions={false} resource={constants.R_BATCHES} id={batchId}>
        <Typography variant='h6' margin='16px'>
          Batch details:
        </Typography>
        <SimpleShowLayout>
          <TextField source='batchNumber' />
          <DateField source='createdAt' />
          <SourceField source='project' reference={constants.R_PROJECTS} />
          <SourceField source='platform' reference={constants.R_PLATFORMS} />
        </SimpleShowLayout>
      </Show>

      <ItemsReport storeKey='batch-report-items' filter={{ batchId }} />
    </Box>
  )
}
