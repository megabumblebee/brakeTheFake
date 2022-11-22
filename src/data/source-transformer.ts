/*
    Each source has its own style of passing objects - this file unifies it
 */

export const transformNewsFromSource = (newsFromSource, sourceUrl) => {
  let objectWithNews = [];
  if([
    "https://www.pb.pl/rss/najnowsze.xml",
    "https://www.polsatnews.pl/rss/wszystkie.xml",
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "http://www.dobre-wiesci.pl/feed",
    "http://www.tvn24.pl/polska.xml",
    "http://www.tokfm.pl/pub/rss/tokfmpl_polska.xml",
    "https://centrumpr.pl/artykuly.rss",
    "http://www.tvn24.pl/polska.xml",
  ].includes(sourceUrl)) {
    objectWithNews = newsFromSource.rss.channel.item.map(news => {
      return {
        title: news.title,
        link: news.link,
        description: news.description,
        timestamp: new Date(news.pubDate),
      };
    });
  } else if (sourceUrl === "https://wiadomosci.onet.pl/9,sitemap-news.xml") {
    objectWithNews = newsFromSource.urlset.url.map(news => {
      return {
        title: news["news:news"]["news:title"],
        link: news.loc,
        description: null,
        timestamp: new Date(news["news:news"]["news:publication_date"]),
        // articleClass: 'detailContentWrapper',
      };
    });
  } else if (sourceUrl === "https://wiadomosci.wp.pl/newssitemap.xml") {
    objectWithNews = newsFromSource.urlset.url.map(news => {
      return {
        title: news["n:news"]["n:title"],
        link: news.loc,
        description: null,
        timestamp: new Date(news["n:news"]["n:publication_date"]),
      };
    });
  }

  return objectWithNews;
}