import Share from 'react-native-share';

export const shareArticle = async () => {
  try {
    await Share.open({
      title: article.title,
      message: `${article.title}\nhttps://yourwebsite.com/articles/${article.slug}`,
    });
  } catch (err) {
    console.log(err);
  }
};