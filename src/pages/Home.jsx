import HeroSlider from "../components/Home/HeroSlider";
import NewCollections from "../components/Home/NewCollections/NewCollections";
import FeatureCollections from "../components/Home/FeatureCollections/FeatureCollections";
import Testimonials from "../components/Home/Testimonials/Testimonials";
import Highlights from "../components/Home/Highlights/Highlights";


function Home() {
  return (
    <>
      <HeroSlider />
      <NewCollections />
      <FeatureCollections />
      <Testimonials />
      <Highlights />
    </>
  );
}

export default Home;