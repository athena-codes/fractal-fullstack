import LandingPage from "../LandingPage"
import DailyOverview from "../DailyOverview"
import { useSelector } from "react-redux"

function MainContent () {
  const sessionUser = useSelector(state => state.session.user)
  return sessionUser ? <DailyOverview /> : <LandingPage />
}

export default MainContent;
