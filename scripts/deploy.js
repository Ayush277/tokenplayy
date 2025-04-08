const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "TokenMaster"
  const SYMBOL = "TM"

  // Deploy contract
  const TokenMaster = await ethers.getContractFactory("TokenMaster")
  const tokenMaster = await TokenMaster.deploy(NAME, SYMBOL)
  await tokenMaster.deployed()

  console.log(`Deployed TokenMaster Contract at: ${tokenMaster.address}\n`)

  // List 6 events
  const occasions = [
    {
      name: "IPL Final 2025",
      cost: tokens(3),
      tickets: 0,
      date: "May 26",
      time: "7:30 PM IST",
      location: "Narendra Modi Stadium - Ahmedabad"
    },
    {
      name: "ISL Final 2025",
      cost: tokens(1),
      tickets: 850,
      date: "May 30",
      time: "7:00 PM IST",
      location: "Salt Lake Stadium - Kolkata"
    },
    {
      name: "Pro Kabaddi League Finals",
      cost: tokens(0.5),
      tickets: 1_200,
      date: "June 5",
      time: "8:00 PM IST",
      location: "Gachibowli Indoor Stadium - Hyderabad"
    },
    {
      name: "India vs Pakistan T20",
      cost: tokens(5),
      tickets: 0,
      date: "June 12",
      time: "7:00 PM IST",
      location: "Wankhede Stadium - Mumbai"
    },
    {
      name: "NBA India Games",
      cost: tokens(2),
      tickets: 750,
      date: "June 20",
      time: "6:30 PM IST",
      location: "NSCI Dome - Mumbai"
    }
]


  for (var i = 0; i < 5; i++) {
    const transaction = await tokenMaster.connect(deployer).list(
      occasions[i].name,
      occasions[i].cost,
      occasions[i].tickets,
      occasions[i].date,
      occasions[i].time,
      occasions[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});