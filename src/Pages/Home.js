import CheckPermission from "../Components/Layout/CheckPermission";
import Services from "../Components/Services/Services";

const Home = () => {
  return (
    <CheckPermission permission={"home"}>
      <Services />
    </CheckPermission>
  );
};

export default Home;
