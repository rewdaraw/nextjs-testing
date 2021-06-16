export interface ITag {
  id: number
  name: string
}

export interface IPost {
  id: number
  title: string
  content: string
  username: string
  tags: ITag[]
  created_at: string
}
