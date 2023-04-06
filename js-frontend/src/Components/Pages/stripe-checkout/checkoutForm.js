import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { SELLER_API_URL } from '../../utils/contants';
import CustomButton from '../../Common/Button/CustomButton';

const CheckoutForm = (data) => {
  const [isHire, setIsHire] = useState(false);

  // console.log("amount => ", amount);
  const amount = data.data.amount;
  const bidId = data.data._id;
  console.log('amount => ', amount);

  const elements = useElements();
  const stripe = useStripe();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe && !elements) {
      return;
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Bearer sk_test_51Lf61VClGEoLO7SYiy3GDaccK9qiWD1v9eY9xmq7nNhm4mF2Nz7BjthW3b6qMzQXbejHCDt9JEHPcfhIMTAZznIk00DitYVWiw',
    };
    const params = new URLSearchParams();
    params.append('capture_method', 'manual');
    params.append('currency', 'usd');
    // params.append("confirm", "true");
    params.append('amount', amount * 100);
    params.append('payment_method_types[]', 'card');

    const paymentIntent = await axios.post('https://api.stripe.com/v1/payment_intents', params, {
      headers,
    });

    const id = paymentIntent.data.id;
    console.log('paymentIntent');
    console.log(paymentIntent);

    const ConfirmParams = new URLSearchParams();
    ConfirmParams.append('payment_method', 'pm_card_visa');
    const paymentConfirm = await axios.post(
      `https://api.stripe.com/v1/payment_intents/${id}/confirm`,
      ConfirmParams,
      { headers },
    );

    if (paymentConfirm) {
      axios
        .put(SELLER_API_URL + 'bids/updateStatus/' + bidId, {
          paymentId: id,
        })
        .then((res) => {
          console.log(res.data, 'res');
          console.log('proposals => -> ', res.data);
        });
    }
  };

  const handleHire = () => {
    setIsHire(!isHire);
  };

  return (
    <>
      <div>
        {isHire ? (
          <div>
            <form id="payment-form" onSubmit={handleSubmit}>
              <CardElement />
              {/* <CustomButton classes="mt-4" type="primary" block values="Pay" /> */}
              <button type="submit">Pay</button>
            </form>
            <CustomButton
              classes="mt-4"
              type="primary"
              block
              values="Cancel"
              onClick={handleHire}
            />
            {/* <button type="button" onClick={handleHire}>
              Cancel
            </button> */}
          </div>
        ) : (
          <>
            <CustomButton classes="mt-4" type="primary" block values="Hire" onClick={handleHire} />
            {/* <button type="button">Complete</button> */}
          </>
        )}
      </div>
    </>
  );
};

export default CheckoutForm;
