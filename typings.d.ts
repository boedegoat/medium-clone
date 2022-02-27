export interface Post {
  _id: string
  _createdAt: string
  title: string
  author: {
    name: string
    image: string
  }
  comments: Comment[]
  description: string
  mainImage: {
    asset: {
      url: string
    }
  }
  slug: {
    current: string
  }
  body: object[]
}

export interface Comment {
  _createdAt: Date
  _id: string
  _rev: string
  _type: string
  _updatedAt: Date
  approved: boolean
  comment: string
  email: string
  name: string
  post: {
    _ref: string
    _type: string
  }
}

export interface FormInput {
  _id: string
  name: string
  email: string
  comment: string
}
