import React, { useContext, useEffect, useState } from "react";
import "./Placeorder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Placeorder = () => {
  const { getTotalCartAmount, token, food_list, url, cartItems } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems [item._id];
        orderItems.push(itemInfo);
      }
    });
   let orderData = {
    address:data,
    items:orderItems,
    amount:getTotalCartAmount()+5,
   }

   let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if(response.data.success){
       toast.success("Payment Done Successfully")
       const {session_url} = response.data;
       window.location.replace(session_url);
    }
    else{
      toast.error("Something went wrong")
    }
  };
   
  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate('/cart');
      toast.warn("Please Login to continue")

    }
    else if(getTotalCartAmount()===0)
    {
      navigate('/cart');
      toast.error("Add Items to continue")
    }
  },[token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <h1 className="title">Delivery Information</h1>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
            required
          />
          <input
            name="lastName"
            required
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          name="email"
          required
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email addresss"
        />
        <input
          name="street"
          required
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            name="city"
            required
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            name="state"
            required
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            name="zipcode"
            required
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            name="country"
            required
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          name="phone"
          required
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone No."
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}
              </b>
            </div>
          </div>
          <button type="submit" className="btn">
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default Placeorder;
