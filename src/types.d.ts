interface User {
  id: number
  name: string
  password: string
  adminRights: boolean
}

interface Audit {
  id: number
  activity_type: string
  date_time: string
  activity_detail?: string
}

interface Platform {
  id: number
  name: string
  active: boolean
}

interface Project {
  id: number
  name: string
  start_date: string
  end_date: string
  project_code: string
  remarks: string
}

interface Batch {
  id: number
  name: string
  batch_number: string
  vault: number
  year_of_receipt: string
  department: ReferenceItem['id']
  project: Project['id']
  platform: Platform['id']
  organisation: ReferenceItem['id']
  protective_marking_authority: ReferenceItem['id']
  maximum_protective_marking: ReferenceItem['id']
  remarks: string
}

/** a generic type, used for our assorted reference data lists. Once the
 * interface becomes more complex, introduce a type-specific interface
 */
interface ReferenceItem {
  id: number
  name: string
}

interface CoreMedia {
  readonly media_type: MediaType
}
interface DVD extends CoreMedia {
  size: number
}

interface Tape extends CoreMedia {
  minutes: number
  brand: string
}

interface Item {
  id: number
  media_type: MediaType
  start: string
  batch_id: Batch['id']
  item_number: string
  end: string
  vault_location: ReferenceItem['id']
  remarks: string
  protective_marking: ReferenceItem['id']
  mag_tape: Tape
  dvd: DVD
  paper: Paper
}

type MediaType = 'DVD' | 'Tape' | 'Paper'
