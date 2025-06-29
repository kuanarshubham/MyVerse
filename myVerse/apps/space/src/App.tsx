import { Provider } from "react-redux"
import Space from "./components/Space/Space"
import store from "./store/store"

const Apps = () => {
  
  return (
    <Provider store={store}>
      <Space />
    </Provider>
  )
}

export default Apps