import {
  getActiveReferenceData,
  getReferenceData
} from '../providers/dataProvider/reference-data'
import users from '../providers/dataProvider/users'
import { generateSalt, encryptData } from './encryption'
import {
  generatePlatform,
  generateProject,
  generateBatch,
  generateItems
} from './generateData'
import * as constants from '../constants'
import localForage from 'localforage'

const loadDefaultData = async (userId?: number) => {
  const user = typeof userId === 'undefined' ? users[0].id : userId

  const platforms = generatePlatform(10)
  const projects = generateProject(10, user)
  const organisation = getReferenceData('Organisation')
  const department = getActiveReferenceData('Department', 5)
  const vaultLocation = getReferenceData('Vault Location')
  const mediaType = getReferenceData('Media')
  const protectiveMarking = getReferenceData('Protective Marking')
  const protectiveMarkingAuthority = getReferenceData(
    'Protective Marking Authority'
  )
  const platformOriginator = getReferenceData('Platform Originator')

  const encryptedUsers = users.map((user) => {
    const salt: string = generateSalt()
    const userPassword: string = user.password
    const updatedUser = {
      ...user,
      salt,
      password: encryptData(`${userPassword}${salt}`)
    }
    return updatedUser
  })

  const batches = generateBatch(
    10,
    platforms.length,
    department.length,
    projects.length,
    organisation.length,
    protectiveMarking.length,
    user
  )

  const items: Item[] = []
  const numItems = 10
  batches.forEach((batch: Batch, index: number) => {
    const project = projects.find((project) => project.id === batch.project)
    if (project !== undefined) {
      items.push(
        ...generateItems(
          numItems,
          numItems * index,
          batches[index],
          vaultLocation.length,
          protectiveMarking.length,
          user
        )
      )
    }
  })

  const defaultData: RCOStore = {
    users: encryptedUsers,
    batches,
    items,
    platforms,
    projects,
    organisation,
    department,
    vaultLocation,
    mediaType,
    protectiveMarking,
    protectiveMarkingAuthority,
    platformOriginator
  }

  // push all the default data into resources in localForage
  for (const [key, value] of Object.entries(defaultData)) {
    await localForage.setItem(`${constants.LOCAL_STORAGE_DB_KEY}${key}`, value)
  }
}

export default loadDefaultData
