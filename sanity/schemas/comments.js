export default {
  name: 'comment',
  type: 'document',
  title: 'Comment',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'approved',
      type: 'boolean',
      title: 'Approved',
      description: 'Comments will not show on the site without approval',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    {
      name: 'comment',
      type: 'string',
      title: 'Comment',
    },
    {
      name: 'post',
      type: 'reference',
      to: [{ type: 'post' }],
    },
  ],
}
