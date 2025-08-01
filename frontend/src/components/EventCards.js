// frontend/src/components/EventCards.js
import React from 'react';
import PropTypes from 'prop-types';
import './EventCards.css';

const EventCards = ({ eventCards = [], onCompleteChallenge, completedChallenges = [], loading, userCredits }) => {
  return (
    <div className="event-cards-grid">
      {eventCards.map(card => (
        <div
          key={card.id}
          className={`event-card ${completedChallenges.includes(card.id) ? 'completed' : ''}`}
        >
          <h3>{card.title}</h3>
          <p>{card.message}</p>
          <p><strong>Feladat:</strong> {card.task}</p>
          <p>Költség: {card.cost} TK</p>
          {completedChallenges.includes(card.id) ? (
            <button disabled className="btn btn-success">Teljesítve</button>
          ) : (
            <button 
              onClick={() => onCompleteChallenge(card.id)} 
              className="btn btn-primary"
              disabled={loading || userCredits < card.cost}
            >
              Teljesítés
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

EventCards.propTypes = {
  eventCards: PropTypes.array.isRequired,
  onCompleteChallenge: PropTypes.func.isRequired,
  completedChallenges: PropTypes.array,
  loading: PropTypes.bool,
  userCredits: PropTypes.number
};

export default EventCards;
