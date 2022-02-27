import Container from 'components/Container'
import { sanityClient, urlFor } from 'lib/sanity'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import type { FormInput, Post } from 'typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'

interface Props {
  post: Post
}
const Post: NextPage<Props> = ({ post }) => {
  console.log(post)
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <Container title={post.title}>
      {post.mainImage && (
        <img
          src={urlFor(post.mainImage).url()}
          alt={post.title}
          className="h-52 w-full object-cover"
        />
      )}
      <article className="small-wrapper p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={urlFor(post.author.image).url()}
            alt={post.author.name}
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Publised at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              li: (props: any) => <li className="ml-4 list-disc" {...props} />,
              link: (props: any) => (
                <a className="text-blue-500 hover:underline" {...props} />
              ),
            }}
          />
        </div>

        {/* form comment */}
        <div className="my-10">
          {submitted ? (
            <div className="bg-yellow-500 p-10 text-white">
              <h3 className="text-3xl font-bold">
                Thank you for submitting your comment !
              </h3>
              <p>Once it has been approved, it will appear bellow </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <h3 className="text-sm text-yellow-500">
                Enjoyed this article ?
              </h3>
              <h4 className="mb-8 text-3xl font-bold">Leave a comment below</h4>

              <input
                {...register('_id')}
                type="hidden"
                name="_id"
                value={post._id}
              />

              <label className="mb-5 block">
                <span className="text-gray-700">Name</span>
                <input
                  {...register('name', { required: true })}
                  className="form-input mt-1 block w-full rounded border py-2 px-3 shadow ring-yellow-500 focus:outline-none focus:ring-2"
                  type="text"
                  placeholder="Your Name"
                />
                {errors.name && (
                  <span className="text-sm text-red-500">
                    The name field is required
                  </span>
                )}
              </label>
              <label className="mb-5 block">
                <span className="text-gray-700">Email</span>
                <input
                  {...register('email', { required: true })}
                  className="form-input mt-1 block w-full rounded border py-2 px-3 shadow ring-yellow-500 focus:outline-none focus:ring-2"
                  type="text"
                  placeholder="example@email.com"
                />
                {errors.name && (
                  <span className="text-sm text-red-500">
                    The email field is required
                  </span>
                )}
              </label>
              <label className="mb-5 block">
                <span className="text-gray-700">Comment</span>
                <textarea
                  {...register('comment', { required: true })}
                  className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow ring-yellow-500 focus:outline-none focus:ring-2"
                  rows={8}
                  placeholder="Your Comment"
                ></textarea>
                {errors.comment && (
                  <span className="text-sm text-red-500">
                    The comment field is required
                  </span>
                )}
              </label>

              <input
                type="submit"
                className="cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow ring-yellow-400 hover:bg-yellow-400 focus:outline-none focus:ring-2"
              />
            </form>
          )}
        </div>

        {/*end  form comment */}

        {/* comments */}
        <div className="tiny-wrapper">
          <h3 className="text-2xl font-bold">
            Comments ({post.comments.length})
          </h3>
          <div className="mt-8 space-y-5">
            {post.comments.map((comment) => (
              <div key={comment._id} className="rounded-lg border p-5 shadow">
                <p className="font-medium text-yellow-500">{comment.name}</p>
                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* end comments */}
      </article>
    </Container>
  )
}

export default Post

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"]{
    slug {
      current
    }
  }`
  const posts: Post[] = await sanityClient.fetch(query)
  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug.current,
      },
    }
  })
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    slug,
    author -> {
      name,
      image
    },
    'comments': *[_type == "comment" && post._ref == ^._id &&approved == true],
    description,
    mainImage,
    body
  }`
  const post = await sanityClient.fetch(query, { slug: params?.slug })

  // if post is not exist with the slug, send user to 404 page
  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: { post },
    revalidate: 60, // after 60 seconds, update this static page if a user visit this page
  }
}
