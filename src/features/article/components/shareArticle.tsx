import Share from 'react-native-share';

type ShareArticleData = {
  title: string;
  slug: string;
};

export const shareArticle = async (article: ShareArticleData) => {
  try {
    await Share.open({
      title: article.title,
      message: `${article.title}\nhttps://yourwebsite.com/articles/${article.slug}`,
    });
  } catch (err) {
    console.log(err);
  }
};