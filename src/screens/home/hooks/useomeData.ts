// import { useEffect, useState, useMemo } from 'react';
// import { getHeroPost } from '../api/home.api';
// import { getEditorPick } from '../api/home.api';

// const IMAGE_BASE_URL = 'https://admin.lexwitness.com/uploads/posts';

// export const useHomeData = () => {
//   const [articles, setArticles] = useState<any[]>([]);
//   const [editorPicks, setEditorPicks] = useState<any[]>([]);
//   const [latestEditionData, setLatestEditionData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [heroRes, editorRes] = await Promise.all([
//           getHeroPost(),
//           getEditorPick(),
//         ]);

//         setArticles(heroRes || []);
//         setEditorPicks(editorRes || []);
//       } catch (error) {
//         console.log('Home API Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   /**
//    * Split data for UI sections
//    */
//   const { firstCard, nextTwoCards, remainingCards } = useMemo(() => {
//     return {
//       firstCard: articles?.[0] || null,
//       nextTwoCards: articles?.slice(1, 3) || [],
//       remainingCards: articles?.slice(3) || [],
//     };
//   }, [articles]);

//   /**
//    * Helpers
//    */
//   const formatDate = (item: any) => {
//     const month = item?.magazine?.month?.name || '';
//     const year = item?.magazine?.year || '';
//     return `${month} ${year}`;
//   };

//   const getImage = (img: string) => `${IMAGE_BASE_URL}/${img}`;

//   return {
//     loading,
//     firstCard,
//     nextTwoCards,
//     remainingCards,
//     editorPicks,
//     latestEditionData,
//     setLatestEditionData,
//     formatDate,
//     getImage,
//   };
// };