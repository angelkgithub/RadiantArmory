import React from 'react';

const HoverCard = ({ image, title, description, color, isActive, onHover }) => {
  return (
    <div 
      className={`v-card ${color} ${isActive ? "active" : ""}`}
      onMouseEnter={onHover}
    >
      <img src={image} alt={title} className="v-card-img" />
      <div className="v-overlay">
        <div className="v-card-tag">// AGENT_DATA</div>
        <h2 className="v-card-title">{title}</h2>
        <p className="v-card-desc">{description}</p>
      </div>
    </div>
  );
};

export default HoverCard;
