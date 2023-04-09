import {
  Admin,
  Resource,
  CustomRoutes,
  Loading,
  type DataProvider,
  Login
} from 'react-admin'
import { Route } from 'react-router-dom'
import MyLayout from './components/Layout'
import React, { Suspense, useEffect, useState } from 'react'
import { Category, Layers, Person, SettingsSuggest } from '@mui/icons-material'
import { getDataProvider } from './providers/dataProvider'
import autProvider from './providers/authProvider'

// pages
import Welcome from './pages/Welcome'

// resources
import users from './resources/users'
import audit from './resources/audit'
import { rcoTheme } from './themes/rco-theme'
import ReferenceData from './pages/ReferenceData'
import ReferenceDataList from './components/ReferenceDataList'
import projects from './resources/projects'
import batches from './resources/batches'
import ReferenceDataCreate, {
  ReferenceDataEdit
} from './resources/reference-data'
import items from './resources/items'

const LoadingPage = <Loading loadingPrimary='Loading' loadingSecondary='' />

function App(): React.ReactElement {
  const [dataProvider, setDataProvider] = useState<DataProvider | undefined>(
    undefined
  )

  const handleGetProvider = (): any => {
    if (dataProvider !== undefined) return
    getDataProvider().then(setDataProvider).catch(console.log)
  }

  useEffect(handleGetProvider, [dataProvider])

  if (dataProvider === undefined) return LoadingPage

  return (
    <Suspense fallback={LoadingPage}>
      <Admin
        dataProvider={dataProvider}
        loginPage={Login}
        authProvider={autProvider(dataProvider)}
        layout={MyLayout}
        theme={rcoTheme}
        disableTelemetry
        requireAuth>
        {(permissions) => {
          return [
            ...(permissions === 'admin'
              ? [
                  <Resource
                    key='users'
                    icon={Person}
                    name='users'
                    recordRepresentation='name'
                    {...users}
                  />,
                  <Resource
                    key='audit'
                    options={{ label: 'Audit Log' }}
                    name='audit'
                    {...audit}
                  />,
                  <Resource
                    key='batches'
                    icon={Layers}
                    name='batches'
                    {...batches}
                  />,
                  <Resource
                    key='items'
                    icon={Category}
                    name='items'
                    {...items}
                  />,
                  <CustomRoutes key='routes'>
                    <Route path='/reference-data' element={<ReferenceData />}>
                      <Route path='protectiveMarking'>
                        {...createRoutes('protectiveMarking')}
                      </Route>
                      <Route path='protectiveMarkingAuthority'>
                        {...createRoutes('protectiveMarkingAuthority')}
                      </Route>
                      <Route path='department'>
                        {...createRoutes('department')}
                      </Route>
                      <Route path='vaultLocation'>
                        {...createRoutes('vaultLocation')}
                      </Route>
                      <Route path='platformOriginator'>
                        {...createRoutes('platformOriginator')}
                      </Route>
                      <Route path='organisation'>
                        {...createRoutes('organisation')}
                      </Route>
                      <Route path='mediaType'>
                        {...createRoutes('mediaType')}
                      </Route>
                    </Route>
                  </CustomRoutes>
                ]
              : []),
            <Resource
              key='projects'
              icon={SettingsSuggest}
              name='projects'
              {...projects}
            />,

            <CustomRoutes key='routes'>
              <Route path='/' element={<Welcome />} />
            </CustomRoutes>
          ]
        }}
      </Admin>
    </Suspense>
  )
}

const createRoutes = (name: string) => {
  const cName: string = name
  return [
    <Route
      key={`${cName}list`}
      index
      element={<ReferenceDataList name={name} />}
    />,
    <Route
      key={`${cName}edit`}
      path=':id'
      element={<ReferenceDataEdit name={name} />}
    />,
    <Route
      key={`${cName}create`}
      path='create'
      element={<ReferenceDataCreate name={name} />}
    />
  ]
}

export default App
