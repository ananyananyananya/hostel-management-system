import { useState } from "react";
import {
  signIn,
  confirmSignIn,
  fetchAuthSession,
  signOut,
} from "aws-amplify/auth";

function Login({ onLogin, onGoToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [step, setStep] = useState("login");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const determineRole = async () => {
    const session = await fetchAuthSession();

    const groups =
      session.tokens?.idToken?.payload?.["cognito:groups"] || [];

    let userRole = null;

    if (groups.includes("STUDENT")) {
      userRole = "student";
    } else if (groups.includes("WARDEN")) {
      userRole = "warden";
    } else if (groups.includes("TECHNICIAN")) {
      userRole = "technician";
    }

    if (!userRole) {
  await signOut();

  throw new Error(
    "Your account does not have a valid hostel system role assigned."
  );
}

    // Temporary mapping until we create the Users table.
    const technicianId =
      userRole === "technician" ? 1 : null;

    onLogin(userRole, technicianId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);
      try {
    await signOut();
  } catch (signOutError) {
    console.log("No previous session to clear.");
  }
      const result = await signIn({
        username: email,
        password,
      });

      console.log("Sign-in result:", result);

      if (
        result.nextStep?.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setStep("new-password");
        setMessage(
          "This is your first login. Please create a new permanent password."
        );
        return;
      }

      if (
        result.nextStep?.signInStep ===
        "CONFIRM_SIGN_UP"
      ) {
        setError(
          "Please verify your email address before signing in."
        );
        return;
      }

      if (result.isSignedIn) {
        await determineRole();
      } else {
        setError(
          `Additional sign-in step required: ${result.nextStep?.signInStep || "unknown"}`
        );
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!newPassword || !confirmNewPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("The passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await confirmSignIn({
        challengeResponse: newPassword,
      });

      console.log("New password result:", result);

      if (result.isSignedIn) {
        await determineRole();
      } else {
        setError(
          "Password setup was not completed. Please try again."
        );
      }
    } catch (err) {
      console.error("New password error:", err);

      setError(
        err.message ||
          "Could not set the new password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {step === "login" && (
          <>
            <h1>Hostel Maintenance</h1>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              <button
  type="submit"
  className="primary-button full-width"
  disabled={isLoading}
>
                {isLoading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            <p className="signup-link">
              New student?{" "}
              <button
                type="button"
                onClick={onGoToSignup}
              >
                Create an account
              </button>
            </p>
          </>
        )}

        {step === "new-password" && (
          <>
            <h1>First Login</h1>

            <p>{message}</p>

            <p>
              Your temporary password must be replaced
              with a permanent password.
            </p>

            <form onSubmit={handleNewPassword}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(event) =>
                  setConfirmNewPassword(
                    event.target.value
                  )
                }
              />

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Updating..."
                  : "Set New Password"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;