import { LOGIN_COPY } from './loginStatics'

export function Login() {
  const handleGoogleSignIn = () => {
    // TODO: Wire up Google OAuth flow
    alert('Sign in with Google clicked')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-gray-900">{LOGIN_COPY.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{LOGIN_COPY.subtitle}</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.602 31.945 29.197 35 24 35 16.82 35 11 29.18 11 22S16.82 9 24 9c3.438 0 6.57 1.296 8.944 3.406l5.657-5.657C34.759 3.029 29.64 1 24 1 10.745 1 0 11.745 0 25s10.745 24 24 24 24-10.745 24-24c0-1.627-.168-3.214-.389-4.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.264 15.18 18.71 12 24 12c3.438 0 6.57 1.296 8.944 3.406l5.657-5.657C34.759 3.029 29.64 1 24 1 15.317 1 7.925 5.834 4.063 12.691l2.243 2z"/>
            <path fill="#4CAF50" d="M24 49c5.089 0 9.739-1.742 13.409-4.691l-6.196-5.238C29.242 40.511 26.742 41 24 41 18.857 41 14.357 37.946 12.697 33.223l-6.48 4.989C9.868 44.053 16.475 49 24 49z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.361 3.862-5.766 6.917-11.303 6.917-7.18 0-13-5.82-13-13S16.82 9 24 9c3.438 0 6.57 1.296 8.944 3.406l5.657-5.657C34.759 3.029 29.64 1 24 1 10.745 1 0 11.745 0 25s10.745 24 24 24 24-10.745 24-24c0-1.627-.168-3.214-.389-4.917z"/>
          </svg>
          {LOGIN_COPY.googleCta}
        </button>
      </div>
    </div>
  )
}

export default Login


