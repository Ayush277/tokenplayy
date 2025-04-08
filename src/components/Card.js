import { ethers } from 'ethers';

const Card = ({ occasion, id, tokenMaster, provider, account, toggle, setToggle, setOccasion }) => {
  console.log('Occasion Data:', occasion); // Debugging log to check occasion structure

  if (!occasion || !occasion.name) {
    console.warn('Invalid occasion data:', occasion); // Debugging log
    return null; // Do not render if occasion data is invalid
  }

  console.log('Rendering Card with occasion:', occasion); // Debugging log

  const togglePop = () => {
    setOccasion(occasion);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{occasion.date}</strong><br />{occasion.time}
        </p>

        <h3 className='card__name'>
          {occasion.name}
        </h3>

        <p className='card__location'>
          <small>{occasion.location}</small>
        </p>

        
        <p className='card__cost'>
          <strong>
            {occasion.cost ? ethers.utils.formatUnits(occasion.cost.toString(), 'ether') : '0'}
          </strong> ETH
        </p>

        {occasion.tickets && occasion.tickets.toString() === "0" ? (
          <button type="button" className='card__button--out' disabled>
            Sold Out
          </button>
        ) : (
          <button type="button" className='card__button' onClick={togglePop}>
            View Seats
          </button>
        )}
      </div>

      <hr />
    </div>
  );
};

export default Card;
