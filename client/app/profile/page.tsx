import Navbar from '../components/navbar';

export default function Page() {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Navbar />
      <h1>Hello, Profile page!</h1>
    </div>
  );
}
