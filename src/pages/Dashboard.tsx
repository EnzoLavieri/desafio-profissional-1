export default function Dashboard() {
  const urlAtual = window.location.href.split('/')[3];

  return <h2>{urlAtual}</h2>;
}