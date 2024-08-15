import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriceSidebar from "./PriceSidebar";
import Stepper from "./Stepper";
import { clearErrors } from "../../actions/orderAction";
import { useSnackbar } from "notistack";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import MetaData from "../Layouts/MetaData";

const Payment = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const [payDisable, setPayDisable] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const paymentData = {
    amount: Math.round(totalPrice * 100), // Amount should be in paisa
    email: user.email,
    phone: shippingInfo.phoneNo, // Ensure this field is correct
  };

  const initiatePayment = async () => {
    try {
      const config = {
        headers: {
          Authorization: "test_secret_key_0955faee90324c3b81519dcab0757680",
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://khalti.com/api/v2/payment/initiate/",
        paymentData,
        config
      );

      // Handle the response here
      const { token } = response.data;

      // Redirect the user to a page where they can input confirmation code and transaction pin
      window.location.href = `/confirm-payment?token=${token}`;
    } catch (error) {
      console.error("Payment initiation failed:", error);
      enqueueSnackbar("Payment initiation failed. Please try again later.", {
        variant: "error",
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setPayDisable(true);

    await initiatePayment();

    setPayDisable(false);
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="ShopEase: Secure Payment | Khalti" />
      <main className="w-full mt-20">
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
          <div className="flex-1">
            <Stepper activeStep={3}>
              <div className="w-full bg-white">
                <form
                  onSubmit={(e) => submitHandler(e)}
                  autoComplete="off"
                  className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden"
                >
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="payment-radio-group"
                      defaultValue="Khalti"
                      name="payment-radio-button"
                    >
                      <FormControlLabel
                        value="Khalti"
                        control={<Radio />}
                        label={
                          <div className="flex items-center gap-4">
                            <img
                              draggable="false"
                              className="h-6 w-6 object-contain"
                              src="https://web.khalti.com/static/img/logo1.png"
                              alt="Khalti Logo"
                            />
                            <span>Khalti</span>
                          </div>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                  <input
                    type="submit"
                    value={`Pay Rs.${totalPrice.toLocaleString()}`}
                    disabled={payDisable}
                    className={`${
                      payDisable
                        ? "bg-primary-grey cursor-not-allowed"
                        : "bg-primary-orange cursor-pointer"
                    } w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`}
                  />
                </form>
              </div>
            </Stepper>
          </div>
          <PriceSidebar cartItems={cartItems} />
        </div>
      </main>
    </>
  );
};

export default Payment;
