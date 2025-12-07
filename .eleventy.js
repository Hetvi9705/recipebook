const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Copy CSS to output
  eleventyConfig.addPassthroughCopy("src/css");
  
  // Add date filter
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat("MMMM dd, yyyy");
  });
  
  // Add excerpt filter
  eleventyConfig.addFilter("excerpt", (content, length = 150) => {
    if (!content) return '';
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > length ? text.slice(0, length) + '...' : text;
  });

  // Add limit filter
  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};