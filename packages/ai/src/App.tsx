import { Helmet } from 'react-helmet-async';
import BrainInterface from './components/BrainInterface';

export default function App() {
  return (
    <>
      <Helmet>
        <title>affynix.ai — Ask the Brain</title>
        <meta
          name="description"
          content="Ask affynix.ai anything about AI tools, apps, and services. Get ranked results grounded in evidence."
        />
      </Helmet>
      <BrainInterface />
    </>
  );
}
