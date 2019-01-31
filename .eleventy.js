const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("work", "layouts/work.njk");

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });


  eleventyConfig.addFilter("currentPage", (allPages, currentPage) => {
    const matches = allPages.filter(
        page => page.inputPath === currentPage.inputPath
    )
    if (matches && matches.length) {
        return matches[0]
    }
    return null
  });


  eleventyConfig.addFilter("excerpt", (content) => {
    const excerptMinimumLength = 80
    const excerptSeparator = '<!--more-->'
    const findExcerptEnd = content => {
        if (content === '') {
            return 0
        }

        const paragraphEnd = content.indexOf('</p>', 0) + 4
        if (paragraphEnd < excerptMinimumLength) {
            return (
                paragraphEnd +
                findExcerptEnd(
                    content.substring(paragraphEnd),
                    paragraphEnd
                )
            )
        }

        return paragraphEnd
    }

    if (!content) {
        return
    }

    if (content.includes(excerptSeparator)) {
        return content.substring(0, content.indexOf(excerptSeparator))
    } else if (content.length <= excerptMinimumLength) {
        return content
    }

    const excerptEnd = findExcerptEnd(content)
    return content.substring(0, excerptEnd)
  });

  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));

  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy('src/site.webmanifest')
  eleventyConfig.addPassthroughCopy('src/robots.txt')

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  return {
    templateFormats: [
      "md",
      "njk",
      "html"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    }
  };
};
