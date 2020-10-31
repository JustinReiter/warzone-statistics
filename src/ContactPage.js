import React from 'react';
import './ContactPage.css';
import ContactCard from './components/ContactCard';

function ContactPage() {
  return (
    <div className="App">
		<header className="App-header">
			<ContactCard />
      	</header>
    </div>
  );
}

export default ContactPage;
