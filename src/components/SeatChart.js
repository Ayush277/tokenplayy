import { useEffect, useState } from 'react'

// Import Components
import Seat from './Seat'

// Import Assets
import close from '../assets/close.svg'

const SeatChart = ({ occasion, tokenMaster, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)

  const getSeatsTaken = async () => {
    try {
        const seatsTaken = await tokenMaster.getSeatsTaken(occasion.id)
        console.log("Seats Taken:", seatsTaken); // Debugging
        setSeatsTaken(seatsTaken)
    } catch (error) {
        console.error("Error fetching seats:", error)
    }
}


const buyHandler = async (_seat) => {
  try {
      setHasSold(false)

      const signer = await provider.getSigner()
      console.log("Buying seat:", _seat); // Debugging
      const transaction = await tokenMaster.connect(signer).mint(occasion.id, _seat, { value: occasion.cost })
      await transaction.wait()

      setHasSold(true)
      console.log("Seat purchased successfully!");
  } catch (error) {
      console.error("Error purchasing seat:", error);
  }
}


useEffect(() => {
  console.log("Seat update triggered:", hasSold);
  getSeatsTaken();
}, [hasSold]);


  return (
    <div className="occasion">
      <div className="occasion__seating">
        <h1>{occasion.name}Game seats</h1>

        <button onClick={() => setToggle(false)} className="occasion__close">
          <img src={close} alt="Close" />
        </button>

        <div className="occasion__stage">
          <strong>STAGE</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--1 ">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(Number(occasion.maxTickets) - 50).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={(Number(occasion.maxTickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}
      </div>
    </div >
  );
}

export default SeatChart;