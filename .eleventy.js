const { DateTime } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.setDataDeepMerge(true);

  // eleventyConfig.addLayoutAlias(from, to)
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
  eleventyConfig.addLayoutAlias('work', 'layouts/work.njk');

  // PASSTHROUGH:
  //// Specify files or directories for Eleventy to copy into /dist.
  // eleventyConfig.addPassthroughCopy("src/assets/images")
  eleventyConfig.addPassthroughCopy('src/assets/js');
  eleventyConfig.addPassthroughCopy('src/site.webmanifest');
  eleventyConfig.addPassthroughCopy('src/robots.txt');

  // COLLECTIONS:
  //// Group content & create a collections object to access
  //// ie: for tags in collections.tagList
  eleventyConfig.addCollection('', require('./_11ty/getTagList'));

  // Collections: Navigation
  eleventyConfig.addCollection('nav', function (collection) {
    return collection.getFilteredByTag('nav').sort(function (a, b) {
      return a.data.navorder - b.data.navorder;
    });
  });

  eleventyConfig.addCollection('work', function (collection) {
    return collection.getFilteredByTag('work').sort(function (a, b) {
      return a.data.workorder - b.data.workorder;
    });
  });

  // UNIVERSAL FILTERS:
  //// Custom filters to modify content.
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter('currentPage', (allPages, currentPage) => {
    const matches = allPages.filter((page) => page.inputPath === currentPage.inputPath);
    if (matches && matches.length) {
      return matches[0];
    }
    return null;
  });

  eleventyConfig.addFilter('media', (filename, page) => {
    const path = page.inputPath.split('/');
    if (path.length && path.includes('posts')) {
      const subdir = path[path.length - 2];
      return `/assets/media/${subdir}/${filename}`;
    }
    return filename;
  });

  eleventyConfig.addFilter('excerpt', (content) => {
    const excerptMinimumLength = 80;
    const excerptSeparator = '<!--more-->';
    const findExcerptEnd = (content) => {
      if (content === '') {
        return 0;
      }

      const paragraphEnd = content.indexOf('</p>', 0) + 4;
      if (paragraphEnd < excerptMinimumLength) {
        return paragraphEnd + findExcerptEnd(content.substring(paragraphEnd), paragraphEnd);
      }

      return paragraphEnd;
    };

    if (!content) {
      return;
    }

    if (content.includes(excerptSeparator)) {
      return content.substring(0, content.indexOf(excerptSeparator));
    } else if (content.length <= excerptMinimumLength) {
      return content;
    }

    const excerptEnd = findExcerptEnd(content);
    return content.substring(0, excerptEnd);
  });

  // MARKDOWN PLUGINS
  let markdownIt = require('markdown-it');
  let markdownItAnchor = require('markdown-it-anchor');
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#'
  };

  eleventyConfig.setLibrary('md', markdownIt(options).use(markdownItAnchor, opts));

  return {
    templateFormats: ['md', 'njk', 'html'],

    // GENERAL SETTINGS
    pathPrefix: '/',
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: 'dist'
    }
  };
};
