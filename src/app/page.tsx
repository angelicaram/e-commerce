import Header from "./components/Header/header";
import List from "./components/List/list";

export default function Home() {
  return (
    <div>
      <main>
        <Header />
        <List></List>
      </main>
      <footer>
        <h5 style={{color: 'GrayText', opacity: '0.5', marginTop: 10, marginBottom: 10}}>Versión 0.0.1</h5>
      </footer>
    </div>
  );
}
