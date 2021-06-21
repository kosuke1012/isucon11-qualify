import axios from 'axios'

class Apis {
  async postAuth(jwt: string) {
    await axios.post<void>(
      '/api/auth',
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` }
      }
    )
  }

  async postSignout() {
    await axios.post<void>('/api/signout')
  }

  async getUserMe() {
    const { data } = await axios.get<User>('/api/user/me')
    return data
  }

  async getCatalog(catalogId: string) {
    const { data } = await axios.get<Catalog>(`/api/catalog/${catalogId}`)
    return data
  }

  async getIsus() {
    const { data } = await axios.get<Isu[]>(`/api/isu`)
    return data
  }

  async postIsu(isu: Isu) {
    await axios.post<void>(`/api/isu`, isu)
  }

  async getIsuSearch(option?: IsuSearchRequest) {
    const { data } = await axios.get<Isu[]>(`/api/isu/search`, {
      params: option
    })
    return data
  }

  async getIsu(jiaIsuUuid: string) {
    const { data } = await axios.get<Isu>(`/api/isu/${jiaIsuUuid}`)
    return data
  }

  async putIsu(jiaIsuUuid: string, putIsuRequest: PutIsuRequest) {
    const { data } = await axios.put<Isu>(
      `/api/isu/${jiaIsuUuid}`,
      putIsuRequest
    )
    return data
  }

  async deleteIsu(jiaIsuUuid: string) {
    await axios.delete<Isu>(`/api/isu/${jiaIsuUuid}`)
  }

  async putIsuIcon(jiaIsuUuid: string, file: File) {
    const data = new FormData()
    data.append('image', file, file.name)
    await axios.put<void>(`/api/isu/${jiaIsuUuid}/icon`, data, {
      headers: { 'content-type': 'multipart/form-data' }
    })
  }

  async getIsuGraphs(jiaIsuUuid: string) {
    const { data } = await axios.get<Graph[]>(`/api/isu/${jiaIsuUuid}/graph`)
    return data
  }

  async getConditions() {
    const { data } = await axios.get<Condition[]>(`/api/condition`)
    return data
  }

  async getIsuConditions(jiaIsuUuid: string) {
    const { data } = await axios.get<Condition[]>(
      `/api/condition/${jiaIsuUuid}`
    )
    return data
  }
}

const apis = new Apis()
export default apis

export interface User {
  jia_user_id: string
}

export interface Isu {
  jia_isu_uuid: string
  name: string
  jia_catalog_id: string
  character: string
}

export interface Catalog {
  jia_catalog_id: string
  name: string
  limit_weight: number
  weight: number
  size: string
  maker: string
  tags: string
}

export interface IsuLog {
  jia_isu_uuid: string
  timestamp: string
  is_sitting: boolean
  condition: string
  message: string
  created_at: string
}

export interface GraphData {
  score: number
  sitting: number
  detail: { [key: string]: number }
}

export interface Graph {
  jia_isu_uuid: string
  start_at: string
  end_at: string
  data: GraphData
  created_at: string
  updated_at: string
}

export interface IsuSearchRequest {
  name?: string
  charactor?: string
  catalog_name?: string
  min_limit_weight?: number
  max_limit_weight?: number
  catalog_tags?: string
  page?: string
}

export interface PutIsuRequest {
  name: string
}

export interface Condition {
  jia_isu_uuid: string
  isu_name: string
  timestamp: string
  is_sitting: boolean
  condition: string
  condition_level: string
  message: string
}
