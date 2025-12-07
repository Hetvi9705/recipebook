require('dotenv').config();
const contentful = require('contentful');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

module.exports = async function() {
  try {
    const entries = await client.getEntries({
      content_type: 'blogPost',
      order: '-fields.publishedDate' // Most recent first
    });

    const posts = entries.items.map(item => {
      return {
        title: item.fields.title,
        slug: item.fields.slug,
        publishedDate: item.fields.publishedDate,
        
        // Process featured image if available
        featuredImage: item.fields.featuredImage
          ? "https:" + item.fields.featuredImage.fields.file.url
          : null,

        description: item.fields.description || "",
        
        // Convert Contentful rich text fields to HTML
        ingredients: item.fields.ingredients
          ? documentToHtmlString(item.fields.ingredients)
          : "",
        method: item.fields.method
          ? documentToHtmlString(item.fields.method)
          : "",
        body: item.fields.body
          ? documentToHtmlString(item.fields.body)
          : "",

        excerpt: item.fields.description || "",
        author: item.fields.author || "Anonymous",
        featured: item.fields.featured || false
      };
    });

    return posts;
  } catch (error) {
    console.error(' Error fetching posts from Contentful:', error);
    return [];
  }
};