module.exports = {
  name: 'document',
  fields: {
    title: String,
    markdown: String,
    html: String,
    createTime: Date,
    updateTime: Date,
    createAuthor: String,
    updateAuthor: String,
    parentId: String,
    needPublish: {type: Boolean, default: false}
  }
};