require('dotenv').config();
const contentful = require('contentful');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

// Create Contentful client with environment variables
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

// Main function that Eleventy will call to fetch data
module.exports = async function() {
  try {
    const entries = await client.getEntries({
      content_type: 'recipeStory',
      order: '-sys.createdAt' // Newest first
    });

    console.log(` Fetched ${entries.items.length} recipe stories`);

    return entries.items.map(item => {
      const fields = item.fields;
      
      // Create URL-friendly slug from title if no custom slug provided
      const slug = fields.slug || fields.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Convert Contentful rich text to HTML - try both possible field names
      let content = '';
      if (fields.story) {
        content = documentToHtmlString(fields.story);
      } else if (fields.body) {
        content = documentToHtmlString(fields.body);
      }

      return {
        title: fields.title || 'Untitled',
        story: fields.story || '', // Keep original rich text
        body: fields.body || '', // Keep original rich text  
        content: content, // HTML content for templates
        author: fields.author || 'Hetvi Patel',
        description: fields.description || fields.excerpt || '',
        date: fields.date || item.sys.createdAt,
        excerpt: fields.excerpt || fields.description || "",
        slug: slug,
        url: `/recipe-stories/${slug}/`
      };
    });
  } catch (error) {
    console.error('Recipe Stories error:', error.message);
    return []; // Return empty array to prevent build failures
  }
};