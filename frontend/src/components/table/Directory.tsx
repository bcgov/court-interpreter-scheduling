import React from 'react';
import { Box } from '@material-ui/core'
import { StyledTable } from 'vaping-regulation-shared-components'
import { SearchParams } from '../../constants/interfaces'

export default function DirectoryTable({ searchParams, data }: { searchParams: SearchParams, data: Array<any> }) {

  const applySearchParams = (list: Array<any>) =>
    list.filter(i => searchParams.level.length ? searchParams.level.includes(i.level.toString()) : true)

  return (
    <Box mt={4}>
      <StyledTable
        data={applySearchParams(data)}
        columns={[
          { title: 'Name', field: 'name', },
          { title: 'Phone', field: 'phone', },
          { title: 'Level', field: 'level', },
          { title: 'Email', field: 'emailAddress', }
        ]}
        options={{
          pageSize: 10
        }}
      />
    </Box>
  )
}
