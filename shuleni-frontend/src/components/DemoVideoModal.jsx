import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';

const DemoVideoModal = ({ show, onHide }) => {
  const { t } = useLanguage();
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      className="demo-video-modal"
    >
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h4 className="mb-0">{t('demoModalTitle')}</h4>
        </Modal.Title>
        <Button 
          variant="link" 
          onClick={onHide}
          className="btn-close-custom"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="video-container">
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/n_6eelBgMHs?autoplay=1&rel=0&modestbranding=1"
            title="Shuleni App Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: '8px'
            }}
          ></iframe>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 pb-3">
        <div className="w-100 text-center">
          <p className="text-muted mb-2">
            {t('demoModalDescription')}
          </p>
          <Button 
            variant="primary" 
            onClick={onHide}
            className="px-4"
          >
            {t('getStartedNow')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DemoVideoModal;
