import { type UserIdentity, type AuthProvider, type DataProvider } from 'react-admin'
import * as constants from '../../constants'
import { AuditType, trackEvent } from '../../utils/audit'
import {
  decryptData,
  decryptPassword,
  encryptData,
  generateSalt
} from '../../utils/encryption'
export const getUser = (): User | undefined => {
  const encryptedUser = localStorage.getItem(constants.TOKEN_KEY)
  const salt = localStorage.getItem(constants.SALT)
  if (encryptedUser !== null && salt !== null) {
    const decryptedData = decryptData(`${encryptedUser}`)
    return JSON.parse(
      decryptedData.substring(0, decryptedData.length - salt.length)
    )
  }
}

const setToken = (token: string, salt: string): void => {
  localStorage.setItem(constants.TOKEN_KEY, token)
  localStorage.setItem(constants.SALT, salt)
}

const removeToken = (): void => {
  localStorage.removeItem(constants.TOKEN_KEY)
  localStorage.removeItem(constants.SALT)
}

const authProvider = (dataProvider: DataProvider): AuthProvider => {
  const audit = trackEvent(dataProvider)
  return {
    login: async ({ username, password }) => {
      const data = await dataProvider.getList(constants.R_USERS, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1 },
        filter: { name: username }
      })
      const user = data.data.find((item: any) => item.name === username)
      if (user !== undefined) {
        const salt: string = user.salt
        const userHashedPassword: string = user.password
        const decryptedPassword = decryptPassword(userHashedPassword, salt)
        if (password === decryptedPassword) {
          const clonedUser: Omit<User, 'password'> & { password?: string } = {
            ...user
          }
          delete clonedUser.password
          const salt: string = generateSalt()
          const token = encryptData(`${JSON.stringify(clonedUser)}${salt}`)
          setToken(token, salt)
          await audit(AuditType.LOGIN, 'Logged in')
          return await Promise.resolve(data)
        } else {
          throw new Error('Wrong password')
        }
      } else {
        throw new Error('Wrong username')
      }
    },
    logout: async (): Promise<void> => {
      await audit(AuditType.LOGOUT, 'Logged out')
      removeToken()
      await Promise.resolve()
    },
    checkAuth: async (): Promise<void> => {
      const token = getUser()
      token !== undefined
        ? await Promise.resolve()
        : await Promise.reject(new Error('Token not found'))
    },
    checkError: async (error): Promise<any> => {
      const status = error.status
      if (status === 401 || status === 403) {
        removeToken()
        await Promise.reject(
          new Error('Server returned code ' + String(status))
        )
      }
      await Promise.resolve()
    },
    getIdentity: async () => {
      const user = getUser()
      if (user !== undefined) {
        const userIdentity: UserIdentity = { ...user, fullName: user.name }
        return userIdentity
      } else return await Promise.reject(new Error('user not found'))
    },

    getPermissions: async () => {
      try {
        const user = getUser()
        if (user !== undefined) {
          const isAdmin = user.adminRights
          return await Promise.resolve(isAdmin ? 'admin' : 'user')
        } else {
          throw new Error('You are not a registered user.')
        }
      } catch (error) {
        await Promise.resolve()
      }
    }
  }
}

export default authProvider
