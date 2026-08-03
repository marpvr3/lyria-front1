import { HomeScreen } from "@/features/home";
import { mockUser, mockProfile, mockRestaurants } from "@/features/home/data/home.mock";

function App() {
  return (
    <HomeScreen
      user={mockUser}
      profile={mockProfile}
      restaurants={mockRestaurants}
      onCategory={(cat) => console.info("category:", cat)}
      onOpen={(id) => console.info("open:", id)}
      onMap={() => console.info("map")}
      onFavorites={() => console.info("favorites")}
      onRecommend={() => console.info("recommend")}
      onNavigate={(screen) => console.info("navigate:", screen)}
      onLogout={() => console.info("logout")}
    />
  );
}

export default App;
