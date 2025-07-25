import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <Dropdown>
      <Dropdown.Toggle 
        variant="outline-light" 
        id="language-dropdown"
        className="d-flex align-items-center border-0"
        style={{ backgroundColor: 'transparent' }}
      >
        <FontAwesomeIcon icon={faGlobe} className="me-2" />
        <span className="d-none d-md-inline">{currentLang?.flag} {currentLang?.name}</span>
        <span className="d-md-none">{currentLang?.flag}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {availableLanguages.map(lang => (
          <Dropdown.Item
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            active={lang.code === currentLanguage}
            className="d-flex align-items-center"
          >
            <span className="me-2">{lang.flag}</span>
            {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
