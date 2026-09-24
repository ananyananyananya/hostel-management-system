import { useState } from "react";
import {
  signUp,
  confirmSignUp,
} from "aws-amplify/auth";


function Signup({ onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [hostelBlock, setHostelBlock] =
    useState("");

  const [roomNumber, setRoomNumber] =
    useState("");

  const [confirmationCode, setConfirmationCode] =
    useState("");

  const [step, setStep] = useState("signup");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);


  // ==========================================
  // SIGN UP
  // ==========================================

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !hostelBlock ||
      !roomNumber
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }


    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    try {
      setIsLoading(true);


      const result = await signUp({
        username: email,
        password,

        options: {
          userAttributes: {
            email: email,
            name: name,
          },

          clientMetadata: {
            hostelBlock: hostelBlock,
            roomNumber: roomNumber,
          },
        },
      });


      console.log(
        "Signup result:",
        result
      );


      if (
        result.nextStep?.signUpStep ===
        "CONFIRM_SIGN_UP"
      ) {
        setStep("confirm");

        setMessage(
          "Account created. Check your email for the verification code."
        );
      } else {
        setMessage(
          "Account created successfully. You can now sign in."
        );

        setStep("done");
      }

    } catch (err) {

      console.error(
        "Signup error:",
        err
      );

      setError(
        err.message ||
          "Could not create your account."
      );

    } finally {
      setIsLoading(false);
    }
  };


  // ==========================================
  // CONFIRM SIGN UP
  // ==========================================

  const handleConfirmSignup = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");


    if (!confirmationCode) {
      setError(
        "Please enter the verification code."
      );

      return;
    }


    try {
      setIsLoading(true);


      const result = await confirmSignUp({
        username: email,

        confirmationCode:

          confirmationCode,

        options: {
          clientMetadata: {
            hostelBlock: hostelBlock,
            roomNumber: roomNumber,
          },
        },
      });


      console.log(
        "Confirmation result:",
        result
      );


      setMessage(
        "Email verified successfully. Your student account is ready."
      );

      setStep("done");

    } catch (err) {

      console.error(
        "Confirmation error:",
        err
      );

      setError(
        err.message ||
          "Invalid verification code."
      );

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="login-container">

      <div className="login-card">

        {/* ================================= */}
        {/* SIGN UP FORM */}
        {/* ================================= */}

        {step === "signup" && (
          <>
            <h1>Hostel Maintenance</h1>

            <h2>
              Create Student Account
            </h2>

            <form
              onSubmit={handleSignup}
            >

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                required
              />


              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
              />


              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                required
              />


              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
              />


              {/* HOSTEL BLOCK */}

              <select
                value={hostelBlock}
                onChange={(event) =>
                  setHostelBlock(
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Select hostel block
                </option>

                <option value="LH A">
                  LH-A
                </option>

                <option value="LH B">
                  LH-B
                </option>

                <option value="LH C">
                  LH-C
                </option>
                <option value="LH D">
                  LH-D
                </option>
                <option value="LH E">
                  LH-E
                </option>
                <option value="LH F">
                  LH-F
                </option>
                <option value="LH G">
                  LH-G
                </option>
                <option value="LH H">
                  LH-H
                </option>
                <option value="LH J">
                  LH-J
                </option>
                <option value="MH A">
                  MH-A
                </option>
                <option value="MH B">
                  MH-B
                </option>
                <option value="MH C">
                  MH-C
                </option>
                <option value="MH D">
                  MH-D
                </option>
                <option value="MH E">
                  MH-E
                </option>
                <option value="MH F">
                  MH-F
                </option>
                <option value="MH G">
                  MH-G
                </option>
                <option value="MH H">
                  MH-H
                </option>
                <option value="MH J">
                  MH-J
                </option>
                <option value="MH K">
                  MH-K
                </option>
                <option value="MH L">
                  MH-L
                </option>
                <option value="MH M">
                  MH-M
                </option>
                <option value="MH N">
                  MH-N
                </option>
                <option value="MH P">
                  MH-P
                </option>
                <option value="MH Q">
                  MH-Q
                </option>
                <option value="MH R">
                  MH-R
                </option>
                <option value="MH S">
                  MH-S
                </option>
                <option value="MH T">
                  MH-T
                </option>

                

              </select>


              {/* ROOM NUMBER */}

              <input
                type="text"
                placeholder="Room Number"
                value={roomNumber}
                onChange={(event) =>
                  setRoomNumber(
                    event.target.value
                  )
                }
                required
              />


              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}


              {message && (
                <p className="success-message">
                  {message}
                </p>
              )}


              <button
  type="submit"
  className="primary-button full-width"
  disabled={isLoading}
>
                {isLoading
                  ? "Creating account..."
                  : "Sign Up"}
              </button>

            </form>


            <p className="signup-link">

              Already have an account?

              {" "}

              <button
  type="button"
  className="primary-button full-width"
  onClick={
    onBackToLogin
  }
>
                Back to Login
              </button>

            </p>

          </>
        )}


        {/* ================================= */}
        {/* EMAIL CONFIRMATION */}
        {/* ================================= */}

        {step === "confirm" && (
          <>
            <h1>
              Verify Your Email
            </h1>


            <p>
              We sent a verification code to:
            </p>


            <strong>
              {email}
            </strong>


            <form
              onSubmit={
                handleConfirmSignup
              }
            >

              <input
                type="text"
                placeholder="Verification Code"
                value={confirmationCode}
                onChange={(event) =>
                  setConfirmationCode(
                    event.target.value
                  )
                }
                required
              />


              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}


              {message && (
                <p className="success-message">
                  {message}
                </p>
              )}


              <button
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Verifying..."
                  : "Verify Email"}
              </button>

            </form>

          </>
        )}


        {/* ================================= */}
        {/* DONE */}
        {/* ================================= */}

        {step === "done" && (
          <>
            <h1>
              Account Ready
            </h1>


            {message && (
              <p className="success-message">
                {message}
              </p>
            )}


            <button
              type="button"
              onClick={
                onBackToLogin
              }
            >
              Go to Login
            </button>

          </>
        )}

      </div>

    </div>
  );
}


export default Signup;