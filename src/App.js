import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Ravi",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Rahul",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Durgesh",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleShowAddFriend = () => {
    setShowAddFriend((show) => !show);
  };

  const handleAddFriend = (friend) => {
    setFriends((prevFriends) => [...prevFriends, friend]);
    setShowAddFriend(false);
  };

  const handleSelection = (friend) => {
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <Friendslist
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <button className="button" onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function Friendslist({ friends, onSelection, selectedFriend }) {
  const [sortCriteria, setSortCriteria] = useState("alphabetical");

  const sortFriends = (a, b) => {
    switch (sortCriteria) {
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "youHaveToPay":
        return a.balance - b.balance;
      case "theyHaveToPay":
        return b.balance - a.balance;
      case "zeroAndYouHaveToPay":
        return a.balance === 0 ? (b.balance < 0 ? -1 : 0) : 1;
      default:
        return 0;
    }
  };

  const sortedFriends = [...friends].sort(sortFriends);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  return (
    <div>
      <div>
        Sort by:{" "}
        <select
          value={sortCriteria}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="alphabetical">Alphabetical</option>
          <option value="youHaveToPay">You Have to Pay</option>
          <option value="theyHaveToPay">They Have to Pay</option>
          <option value="zeroAndYouHaveToPay">0 and You Have to Pay</option>
        </select>
      </div>
      <ul>
        {sortedFriends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            selectedFriend={selectedFriend}
            onSelection={onSelection}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <button className="button" onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("http://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      name,
      image: `${image}?=${crypto.randomUUID()}`,
      balance: 0,
      id: crypto.randomUUID(),
    };

    onAddFriend(newFriend);
    setName("");
    setImage("http://i.pravatar.cc/48");
  };

  return (
    <form className="from-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL </label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button">Add</button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const paidByFriend = bill ? bill - paidBy : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !paidBy) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidBy);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your Expenses</label>
      <input
        type="text"
        value={paidBy}
        onChange={(e) =>
          setPaidBy(
            Number(e.target.value) > bill ? paidBy : Number(e.target.value)
          )
        }
      />
      <label>{selectedFriend.name}'s Expenses</label>
      <input type="text" disabled value={paidByFriend} />
      <label>Who is paying?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">X</option>
      </select>
    </form>
  );
}
