import { useEffect } from 'react';
import DesignFrame from '../design/DesignFrame';
import home from '../data/siteContent';

export default function Home() {
  useEffect(() => { document.title = home.title; }, []);
  return (
    <main id="main">
      {home.sections.map(section => <DesignFrame key={section.id} section={section} projectName="Vishnu Dinesh" />)}
    </main>
  );
}
