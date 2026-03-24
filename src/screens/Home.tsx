import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../components/Header';
import Menubar from '../components/Menubar';
import HeroCard from '../components/HeroCard';
import { getHeroPost } from '../services/api/heroCard';
import ListCard from '../components/ListCard/ListCard';
import HomeAdvertisement from '../components/Advertisement/HomeAdvertisement';
import EditorPicks from '../components/EditorPicks/EditorPicks';
import { getEditorPick } from '../services/api/editorpicks';
import HomeBanner from '../components/subscrineBanner/HomeBanner';
import LatestEdition from '../components/HomeLatestEdition/LatestEdition';
import EditorialCard from '../components/Editorial/Editorial';
import LatestEditions from '../components/HomeLatest5Edition/Latest5Edition';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorpick, setEditorpick] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);

  const imgUrl = 'https://admin.lexwitness.com/uploads/posts';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHeroPost();
        const editor = await getEditorPick();
        console.log(editor);
        setArticles(res);
        setEditorpick(editor);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Split articles into sections
  const firstCard = articles[0];
  const nextTwoCards = articles.slice(1, 3);
  const remainingCards = articles.slice(3);

  return (
    <View style={styles.container}>
      <Header />
      <Menubar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* First Hero Card */}
        {firstCard && (
          <HeroCard
            category={firstCard?.category?.name}
            title={firstCard.title}
            date={
              firstCard.magazine.month.name + '  ' + firstCard.magazine.year
            }
            image={`${imgUrl}/${firstCard.image}`}
            height={450}
          />
        )}

        {/* Next Two Cards */}
        <View style={styles.rowContainer}>
          {nextTwoCards.map(item => (
            <HeroCard
              key={item.id}
              category={item?.category?.name}
              title={item.title}
              date={item?.magazine?.month?.name + '  ' + item?.magazine?.year}
              image={`${imgUrl}/${item.image}`}
              height={220}
              style={{ width: '48%' }}
            />
          ))}
        </View>

        {/* Remaining Cards (List Style) */}
        <View style={styles.containerBox}>
          {remainingCards.map((item, index) => (
            <ListCard
              key={item.id}
              category={item?.category?.name}
              title={item.title}
              date={item?.magazine?.month?.name + '  ' + item?.magazine?.year}
              isLast={index === remainingCards.length - 1}
            />
          ))}
        </View>

        <HomeAdvertisement />

        <View style={styles.mainWrapper}>
          {/* Corrected the spelling from 'hearderContainer' to 'headerContainer' */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>EDITOR PICKS</Text>
            <View style={styles.headerLine} />
          </View>

          {editorpick.map(item => (
            <EditorPicks
              key={item.id}
              image={`${imgUrl}/${item.image}`}
              title={item.title}
              author={item.author.name}
            />
          ))}
        </View>

        <HomeBanner />
        <View style={styles.fullWidth}>
  <LatestEdition onData={setLatestEditionData} />
</View>

<EditorialCard />

<View style={styles.fullWidth}>
  <LatestEditions skipId={latestEditionData?.magazine?.id} />
</View>
        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.title}>Welcome to Home Screen</Text>
          <View style={styles.buttonWrapper}>
            <Button
              title="Go to Profile"
              onPress={() => navigation.navigate('Profile')}
              color="#007AFF"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 40 },

  rowContainer: {
    flexDirection: 'col',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  fullWidth: {
  marginHorizontal: -12,
},
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  footerContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 15 },
  buttonWrapper: { width: '70%' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    width: '100%', // Take up full screen width
    height: 80, // Vertical space for the header
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    marginVertical: 10, // Space between the advertisement and the title
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700', // Made it slightly bolder for a professional look
    color: '#000',
    letterSpacing: 2, // Increased spacing to match "News" style UI
    textAlign: 'center', // Backup text alignment
    textTransform: 'uppercase', // Ensures it stays in caps
  },
  headerLine: {
    height: 5, // Thickness of the line
    width: 60, // Short width like in your image
    marginTop: 5,
    backgroundColor: '#e60000', // Red color
  },
});
