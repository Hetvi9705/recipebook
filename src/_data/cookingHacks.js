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
      content_type: 'cookingHack', 
      order: '-sys.createdAt' // Newest first
    });

    console.log(` Fetched ${entries.items.length} cooking hacks`);

    return entries.items.map(item => {
      const fields = item.fields;
      
      // Process featured image if available
      let featuredImage = null;
      if (fields.featuredImage?.fields?.file) {
        featuredImage = 'https:' + fields.featuredImage.fields.file.url;
      }

      // Create URL-friendly slug from title if no custom slug provided
      const slug = fields.slug || fields.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Convert Contentful rich text to HTML for body content
      let content = '';
      if (fields.body) {
        content = documentToHtmlString(fields.body);
      }

      return {
        title: fields.title || 'Untitled',
        description: fields.description || '',
        author: fields.author || 'Hetvi Patel',
        date: fields.date || item.sys.createdAt,
        featuredImage,
        body: fields.body || '', // Keep original rich text
        content: content, // HTML content for templates
        slug,
        url: `/cooking-hacks/${slug}/`
      };
    });
  } catch (error) {
    console.error(' Cooking Hacks error:', error.message);
    return [];
  }
};